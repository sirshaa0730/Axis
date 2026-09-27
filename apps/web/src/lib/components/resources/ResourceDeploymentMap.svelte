<script lang="ts">
  import {
    allResources,
    allFacilities,
    activeShipments,
    selectedResourceId,
    selectedResource,
    selectResource,
    activeResourceMapLayer,
    resourceMapFocus,
    isDeployModalOpen,
    isDetailModalOpen,
    currentResourcePackage
  } from '../../stores/resourceStore';
  import type { ResourceItem, FacilityItem } from '../../types/resources';

  let containerEl: HTMLDivElement;
  let isFullscreen = false;
  let zoomLevel = 1.0;
  let panOffset = { x: 0, y: 0 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let isLayersMenuOpen = false;

  const mapLayerTabs: Array<
    'ALL RESOURCES' | 'HELICOPTERS' | 'BOATS' | 'VEHICLES' | 'SUPPLIES' | 'FACILITIES'
  > = ['ALL RESOURCES', 'HELICOPTERS', 'BOATS', 'VEHICLES', 'SUPPLIES', 'FACILITIES'];

  function handleZoomIn() {
    zoomLevel = Math.min(2.5, zoomLevel + 0.2);
  }

  function handleZoomOut() {
    zoomLevel = Math.max(0.7, zoomLevel - 0.2);
  }

  function handleResetView() {
    zoomLevel = 1.0;
    panOffset = { x: 0, y: 0 };
    resourceMapFocus.set({
      center: [90.4125, 23.8103],
      zoom: 1.0
    });
  }

  function handleLocateSelected() {
    if ($selectedResource) {
      resourceMapFocus.set({
        center: $selectedResource.coords,
        zoom: 1.4,
        highlightId: $selectedResource.id
      });
      zoomLevel = 1.4;
      panOffset = { x: 0, y: 0 };
    }
  }

  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
  }

  function handleMouseDown(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('.map-hud-control, .marker-element, .inspector-card')) return;
    isDragging = true;
    dragStart = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    panOffset = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
  }

  function handleMouseUp() {
    isDragging = false;
  }

  // Geographic projection helper: Map Lng/Lat to Canvas % (for Bangladesh default)
  // Bangladesh bbox: Lng 88.0 -> 92.8, Lat 20.6 -> 26.6
  function projectCoords(coords: [number, number]): { x: number; y: number } {
    const minLng = 88.0;
    const maxLng = 92.8;
    const minLat = 20.6;
    const maxLat = 26.6;

    const lng = coords[0];
    const lat = coords[1];

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
  }

  // Filter resources based on active map layer
  $: filteredMapResources = $allResources.filter((r) => {
    switch ($activeResourceMapLayer) {
      case 'HELICOPTERS':
        return r.category === 'Helicopters';
      case 'BOATS':
        return r.category === 'Boats';
      case 'VEHICLES':
        return r.category === 'Ground Vehicles';
      case 'SUPPLIES':
        return (
          r.category === 'Medical Supplies' ||
          r.category === 'Food & Water' ||
          r.category === 'Temporary Shelters' ||
          r.category === 'Fuel & Energy'
        );
      case 'FACILITIES':
        return false; // Facilities handled separately
      default:
        return true;
    }
  });

  const cities = [
    { name: 'Dhaka', coords: [90.41, 23.81], isCapital: true },
    { name: 'Mymensingh', coords: [90.40, 24.75] },
    { name: 'Sylhet', coords: [91.87, 24.89] },
    { name: 'Rajshahi', coords: [88.60, 24.37] },
    { name: 'Khulna', coords: [89.54, 22.84] },
    { name: 'Barisal', coords: [90.35, 22.70] },
    { name: 'Chittagong', coords: [91.83, 22.35] }
  ];

  function getMarkerStyle(category: string) {
    switch (category) {
      case 'Helicopters':
        return { color: '#8B5CF6', bg: 'bg-[#8B5CF6]/20', border: 'border-[#8B5CF6]', icon: '🚁' };
      case 'Boats':
        return { color: '#3B82F6', bg: 'bg-[#3B82F6]/20', border: 'border-[#3B82F6]', icon: '🚤' };
      case 'Ground Vehicles':
        return { color: '#10B981', bg: 'bg-[#10B981]/20', border: 'border-[#10B981]', icon: '🚛' };
      case 'Medical Supplies':
        return { color: '#EF4444', bg: 'bg-[#EF4444]/20', border: 'border-[#EF4444]', icon: '✚' };
      case 'Temporary Shelters':
        return { color: '#F97316', bg: 'bg-[#F97316]/20', border: 'border-[#F97316]', icon: '⛺' };
      case 'Food & Water':
        return { color: '#10B981', bg: 'bg-[#10B981]/20', border: 'border-[#10B981]', icon: '🍞' };
      default:
        return { color: '#EAB308', bg: 'bg-[#EAB308]/20', border: 'border-[#EAB308]', icon: '📦' };
    }
  }
</script>

<div
  bind:this={containerEl}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  class="relative flex-1 flex flex-col bg-[#020914] border border-white/10 rounded-2xl overflow-hidden select-none transition-all duration-300 {
    isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full'
  }"
>
  <!-- Top Map Header Bar (Title, Layer Toggles, Controls) -->
  <div class="absolute top-0 inset-x-0 z-20 flex flex-wrap items-center justify-between p-3 bg-gradient-to-b from-[#020914]/90 to-transparent pointer-events-none gap-2">
    <!-- Title -->
    <div class="flex items-center gap-2 pointer-events-auto bg-[#061425]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
      <div class="w-3.5 h-3.5 rounded-full border border-[#00E5FF] flex items-center justify-center">
        <span class="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]"></span>
      </div>
      <span class="text-xs font-mono font-bold tracking-wider text-white uppercase">
        RESOURCE DEPLOYMENT MAP
      </span>
      <span class="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-md border border-[#00E5FF]/20">
        {$currentResourcePackage.locationName}
      </span>
    </div>

    <!-- Center/Right Map Layer Buttons -->
    <div class="flex items-center gap-1.5 pointer-events-auto map-hud-control overflow-x-auto bg-[#061425]/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
      {#each mapLayerTabs as layer}
        <button
          on:click={() => activeResourceMapLayer.set(layer)}
          class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all cursor-pointer whitespace-nowrap {
            $activeResourceMapLayer === layer
              ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,0.25)]'
              : 'text-[#8BA1B8] hover:text-white hover:bg-white/5 border border-transparent'
          }"
        >
          {layer}
        </button>
      {/each}

      <!-- Fullscreen Toggle Button -->
      <button
        on:click={toggleFullscreen}
        class="p-1 rounded-lg text-[#8BA1B8] hover:text-white hover:bg-white/10 transition-all cursor-pointer ml-1"
        title="Toggle Fullscreen Map"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if isFullscreen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Main Viewport Canvas Stage -->
  <div
    class="flex-1 w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
    style="transform: scale({zoomLevel}) translate({panOffset.x}px, {panOffset.y}px); transform-origin: center center; transition: transform 0.15s ease-out;"
  >
    <!-- Vector Map Grid & Background -->
    <svg class="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 1000 650" preserveAspectRatio="none">
      <defs>
        <!-- Topographic Coordinate Grid -->
        <pattern id="resGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          <circle cx="0" cy="0" r="1.5" fill="rgba(0,229,255,0.2)" />
        </pattern>

        <linearGradient id="shipmentRouteGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00E5FF" />
          <stop offset="100%" stop-color="#8B5CF6" />
        </linearGradient>
      </defs>

      <!-- Grid Background -->
      <rect width="1000" height="650" fill="url(#resGrid)" />

      <!-- Surrounding Geographic Labels -->
      <text x="180" y="320" fill="#374151" font-family="monospace" font-size="20" font-weight="bold" letter-spacing="4">INDIA</text>
      <text x="760" y="360" fill="#374151" font-family="monospace" font-size="18" font-weight="bold" letter-spacing="4">MYANMAR</text>
      <text x="450" y="610" fill="#1F2937" font-family="monospace" font-size="16" letter-spacing="6">BAY OF BENGAL</text>

      <!-- Stylized Bangladesh Geographic Territory Vector Boundary -->
      <path
        d="M 320,80 Q 420,50 560,70 Q 640,110 680,180 Q 750,220 720,320 Q 680,420 740,480 Q 720,550 630,520 Q 520,500 480,560 Q 400,540 360,520 Q 320,440 300,320 Q 280,240 320,80 Z"
        fill="#031124"
        stroke="#00E5FF"
        stroke-opacity="0.3"
        stroke-width="1.5"
      />

      <!-- Major Rivers (Brahmaputra, Padma, Meghna, Surma) -->
      <path d="M 450,60 Q 480,150 490,220 Q 520,300 540,390 Q 560,480 540,550" fill="none" stroke="#00E5FF" stroke-opacity="0.35" stroke-width="2" />
      <path d="M 300,280 Q 400,290 490,300" fill="none" stroke="#00E5FF" stroke-opacity="0.35" stroke-width="2" />
      <path d="M 640,160 Q 600,220 540,300" fill="none" stroke="#00E5FF" stroke-opacity="0.35" stroke-width="2" />

      <!-- Active Logistics Routes / Shipments In Transit -->
      {#each $activeShipments as shipment}
        <g>
          <polyline
            points="{shipment.path.map((p) => {
              const proj = projectCoords(p);
              return `${proj.x * 10},${proj.y * 6.5}`;
            }).join(' ')}"
            fill="none"
            stroke="url(#shipmentRouteGlow)"
            stroke-width="2.5"
            stroke-dasharray="6,4"
            stroke-linecap="round"
          >
            <animate attributeName="stroke-dashoffset" values="20;0" dur="1.8s" repeatCount="indefinite" />
          </polyline>
        </g>
      {/each}
    </svg>

    <!-- Geographic City Labels -->
    {#each cities as city}
      {@const proj = projectCoords(city.coords)}
      <div
        class="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5"
        style="left: {proj.x}%; top: {proj.y}%;"
      >
        <span class="w-1.5 h-1.5 rounded-full {city.isCapital ? 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]' : 'bg-white/50'}"></span>
        <span class="font-mono text-[10px] font-bold tracking-wider {city.isCapital ? 'text-white text-xs' : 'text-[#8BA1B8]'}">
          {city.name}
        </span>
      </div>
    {/each}

    <!-- Facility Markers (Depots, Ports, Air Bases) -->
    {#if $activeResourceMapLayer === 'ALL RESOURCES' || $activeResourceMapLayer === 'FACILITIES'}
      {#each $allFacilities as fac (fac.id)}
        {@const proj = projectCoords(fac.coords)}
        <button
          on:click|stopPropagation={() => {
            resourceMapFocus.set({ center: fac.coords, zoom: 1.4, highlightId: fac.id });
          }}
          class="marker-element absolute z-15 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer p-1 transition-transform hover:scale-125 focus:outline-none"
          style="left: {proj.x}%; top: {proj.y}%;"
          title="{fac.name} ({fac.type}) - Capacity {fac.capacityPct}%"
        >
          <div class="relative w-8 h-8 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4] text-[#06B6D4] flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <span class="text-xs">
              {#if fac.type === 'Air Base'}
                🛫
              {:else if fac.type === 'Port'}
                ⚓
              {:else if fac.type === 'Hospital'}
                🏥
              {:else}
                🏭
              {/if}
            </span>
          </div>
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-[#020914]/90 border border-white/10 text-[9px] font-mono text-white whitespace-nowrap shadow-md">
            {fac.name}
          </div>
        </button>
      {/each}
    {/if}

    <!-- Resource Markers (Helicopters, Boats, Vehicles, Medical, Shelters, Supplies) -->
    {#if $activeResourceMapLayer !== 'FACILITIES'}
      {#each filteredMapResources as item (item.id)}
        {@const proj = projectCoords(item.coords)}
        {@const style = getMarkerStyle(item.category)}
        <button
          on:click|stopPropagation={() => selectResource(item.id)}
          class="marker-element absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer p-1 transition-transform hover:scale-125 focus:outline-none"
          style="left: {proj.x}%; top: {proj.y}%;"
          title="{item.id} — {item.name} ({item.status})"
        >
          <!-- Pulsing Glow when Selected -->
          {#if $selectedResourceId === item.id}
            <span class="absolute inset-0 rounded-full animate-ping opacity-75" style="background-color: {style.color};"></span>
          {/if}

          <!-- Icon Container -->
          <div
            class="relative w-7 h-7 rounded-full flex items-center justify-center border shadow-lg transition-all {
              $selectedResourceId === item.id ? 'ring-2 ring-white scale-110' : ''
            } {style.bg} {style.border}"
            style="box-shadow: 0 0 10px {style.color};"
          >
            <span class="text-xs leading-none">{style.icon}</span>
          </div>

          <!-- Micro ID Label -->
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-[#020914]/90 border border-white/10 text-[9px] font-mono text-white whitespace-nowrap shadow-md">
            {item.id}
          </div>
        </button>
      {/each}
    {/if}
  </div>

  <!-- Embedded Dynamic Map Legend (Bottom-Left) -->
  <div class="map-hud-control absolute bottom-3.5 left-3.5 z-20 p-2.5 rounded-xl bg-[#061425]/90 backdrop-blur-xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.6)] text-[11px] font-mono select-none">
    <div class="flex flex-col gap-1.5 text-white/90">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_6px_#8B5CF6]"></span>
        <span class="text-[#C5D1DE]">Helicopters</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_6px_#3B82F6]"></span>
        <span class="text-[#C5D1DE]">Boats</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
        <span class="text-[#C5D1DE]">Ground Vehicles</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]"></span>
        <span class="text-[#C5D1DE]">Medical Supplies</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#F97316] shadow-[0_0_6px_#F97316]"></span>
        <span class="text-[#C5D1DE]">Shelters</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#06B6D4] shadow-[0_0_6px_#06B6D4]"></span>
        <span class="text-[#C5D1DE]">Facilities & Depots</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-4 h-0.5 border-b-2 border-dashed border-[#00E5FF]"></span>
        <span class="text-[#C5D1DE]">Active Routes</span>
      </div>
    </div>
  </div>

  <!-- Map Action Controls (Right Rail) -->
  <div class="map-hud-control absolute top-16 right-3.5 z-20 flex flex-col gap-1.5 bg-[#061425]/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
    <!-- Zoom In -->
    <button
      on:click={handleZoomIn}
      class="w-7 h-7 rounded-lg hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
      title="Zoom In (+)"
    >
      +
    </button>

    <!-- Zoom Out -->
    <button
      on:click={handleZoomOut}
      class="w-7 h-7 rounded-lg hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
      title="Zoom Out (−)"
    >
      −
    </button>

    <div class="w-full h-[1px] bg-white/10"></div>

    <!-- Reset View -->
    <button
      on:click={handleResetView}
      class="w-7 h-7 rounded-lg hover:bg-white/10 text-[#00E5FF] flex items-center justify-center text-xs transition-all cursor-pointer"
      title="RESET VIEW"
    >
      ↺
    </button>

    <!-- Locate Selected Resource -->
    <button
      on:click={handleLocateSelected}
      class="w-7 h-7 rounded-lg hover:bg-white/10 text-[#00E5FF] flex items-center justify-center text-sm transition-all cursor-pointer"
      title="LOCATE RESOURCE"
    >
      ⊙
    </button>

    <!-- Layers Menu Toggle -->
    <button
      on:click={() => isLayersMenuOpen = !isLayersMenuOpen}
      class="w-7 h-7 rounded-lg hover:bg-white/10 text-[#8BA1B8] hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
      title="LAYERS"
    >
      ≡
    </button>
  </div>

  <!-- Floating Layers Dropdown Menu -->
  {#if isLayersMenuOpen}
    <div class="map-hud-control absolute top-44 right-3.5 z-30 w-44 p-2.5 rounded-xl bg-[#061425]/95 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col gap-1 text-[11px] font-mono">
      <div class="text-[9px] uppercase tracking-wider text-[#8BA1B8] pb-1 border-b border-white/10 mb-1">
        Visible Layers
      </div>
      {#each mapLayerTabs as layer}
        <button
          on:click={() => {
            activeResourceMapLayer.set(layer);
            isLayersMenuOpen = false;
          }}
          class="px-2 py-1 rounded-lg text-left transition-all cursor-pointer {
            $activeResourceMapLayer === layer
              ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold'
              : 'text-[#8BA1B8] hover:text-white hover:bg-white/5'
          }"
        >
          {layer}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Compact Marker Inspector Card (When Resource Selected) -->
  {#if $selectedResource}
    <div class="inspector-card absolute top-14 left-3.5 z-30 w-72 p-3.5 rounded-2xl bg-[#061425]/95 backdrop-blur-2xl border border-[#00E5FF]/50 shadow-[0_8px_32px_rgba(0,0,0,0.8)] text-left select-none animate-fadeIn">
      <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]"></span>
          <span class="text-xs font-mono font-bold text-white uppercase truncate max-w-[190px]">
            {$selectedResource.id} — {$selectedResource.name}
          </span>
        </div>
        <button
          on:click={() => selectedResourceId.set(null)}
          class="text-[#8BA1B8] hover:text-white text-xs font-mono p-1 rounded hover:bg-white/10 cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div class="space-y-1.5 text-[11px] font-mono mb-3">
        <div class="flex justify-between text-[#8BA1B8]">
          <span>Type:</span>
          <span class="text-white">{$selectedResource.type}</span>
        </div>
        <div class="flex justify-between text-[#8BA1B8]">
          <span>Location:</span>
          <span class="text-[#00E5FF] truncate max-w-[150px]">{$selectedResource.location}</span>
        </div>
        <div class="flex justify-between text-[#8BA1B8]">
          <span>Status:</span>
          <span class="font-bold {
            $selectedResource.status === 'AVAILABLE' ? 'text-emerald-400' :
            $selectedResource.status === 'DEPLOYED' ? 'text-[#00E5FF]' :
            $selectedResource.status === 'EN ROUTE' ? 'text-amber-400' : 'text-rose-400'
          }">
            {$selectedResource.status}
          </span>
        </div>
        <div class="flex justify-between text-[#8BA1B8]">
          <span>Capacity:</span>
          <span class="text-white">{$selectedResource.capacity}</span>
        </div>
        <div class="flex justify-between text-[#8BA1B8]">
          <span>Fuel / Stock:</span>
          <span class="text-emerald-400 font-bold">{$selectedResource.fuelOrStockPct}%</span>
        </div>
        <div class="flex justify-between text-[#8BA1B8]">
          <span>Assigned:</span>
          <span class="text-white">{$selectedResource.assignedTo}</span>
        </div>
      </div>

      <!-- Action Buttons Matching Reference Prompt: [DEPLOY] and [VIEW DETAILS] -->
      <div class="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
        <button
          on:click={() => isDeployModalOpen.set(true)}
          class="py-1 px-2 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 border border-[#00E5FF]/50 text-[#00E5FF] text-[10px] font-mono font-bold transition-all text-center cursor-pointer"
        >
          [DEPLOY]
        </button>
        <button
          on:click={() => isDetailModalOpen.set(true)}
          class="py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white text-[10px] font-mono transition-all text-center cursor-pointer"
        >
          [VIEW DETAILS]
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }
</style>

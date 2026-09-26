<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { selectedIncident } from '../../stores/incidentStore';
  import { activeAnalysisMode, activeHazardType } from '../../stores/analysisStore';

  let canvasEl: HTMLCanvasElement;
  let containerEl: HTMLDivElement;
  let animId: number;

  // Pan & Zoom
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Layers
  let showRiskHeat = true;
  let showRivers = true;
  let showDistricts = true;
  let showCities = true;
  let showInfrastructure = true;
  let showLayersMenu = false;

  let animTime = 0;

  function zoomIn() {
    zoom = Math.min(2.5, zoom + 0.2);
  }

  function zoomOut() {
    zoom = Math.max(0.6, zoom - 0.2);
  }

  function resetView() {
    zoom = 1.0;
    panX = 0;
    panY = 0;
  }

  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    zoom = Math.max(0.5, Math.min(3.0, zoom * factor));
  }

  onMount(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    drawLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  });

  onDestroy(() => {
    if (animId) cancelAnimationFrame(animId);
  });

  function handleResize() {
    if (!containerEl || !canvasEl) return;
    const rect = containerEl.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasEl.width = rect.width * dpr;
    canvasEl.height = rect.height * dpr;
  }

  function drawLoop() {
    animId = requestAnimationFrame(drawLoop);
    animTime += 0.025;
    render();
  }

  function render() {
    if (!canvasEl || !containerEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    const width = canvasEl.width;
    const height = canvasEl.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Dark cartographic satellite background
    const bgGrad = ctx.createRadialGradient(
      width * 0.48, height * 0.45, 80 * dpr,
      width * 0.50, height * 0.50, width * 0.70
    );
    bgGrad.addColorStop(0, '#061a33');
    bgGrad.addColorStop(0.45, '#041224');
    bgGrad.addColorStop(0.85, '#020914');
    bgGrad.addColorStop(1, '#01050a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Center coordinates origin for Bangladesh
    const cx = width / 2 + panX * dpr;
    const cy = height / 2 + panY * dpr;
    const s = 145 * zoom * dpr;

    // Projection mapping from Longitude/Latitude centered on Bangladesh (90.35, 23.8)
    const baseLng = 90.35;
    const baseLat = 23.8;

    function proj(lng: number, lat: number): [number, number] {
      const px = cx + (lng - baseLng) * s;
      const py = cy - (lat - baseLat) * s * 1.08;
      return [px, py];
    }

    // 1. Subtle latitude/longitude coordinate grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let lng = 86; lng <= 95; lng += 1.5) {
      const [gx] = proj(lng, baseLat);
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let lat = 20; lat <= 28; lat += 1.5) {
      const [, gy] = proj(baseLng, lat);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // 2. Neighboring Country Territorial Outlines & Labels
    ctx.font = `bold ${10 * dpr}px monospace`;
    ctx.fillStyle = 'rgba(139, 161, 184, 0.4)';
    const [indW_x, indW_y] = proj(87.5, 24.5);
    ctx.fillText('INDIA', indW_x, indW_y);

    const [indE_x, indE_y] = proj(92.8, 25.4);
    ctx.fillText('INDIA', indE_x, indE_y);

    const [mya_x, mya_y] = proj(93.1, 21.8);
    ctx.fillText('MYANMAR', mya_x, mya_y);

    // 3. Bangladesh National Border Polygon
    const bdBorder: Array<[number, number]> = [
      [88.05, 26.35], [88.55, 26.63], [89.05, 26.15], [89.85, 26.10],
      [89.80, 25.20], [90.55, 25.18], [91.85, 25.20], [92.35, 25.10],
      [92.55, 24.65], [92.35, 24.20], [91.95, 24.05], [92.20, 23.70],
      [92.35, 23.25], [92.65, 22.35], [92.35, 21.45], [92.15, 20.75],
      [91.95, 21.45], [91.45, 22.15], [90.85, 22.10], [90.35, 21.85],
      [89.55, 21.65], [89.05, 21.75], [88.95, 22.45], [88.55, 22.95],
      [88.65, 23.85], [88.25, 24.65], [88.15, 25.45], [88.05, 26.35]
    ];

    ctx.beginPath();
    const [firstBx, firstBy] = proj(bdBorder[0][0], bdBorder[0][1]);
    ctx.moveTo(firstBx, firstBy);
    for (let i = 1; i < bdBorder.length; i++) {
      const [bx, by] = proj(bdBorder[i][0], bdBorder[i][1]);
      ctx.lineTo(bx, by);
    }
    ctx.closePath();

    // Dark terrain fill
    ctx.fillStyle = 'rgba(7, 24, 46, 0.65)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 4. Spatial Risk Heat Visualization (Red -> Orange -> Violet -> Cyan)
    if (showRiskHeat) {
      // High-risk zones with radial gradient auras
      const riskHotspots = [
        { name: 'Dhaka', lng: 90.41, lat: 23.81, rad: 55, color: 'rgba(239, 68, 68, 0.85)', stop2: 'rgba(220, 38, 38, 0.45)' },
        { name: 'Sylhet', lng: 91.87, lat: 24.89, rad: 65, color: 'rgba(239, 68, 68, 0.80)', stop2: 'rgba(244, 63, 94, 0.40)' },
        { name: 'Chittagong', lng: 91.83, lat: 22.36, rad: 50, color: 'rgba(249, 115, 22, 0.75)', stop2: 'rgba(234, 88, 12, 0.35)' },
        { name: 'Mymensingh', lng: 90.40, lat: 24.75, rad: 45, color: 'rgba(239, 68, 68, 0.65)', stop2: 'rgba(244, 63, 94, 0.30)' },
        { name: 'Rajshahi', lng: 88.60, lat: 24.36, rad: 42, color: 'rgba(168, 85, 247, 0.60)', stop2: 'rgba(147, 51, 234, 0.25)' },
        { name: 'Rangpur', lng: 89.24, lat: 25.74, rad: 38, color: 'rgba(168, 85, 247, 0.55)', stop2: 'rgba(147, 51, 234, 0.20)' },
        { name: 'Khulna', lng: 89.54, lat: 22.84, rad: 40, color: 'rgba(6, 182, 212, 0.55)', stop2: 'rgba(14, 165, 233, 0.20)' },
        { name: 'Barisal', lng: 90.37, lat: 22.70, rad: 38, color: 'rgba(6, 182, 212, 0.50)', stop2: 'rgba(14, 165, 233, 0.15)' }
      ];

      riskHotspots.forEach((h) => {
        const [hx, hy] = proj(h.lng, h.lat);
        const modeScale = $activeAnalysisMode === 'short_term' ? 1.2 : $activeAnalysisMode === 'long_term' ? 1.4 : 1.0;
        const currentRad = (h.rad + Math.sin(animTime * 1.5) * 3) * modeScale * (zoom * 0.95);

        const rGrad = ctx.createRadialGradient(hx, hy, 2, hx, hy, currentRad * dpr);
        rGrad.addColorStop(0, h.color);
        rGrad.addColorStop(0.5, h.stop2);
        rGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.arc(hx, hy, currentRad * dpr, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 5. Dynamic Neon Cyan River Channels
    if (showRivers) {
      const riverVectors = [
        // Surma & Kushiyara
        [[92.50, 24.88], [92.15, 24.90], [91.87, 24.89], [91.55, 24.95], [91.10, 24.50]],
        [[92.45, 24.80], [92.05, 24.60], [91.70, 24.45], [91.35, 24.40], [90.95, 24.15]],
        // Jamuna / Brahmaputra
        [[89.80, 26.10], [89.70, 25.50], [89.65, 24.80], [89.75, 24.10], [89.85, 23.80]],
        // Padma (Ganges)
        [[88.10, 24.60], [88.50, 24.30], [89.20, 23.90], [89.85, 23.80]],
        // Lower Meghna River to Bay of Bengal
        [[89.85, 23.80], [90.40, 23.60], [90.65, 23.10], [90.60, 22.40], [90.80, 21.80]],
        // Coastal distributaries
        [[90.40, 23.60], [89.80, 22.90], [89.50, 22.20], [89.30, 21.70]]
      ];

      riverVectors.forEach((path) => {
        ctx.beginPath();
        const [rx0, ry0] = proj(path[0][0], path[0][1]);
        ctx.moveTo(rx0, ry0);
        for (let p = 1; p < path.length; p++) {
          const [rx, ry] = proj(path[p][0], path[p][1]);
          ctx.lineTo(rx, ry);
        }

        // River glow
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 2.8 * dpr;
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 10 * dpr;
        ctx.stroke();

        // River bright core
        ctx.strokeStyle = '#E0F2FE';
        ctx.lineWidth = 1.0 * dpr;
        ctx.shadowBlur = 0;
        ctx.stroke();
      });
    }

    // 6. Central Bold Label: BANGLADESH
    const [bdCenter_x, bdCenter_y] = proj(90.35, 24.2);
    ctx.font = `bold ${12 * dpr}px monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('BANGLADESH', bdCenter_x, bdCenter_y);

    // 7. Cities & Dhaka Pulsating Beacon
    if (showCities) {
      const cities = [
        { name: 'Dhaka', lng: 90.41, lat: 23.81, isCapital: true },
        { name: 'Sylhet', lng: 91.87, lat: 24.89 },
        { name: 'Chittagong', lng: 91.83, lat: 22.36 },
        { name: 'Mymensingh', lng: 90.40, lat: 24.75 },
        { name: 'Rajshahi', lng: 88.60, lat: 24.36 },
        { name: 'Rangpur', lng: 89.24, lat: 25.74 },
        { name: 'Khulna', lng: 89.54, lat: 22.84 },
        { name: 'Barisal', lng: 90.37, lat: 22.70 }
      ];

      cities.forEach((city) => {
        const [cxPos, cyPos] = proj(city.lng, city.lat);

        if (city.isCapital) {
          // Animated concentric pulsing rings on Dhaka
          const pulse1 = (animTime * 1.5) % 2.5;
          const pulseRad = (6 + pulse1 * 12) * dpr;
          const pulseAlpha = Math.max(0, 1 - pulse1 / 2.5);

          ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
          ctx.lineWidth = 2 * dpr;
          ctx.beginPath();
          ctx.arc(cxPos, cyPos, pulseRad, 0, Math.PI * 2);
          ctx.stroke();

          // Outer solid ring
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2 * dpr;
          ctx.beginPath();
          ctx.arc(cxPos, cyPos, 5 * dpr, 0, Math.PI * 2);
          ctx.stroke();

          // Center solid white dot
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cxPos, cyPos, 2.5 * dpr, 0, Math.PI * 2);
          ctx.fill();

          // Label
          ctx.font = `bold ${10 * dpr}px monospace`;
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'left';
          ctx.fillText(`● ${city.name}`, cxPos + 8 * dpr, cyPos + 4 * dpr);
        } else {
          // Standard city marker
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cxPos, cyPos, 2.5 * dpr, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = `${9 * dpr}px monospace`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.textAlign = 'left';
          ctx.fillText(`● ${city.name}`, cxPos + 6 * dpr, cyPos + 3 * dpr);
        }
      });
    }

    ctx.restore();
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={containerEl}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseUp}
  on:wheel={handleWheel}
  class="relative w-full h-full min-h-[360px] rounded-2xl bg-[#030914] border border-white/10 overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
>
  <canvas bind:this={canvasEl} class="w-full h-full block" />

  <!-- Embedded Map Legend (Bottom-Left) -->
  <div class="absolute bottom-3 left-3 z-20 p-2.5 rounded-xl bg-[#030a16]/90 backdrop-blur-md border border-white/10 font-mono text-[9px] space-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] pointer-events-auto">
    <div class="text-[#8BA1B8] uppercase tracking-wider font-bold pb-1 border-b border-white/10">
      Flood Risk Level
    </div>
    <div class="flex items-center gap-1.5 text-white">
      <span class="w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]"></span>
      <span>Extreme</span>
    </div>
    <div class="flex items-center gap-1.5 text-white">
      <span class="w-2 h-2 rounded-full bg-[#F97316]"></span>
      <span>High</span>
    </div>
    <div class="flex items-center gap-1.5 text-white">
      <span class="w-2 h-2 rounded-full bg-[#A855F7]"></span>
      <span>Moderate</span>
    </div>
    <div class="flex items-center gap-1.5 text-white">
      <span class="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
      <span>Low</span>
    </div>
    <div class="pt-1 border-t border-white/10 space-y-1 text-[#CAD6E2]">
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-0.5 bg-[#00E5FF]"></span>
        <span>Rivers</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-sm border border-purple-400 bg-purple-500/20"></span>
        <span>Affected Districts</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
        <span>Key Cities</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rotate-45 border border-[#00E5FF]"></span>
        <span>Critical Infrastructure</span>
      </div>
    </div>
  </div>

  <!-- Embedded Right Toolbar Controls -->
  <div class="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5 p-1 rounded-xl bg-[#030a16]/90 backdrop-blur-md border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.8)] pointer-events-auto">
    <button
      on:click={zoomIn}
      class="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white flex items-center justify-center text-sm font-mono transition-all cursor-pointer"
      title="Zoom In"
    >
      +
    </button>
    <button
      on:click={zoomOut}
      class="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white flex items-center justify-center text-sm font-mono transition-all cursor-pointer"
      title="Zoom Out"
    >
      −
    </button>
    <button
      on:click={resetView}
      class="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white flex items-center justify-center text-xs font-mono transition-all cursor-pointer"
      title="Recenter Map"
    >
      ⊙
    </button>
    <button
      on:click={() => (showLayersMenu = !showLayersMenu)}
      class="w-7 h-7 rounded-lg {showLayersMenu ? 'bg-[#00E5FF]/30 text-[#00E5FF]' : 'bg-white/5 text-white'} hover:bg-[#00E5FF]/20 flex items-center justify-center text-xs transition-all cursor-pointer"
      title="Toggle Overlays"
    >
      ≡
    </button>
    <button
      on:click={resetView}
      class="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white flex items-center justify-center text-xs transition-all cursor-pointer"
      title="Reset Viewport"
    >
      ⛶
    </button>
  </div>

  <!-- Layers Toggle Menu -->
  {#if showLayersMenu}
    <div class="absolute right-12 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-xl bg-[#030a16]/95 backdrop-blur-md border border-[#00E5FF]/40 shadow-[0_8px_32px_rgba(0,0,0,0.8)] font-mono text-[10px] space-y-1.5 min-w-[140px] pointer-events-auto">
      <div class="font-bold text-[#00E5FF] pb-1 border-b border-white/10 uppercase">
        Map Layers
      </div>
      <label class="flex items-center gap-2 cursor-pointer text-white">
        <input type="checkbox" bind:checked={showRiskHeat} class="accent-[#EF4444]" />
        <span>Risk Gradient</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer text-white">
        <input type="checkbox" bind:checked={showRivers} class="accent-[#00E5FF]" />
        <span>Neon Rivers</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer text-white">
        <input type="checkbox" bind:checked={showCities} class="accent-white" />
        <span>City Pins</span>
      </label>
    </div>
  {/if}
</div>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { selectedIncident } from '../../stores/incidentStore';
  import { activeAnalysisMode, activeHazardType } from '../../stores/analysisStore';

  let canvasEl: HTMLCanvasElement;
  let containerEl: HTMLDivElement;
  let animId: number;
  let resizeObserver: ResizeObserver | null = null;

  // Pan & Zoom
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Layers
  let showRiskHeat = true;
  let showFloodPolygons = true;
  let showRivers = true;
  let showDistricts = true;
  let showCities = true;
  let showInfrastructure = true;
  let showLayersMenu = false;

  let animTime = 0;

  function zoomIn() {
    zoom = Math.min(2.8, zoom + 0.2);
  }

  function zoomOut() {
    zoom = Math.max(0.5, zoom - 0.2);
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
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    zoom = Math.max(0.5, Math.min(3.2, zoom * factor));
  }

  onMount(() => {
    handleResize();
    drawLoop();

    if (containerEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerEl);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  });

  onDestroy(() => {
    if (resizeObserver) resizeObserver.disconnect();
    if (animId) cancelAnimationFrame(animId);
  });

  function handleResize() {
    if (!containerEl || !canvasEl) return;
    const rect = containerEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasEl.width = Math.floor(rect.width * dpr);
    canvasEl.height = Math.floor(rect.height * dpr);
  }

  function drawLoop() {
    animId = requestAnimationFrame(drawLoop);
    animTime += 0.022;
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

    // Dynamic scale to fit Bangladesh, Assam, and the Bay of Bengal comfortably
    const targetLngSpan = 8.6; // degrees longitude
    const targetLatSpan = 7.2; // degrees latitude
    const scaleX = width / targetLngSpan;
    const scaleY = height / (targetLatSpan * 1.1);
    const autoScale = Math.min(scaleX, scaleY);
    const s = autoScale * zoom;

    // Geographic baseline center (90.35° E, 23.65° N)
    const baseLng = 90.35;
    const baseLat = 23.65;

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
    for (let lat = 19.5; lat <= 28.5; lat += 1.5) {
      const [, gy] = proj(baseLng, lat);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // 2. Surrounding Maritime Context: Bay of Bengal
    const [bob_x, bob_y] = proj(90.1, 20.7);
    ctx.font = `italic bold ${11 * dpr}px monospace`;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.textAlign = 'center';
    ctx.fillText('BAY OF BENGAL (NORTHERN BASIN)', bob_x, bob_y);

    // Maritime depth contour curves in Bay of Bengal
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.12)';
    ctx.lineWidth = 1.2 * dpr;
    for (let r = 1; r <= 3; r++) {
      ctx.beginPath();
      const [mx0, my0] = proj(88.0, 20.9 - r * 0.35);
      const [mx1, my1] = proj(90.2, 20.5 - r * 0.35);
      const [mx2, my2] = proj(92.4, 20.8 - r * 0.35);
      ctx.moveTo(mx0, my0);
      ctx.quadraticCurveTo(mx1, my1 + 15 * dpr, mx2, my2);
      ctx.stroke();
    }

    // 3. Neighboring Country Territorial Outlines & Labels
    ctx.font = `bold ${10 * dpr}px monospace`;
    ctx.fillStyle = 'rgba(139, 161, 184, 0.45)';
    const [indW_x, indW_y] = proj(87.3, 24.3);
    ctx.textAlign = 'center';
    ctx.fillText('INDIA (WEST BENGAL)', indW_x, indW_y);

    const [indN_x, indN_y] = proj(91.2, 25.85);
    ctx.fillText('INDIA (ASSAM / MEGHALAYA)', indN_x, indN_y);

    const [indE_x, indE_y] = proj(93.1, 23.9);
    ctx.fillText('INDIA (TRIPURA)', indE_x, indE_y);

    const [mya_x, mya_y] = proj(93.2, 21.6);
    ctx.fillText('MYANMAR', mya_x, mya_y);

    // 4. Bangladesh National Border Polygon
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

    // Dark terrain fill & cyan border outline
    ctx.fillStyle = 'rgba(7, 24, 46, 0.70)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
    ctx.lineWidth = 1.8 * dpr;
    ctx.stroke();

    // 5. Inundated Flood Basin Polygons (Translucent Regional Flood Extent)
    if (showFloodPolygons) {
      // Haor & Surma-Meghna Inundated Basin (Sylhet / Sunamganj / Netrokona)
      const haorBasin: Array<[number, number]> = [
        [91.10, 25.15], [91.70, 25.12], [92.35, 25.02],
        [92.45, 24.60], [92.10, 24.25], [91.55, 24.30], [91.05, 24.65]
      ];
      ctx.beginPath();
      const [h0x, h0y] = proj(haorBasin[0][0], haorBasin[0][1]);
      ctx.moveTo(h0x, h0y);
      for (let i = 1; i < haorBasin.length; i++) {
        const [hx, hy] = proj(haorBasin[i][0], haorBasin[i][1]);
        ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      const floodAlpha = 0.25 + Math.sin(animTime * 2.0) * 0.05;
      ctx.fillStyle = `rgba(0, 229, 255, ${floodAlpha})`;
      ctx.fill();
      ctx.strokeStyle = '#00E5FF';
      ctx.setLineDash([4 * dpr, 3 * dpr]);
      ctx.lineWidth = 1.4 * dpr;
      ctx.stroke();
      ctx.setLineDash([]);

      // Jamuna / Brahmaputra River Corridor Flood Wash
      const jamunaWash: Array<[number, number]> = [
        [89.65, 25.85], [89.92, 25.70], [89.85, 24.60],
        [89.95, 23.90], [89.55, 24.00], [89.45, 24.75], [89.40, 25.50]
      ];
      ctx.beginPath();
      const [j0x, j0y] = proj(jamunaWash[0][0], jamunaWash[0][1]);
      ctx.moveTo(j0x, j0y);
      for (let i = 1; i < jamunaWash.length; i++) {
        const [jx, jy] = proj(jamunaWash[i][0], jamunaWash[i][1]);
        ctx.lineTo(jx, jy);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(14, 165, 233, 0.20)';
      ctx.fill();
    }

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

    // 8. Central Bold Label: BANGLADESH
    const [bdCenter_x, bdCenter_y] = proj(90.35, 24.2);
    ctx.font = `bold ${13 * dpr}px monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.textAlign = 'center';
    ctx.fillText('BANGLADESH', bdCenter_x, bdCenter_y);

    // Inundation Callout Badge above Sylhet
    const [sylhetBadge_x, sylhetBadge_y] = proj(91.87, 25.18);
    ctx.font = `bold ${8 * dpr}px monospace`;
    ctx.fillStyle = '#EF4444';
    ctx.fillText('▲ SECTOR ALPHA // CRITICAL INUNDATION', sylhetBadge_x, sylhetBadge_y);

    // 9. Cities & Dhaka Pulsating Beacon
    if (showCities) {
      const cities = [
        { name: 'Dhaka', lng: 90.41, lat: 23.81, isCapital: true },
        { name: 'Sylhet', lng: 91.87, lat: 24.89, isEpicenter: true },
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
          ctx.fillText(`● ${city.name} (HQ)`, cxPos + 8 * dpr, cyPos + 4 * dpr);
        } else if (city.isEpicenter) {
          // Warning pulsing ring on Sylhet
          const pulse1 = ((animTime + 0.5) * 1.8) % 2.2;
          const pulseRad = (5 + pulse1 * 10) * dpr;
          const pulseAlpha = Math.max(0, 1 - pulse1 / 2.2);

          ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
          ctx.lineWidth = 1.8 * dpr;
          ctx.beginPath();
          ctx.arc(cxPos, cyPos, pulseRad, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(cxPos, cyPos, 3.5 * dpr, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = `bold ${9.5 * dpr}px monospace`;
          ctx.fillStyle = '#FF8A8A';
          ctx.textAlign = 'left';
          ctx.fillText(`● ${city.name}`, cxPos + 7 * dpr, cyPos + 3 * dpr);
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

    // 10. Critical Infrastructure Diamond Points (Road bridges & power stations)
    if (showInfrastructure) {
      const infraPoints = [
        { name: 'Padma Bridge', lng: 90.26, lat: 23.47 },
        { name: 'Jamuna Bridge', lng: 89.77, lat: 24.40 },
        { name: 'Sylhet Grid Substation', lng: 91.80, lat: 24.78 },
        { name: 'Meghna Ghat Hub', lng: 90.60, lat: 23.60 }
      ];

      infraPoints.forEach((pt) => {
        const [ix, iy] = proj(pt.lng, pt.lat);
        const dSize = 3.5 * dpr;

        ctx.strokeStyle = '#00E5FF';
        ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.lineWidth = 1.2 * dpr;
        ctx.beginPath();
        ctx.moveTo(ix, iy - dSize);
        ctx.lineTo(ix + dSize, iy);
        ctx.lineTo(ix, iy + dSize);
        ctx.lineTo(ix - dSize, iy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
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
  class="relative w-full h-full rounded-2xl bg-[#030914] overflow-hidden select-none cursor-grab active:cursor-grabbing border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
>
  <canvas bind:this={canvasEl} class="w-full h-full block" />

  <!-- Embedded Map Controls (Top-Right as specified) -->
  <div class="absolute top-4 right-4 z-20 flex flex-col gap-1 p-1 rounded-xl bg-[#030a16]/92 backdrop-blur-md border border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.85)] pointer-events-auto">
    <button
      on:click={zoomIn}
      class="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white flex items-center justify-center text-sm font-mono transition-all cursor-pointer"
      title="Zoom In (+)"
    >
      +
    </button>
    <button
      on:click={zoomOut}
      class="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white flex items-center justify-center text-sm font-mono transition-all cursor-pointer"
      title="Zoom Out (−)"
    >
      −
    </button>
    <button
      on:click={resetView}
      class="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white flex items-center justify-center text-xs font-mono transition-all cursor-pointer"
      title="Recenter Map (⊙)"
    >
      ⊙
    </button>
    <button
      on:click={() => (showLayersMenu = !showLayersMenu)}
      class="w-7 h-7 rounded-lg {showLayersMenu ? 'bg-[#00E5FF]/30 text-[#00E5FF]' : 'bg-white/5 text-white'} hover:bg-[#00E5FF]/20 flex items-center justify-center text-xs transition-all cursor-pointer"
      title="Toggle Overlays (≡)"
    >
      ≡
    </button>
    <button
      on:click={resetView}
      class="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white flex items-center justify-center text-xs transition-all cursor-pointer"
      title="Reset Viewport (⛶)"
    >
      ⛶
    </button>
  </div>

  <!-- Layers Toggle Dropdown Menu -->
  {#if showLayersMenu}
    <div class="absolute right-14 top-4 z-30 p-3 rounded-xl bg-[#030a16]/95 backdrop-blur-md border border-[#00E5FF]/40 shadow-[0_8px_32px_rgba(0,0,0,0.85)] font-mono text-[10px] space-y-2 min-w-[150px] pointer-events-auto">
      <div class="font-bold text-[#00E5FF] pb-1 border-b border-white/10 uppercase tracking-wider">
        Map Layers
      </div>
      <label class="flex items-center gap-2 cursor-pointer text-white">
        <input type="checkbox" bind:checked={showFloodPolygons} class="accent-[#00E5FF]" />
        <span>Inundation Basins</span>
      </label>
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
      <label class="flex items-center gap-2 cursor-pointer text-white">
        <input type="checkbox" bind:checked={showInfrastructure} class="accent-[#00E5FF]" />
        <span>Infrastructure</span>
      </label>
    </div>
  {/if}

  <!-- Embedded Map Legend (Bottom-Left) with Safe Spacing -->
  <div class="absolute bottom-4 left-4 z-20 p-3 rounded-xl bg-[#030a16]/92 backdrop-blur-md border border-white/10 font-mono text-[9px] space-y-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.85)] pointer-events-auto">
    <div class="text-[#8BA1B8] uppercase tracking-wider font-bold pb-1 border-b border-white/10 flex items-center justify-between gap-4">
      <span>Flood Risk Level</span>
      <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
    </div>
    <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-white">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]"></span>
        <span>Extreme</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#F97316]"></span>
        <span>High</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#A855F7]"></span>
        <span>Moderate</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
        <span>Low</span>
      </div>
    </div>
    <div class="pt-1.5 border-t border-white/10 space-y-1 text-[#CAD6E2]">
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-0.5 bg-[#00E5FF]"></span>
        <span>Rivers</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-sm border border-[#00E5FF] bg-[#00E5FF]/25"></span>
        <span>Inundation Basins</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
        <span>Key Cities</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rotate-45 border border-[#00E5FF] bg-[#00E5FF]/40"></span>
        <span>Critical Infrastructure</span>
      </div>
    </div>
  </div>
</div>

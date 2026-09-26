import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Navigating to http://localhost:5180...');
  await page.goto('http://localhost:5180', { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait 3.5 seconds for Three.js shaders and textures to paint
  await new Promise(r => setTimeout(r, 3500));
  
  const shot1 = 'C:\\Users\\Swetaparna Dasgupta\\.gemini\\antigravity\\brain\\6da1b91c-0716-40f7-88bf-5955b4334aaa\\jarvis_dashboard_overhaul.png';
  await page.screenshot({ path: shot1, fullPage: false });
  console.log('Saved dashboard screenshot to', shot1);

  // Click Explore Scenarios to trigger the on-demand drawer!
  const scenBtn = await page.$('button[title*="Simulation Scenarios"]');
  if (scenBtn) {
    await scenBtn.click();
    await new Promise(r => setTimeout(r, 600));
    const shotDrawer = 'C:\\Users\\Swetaparna Dasgupta\\.gemini\\antigravity\\brain\\6da1b91c-0716-40f7-88bf-5955b4334aaa\\jarvis_scenario_drawer.png';
    await page.screenshot({ path: shotDrawer, fullPage: false });
    console.log('Saved scenario drawer screenshot to', shotDrawer);

    // Close drawer with Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  } else {
    console.log('Explore Scenarios button not found');
  }

  // Click JARVIS orb to trigger Central Mode!
  const orb = await page.$('button[title*="Activate JARVIS"]');
  if (orb) {
    await orb.click();
    // Allow WebGL scene to initialize and animate activation
    await new Promise(r => setTimeout(r, 1800));
    
    // 1. Clean Default JARVIS Central Mode (Uncluttered, roomy, Earth visible)
    const shotClean = 'C:\\Users\\Swetaparna Dasgupta\\.gemini\\antigravity\\brain\\6da1b91c-0716-40f7-88bf-5955b4334aaa\\jarvis_central_mode.png';
    await page.screenshot({ path: shotClean, fullPage: false });
    console.log('Saved clean default central mode screenshot to', shotClean);

    // 2. Interactive Contextual Disclosure: Click "Analyze flood risk in Zone 4" chip
    const floodChip = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Analyze flood risk'));
    });

    if (floodChip && floodChip.asElement()) {
      console.log('Triggering contextual query: Analyze flood risk in Zone 4...');
      await floodChip.asElement().click();
      
      // Wait for real-time progress steps and contextual panel to emerge
      await new Promise(r => setTimeout(r, 2600));
      const shotContextual = 'C:\\Users\\Swetaparna Dasgupta\\.gemini\\antigravity\\brain\\6da1b91c-0716-40f7-88bf-5955b4334aaa\\jarvis_contextual_analysis.png';
      await page.screenshot({ path: shotContextual, fullPage: false });
      console.log('Saved contextual analysis screenshot to', shotContextual);

      // Dismiss contextual panel with Escape
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 600));
    }

    // 3. State pill cycle check
    const stateBtn = await page.$('button[title*="toggle AI state"]');
    if (stateBtn) {
      await stateBtn.click();
      await new Promise(r => setTimeout(r, 600));
      const shotListening = 'C:\\Users\\Swetaparna Dasgupta\\.gemini\\antigravity\\brain\\6da1b91c-0716-40f7-88bf-5955b4334aaa\\jarvis_state_listening.png';
      await page.screenshot({ path: shotListening, fullPage: false });
      console.log('Saved listening state screenshot to', shotListening);

      await stateBtn.click();
      await new Promise(r => setTimeout(r, 600));
      const shotThinking = 'C:\\Users\\Swetaparna Dasgupta\\.gemini\\antigravity\\brain\\6da1b91c-0716-40f7-88bf-5955b4334aaa\\jarvis_state_thinking.png';
      await page.screenshot({ path: shotThinking, fullPage: false });
      console.log('Saved thinking state screenshot to', shotThinking);
    }
  } else {
    console.log('Orb button not found');
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
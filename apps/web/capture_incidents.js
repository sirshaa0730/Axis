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
  
  // Wait for initial mount and canvas render
  await new Promise(r => setTimeout(r, 2000));
  
  const brainDir = 'C:\\Users\\Swetaparna Dasgupta\\.gemini\\antigravity\\brain\\6da1b91c-0716-40f7-88bf-5955b4334aaa\\';

  // 1. Overview Tab Default
  const shot1 = brainDir + 'jarvis_incidents_overview.png';
  await page.screenshot({ path: shot1, fullPage: false });
  console.log('Saved 1. Overview to', shot1);

  // 2. Click IMPACT tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const impactBtn = btns.find(b => b.textContent && b.textContent.trim() === 'IMPACT');
    if (impactBtn) impactBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  const shot2 = brainDir + 'jarvis_incidents_impact.png';
  await page.screenshot({ path: shot2, fullPage: false });
  console.log('Saved 2. Impact to', shot2);

  // 3. Click FORECAST tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const forecastBtn = btns.find(b => b.textContent && b.textContent.trim() === 'FORECAST');
    if (forecastBtn) forecastBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  const shot3 = brainDir + 'jarvis_incidents_forecast.png';
  await page.screenshot({ path: shot3, fullPage: false });
  console.log('Saved 3. Forecast to', shot3);

  // 4. Click RESPONSE tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const respBtn = btns.find(b => b.textContent && b.textContent.trim() === 'RESPONSE');
    if (respBtn) respBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  const shot4 = brainDir + 'jarvis_incidents_response.png';
  await page.screenshot({ path: shot4, fullPage: false });
  console.log('Saved 4. Response to', shot4);

  // 5. Click CRITICAL Severity Filter pill
  const clickedCrit = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const critBtn = btns.find(b => b.textContent && b.textContent.includes('CRITICAL') && b.textContent.includes('2'));
    if (critBtn) {
      critBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked critical filter button:', clickedCrit);
  await new Promise(r => setTimeout(r, 1000));
  const shot5 = brainDir + 'jarvis_incidents_filter_critical.png';
  await page.screenshot({ path: shot5, fullPage: false });
  console.log('Saved 5. Critical Filter to', shot5);

  // 6. Reset filter to ALL and select Cyclone Marex
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const allBtn = btns.find(b => b.textContent && b.textContent.includes('ALL') && b.textContent.includes('7'));
    if (allBtn) allBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const clickedCyclone = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cycloneCard = btns.find(b => b.textContent && b.textContent.includes('Cyclone Marex'));
    if (cycloneCard) {
      cycloneCard.click();
      return true;
    }
    return false;
  });
  console.log('Clicked cyclone card:', clickedCyclone);
  await new Promise(r => setTimeout(r, 1200));
  const shot6 = brainDir + 'jarvis_incidents_cyclone.png';
  await page.screenshot({ path: shot6, fullPage: false });
  console.log('Saved 6. Cyclone Marex Selection to', shot6);

  // 7. Click Global View on NavRail to verify smooth view switching
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const globBtn = btns.find(b => b.textContent && b.textContent.includes('Global View'));
    if (globBtn) globBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  const shot7 = brainDir + 'jarvis_global_view.png';
  await page.screenshot({ path: shot7, fullPage: false });
  console.log('Saved 7. Return to Global View to', shot7);

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

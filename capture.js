import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log("Loading AI Prediction...");
    await page.goto('https://sheetal-ai.vercel.app/#/prediction', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'pred.png' });

    console.log("Loading Satellite Feeds...");
    await page.goto('https://sheetal-ai.vercel.app/#/satellite', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'sat.png' });

    await browser.close();
})();

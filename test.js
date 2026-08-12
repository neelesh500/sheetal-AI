const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();

    // 1. Visit GitHub Pages URL
    console.log("Testing GitHub Pages URL...");
    const page1 = await browser.newPage();
    page1.on('console', msg => console.log('GitHub Page Console:', msg.text()));
    page1.on('pageerror', err => console.error('GitHub Page Error:', err.message));
    await page1.goto('https://neelesh500.github.io/sheetal-AI/', { waitUntil: 'networkidle0' });

    // 2. Visit Vercel App URL
    console.log("Testing Vercel URL...");
    const page2 = await browser.newPage();
    page2.on('console', msg => console.log('Vercel Page Console:', msg.text()));
    page2.on('pageerror', err => console.error('Vercel Page Error:', err.message));
    await page2.goto('https://sheetal-ai.vercel.app/', { waitUntil: 'networkidle0' });

    console.log("Testing complete.");
    await browser.close();
})();

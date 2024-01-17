// uses pupeteer to load a project url, take a screenshot and save it to the dir

import * as puppeteer from "puppeteer";

export async function updateScreenshot(
    url: string,
    projName: string,
    savePath: string
) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set the viewport size to your preferred size
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the website that you want to take a screenshot of
    await page.goto(url);

    // Take a screenshot of the homepage and save it to disk as a PNG image
    await page.screenshot({ path: savePath });

    await browser.close();
}

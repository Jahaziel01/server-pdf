import puppeteer from "puppeteer-core";

export async function getBrowser() {
    if (process.env.VERCEL) {
        const chromium = (await import("@sparticuz/chromium")).default;

        return puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        });
    }

    const puppeteerLocal = (await import("puppeteer")).default;

    return puppeteerLocal.launch({
        headless: true,
    });
}
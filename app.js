
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { serve } from "@hono/node-server";
import { getBrowser } from "./config/browser.js";
import { addSignatureToPdf } from "./config/pdf.js";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

app.post("/pdf", async (c) => {
    const html = await c.req.text();

    if (!html) {
        return c.text("", 400);
    }

    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await page.setContent(html, {
            waitUntil: "networkidle0",
        });

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "10mm",
                right: "10mm",
                bottom: "0mm",
                left: "10mm",
            },
        });

        const finalPdf = await addSignatureToPdf(pdf);

        return c.body(finalPdf, 200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=documento.pdf",
        });

    } finally {
        await page.close();
        await browser.close();
    }
});

export const POST = handle(app);

if (!process.env.VERCEL) {
    serve(
        {
            fetch: app.fetch,
            port: 2000,
        },
        () => {
            console.log(`Servidor ejecutándose en ${process.env.SERVER_URL}`);
        }
    );
}
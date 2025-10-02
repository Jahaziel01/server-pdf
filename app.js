import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-pdf", async (req, res) => {
    const { html } = req.body;

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=report.pdf");
    res.send(pdfBuffer);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${process.env.SERVER_URL}:${PORT}`));

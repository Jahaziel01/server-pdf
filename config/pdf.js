import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function addSignatureToPdf(pdf) {

    const imageSignaturePath = path.join(
        process.cwd(),
        "refriserviag",
        "signature-ceo.png"
    );

    const pdfDoc = await PDFDocument.load(pdf);

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    const { width } = lastPage.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const signature = await pdfDoc.embedPng(
        fs.readFileSync(imageSignaturePath)
    );

    const margin = 20;

    lastPage.drawLine({
        start: { x: margin, y: 30 },
        end: { x: margin + 140, y: 30 },
        thickness: 1,
    });

    lastPage.drawImage(signature, {
        x: margin + 25,
        y: 30,
        width: 90,
        height: 70,
    });

    lastPage.drawText("Presidente: Andres García", {
        x: margin + 8,
        y: 15,
        size: 10,
        font,
    });

    lastPage.drawLine({
        start: { x: width - margin - 140, y: 30 },
        end: { x: width - margin, y: 30 },
        thickness: 1,
    });

    lastPage.drawText("Recibido por", {
        x: width - margin - font.widthOfTextAtSize("Recibido por", 10) - 35,
        y: 15,
        size: 10,
        font,
    });

    return await pdfDoc.save();
}
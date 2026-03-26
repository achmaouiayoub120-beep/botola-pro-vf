/**
 * Générateur de PDF Billet — Botola Pro Inwi
 * PFE 2024/2025
 * 
 * Génère des billets PDF professionnels avec PDFKit.
 */

const PDFDocument = require('pdfkit');
const { generateQRBuffer } = require('./qrGenerator');

/**
 * Génère un billet PDF et retourne un Buffer
 * @param {Object} ticketData - Données du billet
 * @returns {Promise<Buffer>}
 */
async function generateTicketPDF(ticketData) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A5', margin: 30 });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const centerX = pageWidth / 2;

      // --- En-tête vert ---
      doc.rect(0, 0, pageWidth, 65).fill('#00A651');
      doc.fontSize(22).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('BOTOLA TICKET', 0, 22, { align: 'center' });
      doc.fontSize(8).font('Helvetica').fillColor('#FFFFFF')
        .text('Botola Pro Inwi 2025-2026', 0, 48, { align: 'center' });

      // --- Match (équipes) ---
      doc.fillColor('#1A1A2E');
      doc.fontSize(24).font('Helvetica-Bold')
        .text(`${ticketData.homeShort}  VS  ${ticketData.awayShort}`, 0, 80, { align: 'center' });

      doc.fontSize(11).font('Helvetica').fillColor('#6B7280')
        .text(ticketData.homeName, 0, 110, { align: 'center' })
        .text('vs', 0, 124, { align: 'center' })
        .text(ticketData.awayName, 0, 138, { align: 'center' });

      // --- Séparateur ---
      doc.moveTo(30, 155).lineTo(pageWidth - 30, 155)
        .strokeColor('#E5E7EB').lineWidth(0.5).stroke();

      // --- Détails du billet ---
      const details = [
        { label: 'Date', value: ticketData.date },
        { label: 'Heure', value: ticketData.time },
        { label: 'Stade', value: `${ticketData.stadiumName}, ${ticketData.stadiumCity}` },
        { label: 'Zone', value: ticketData.zone },
        { label: 'Quantité', value: `${ticketData.quantity} billet(s)` },
        { label: 'Total', value: `${ticketData.totalPrice} MAD` },
        { label: 'Titulaire', value: ticketData.userName },
      ];

      let yPos = 170;
      details.forEach(({ label, value }) => {
        doc.fontSize(9).font('Helvetica').fillColor('#6B7280')
          .text(label, 30, yPos);
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#1A1A2E')
          .text(value, 30, yPos, { align: 'right', width: pageWidth - 60 });
        yPos += 18;
      });

      // --- Séparateur ---
      doc.moveTo(30, yPos + 5).lineTo(pageWidth - 30, yPos + 5)
        .strokeColor('#E5E7EB').lineWidth(0.5).stroke();

      // --- Référence billet ---
      yPos += 18;
      doc.fontSize(8).font('Helvetica').fillColor('#6B7280')
        .text('N° Billet', 0, yPos, { align: 'center' });
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#00A651')
        .text(ticketData.bookingReference, 0, yPos + 12, { align: 'center' });

      // --- QR Code ---
      try {
        const qrBuffer = await generateQRBuffer(ticketData.qrCodeValue);
        const qrX = centerX - 50;
        doc.image(qrBuffer, qrX, yPos + 35, { width: 100, height: 100 });
      } catch {
        doc.fontSize(8).fillColor('#6B7280')
          .text('QR Code disponible en ligne', 0, yPos + 70, { align: 'center' });
      }

      // --- Pied de page ---
      const footerY = doc.page.height - 35;
      doc.fontSize(6).font('Helvetica').fillColor('#6B7280')
        .text('Billet vérifié · Non remboursable · Botola Pro Inwi 2025-2026', 0, footerY, { align: 'center' })
        .text('© 2026 Botola Ticket. Tous droits réservés.', 0, footerY + 10, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateTicketPDF };

/**
 * Générateur de QR Code — Botola Pro Inwi
 * PFE 2024/2025
 * 
 * Génère des QR codes en base64 pour les billets.
 */

const QRCode = require('qrcode');

/**
 * Génère un QR code en base64 (data URI)
 * @param {string} data - Données à encoder dans le QR code
 * @returns {Promise<string>} Image QR en base64
 */
async function generateQRBase64(data) {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Erreur génération QR:', error.message);
    throw new Error('Impossible de générer le QR code.');
  }
}

/**
 * Génère un buffer PNG du QR code
 * @param {string} data - Données à encoder
 * @returns {Promise<Buffer>}
 */
async function generateQRBuffer(data) {
  try {
    return await QRCode.toBuffer(data, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H',
    });
  } catch (error) {
    console.error('Erreur génération QR buffer:', error.message);
    throw new Error('Impossible de générer le QR code.');
  }
}

module.exports = { generateQRBase64, generateQRBuffer };

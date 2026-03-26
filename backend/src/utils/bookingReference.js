/**
 * Générateur de référence de réservation — Botola Pro Inwi
 * PFE 2024/2025
 */

const { nanoid } = require('nanoid');

/**
 * Génère une référence de réservation unique
 * Format: BTK-YYYY-XXXX-XXX
 * @returns {string}
 */
function generateBookingReference() {
  const year = new Date().getFullYear();
  const id = nanoid(7).toUpperCase();
  return `BTK-${year}-${id}`;
}

/**
 * Génère une valeur unique pour le QR code du billet
 * @param {string} bookingRef - Référence de réservation
 * @param {string} homeShort - Sigle équipe domicile
 * @param {string} awayShort - Sigle équipe extérieure
 * @returns {string}
 */
function generateQRValue(bookingRef, homeShort, awayShort) {
  const timestamp = Date.now().toString(36);
  return `BOTOLA-TICKET:${bookingRef}|${homeShort}vs${awayShort}|${timestamp}`;
}

/**
 * Génère une référence de transaction
 * @returns {string}
 */
function generateTransactionReference() {
  const year = new Date().getFullYear();
  const id = nanoid(10).toUpperCase();
  return `TXN-${year}-${id}`;
}

module.exports = { generateBookingReference, generateQRValue, generateTransactionReference };

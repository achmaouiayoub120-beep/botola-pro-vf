/**
 * Service de billetterie — Botola Pro Inwi
 * PFE 2024/2025
 * 
 * Gère la réservation de billets avec transaction SQL,
 * génération de QR code et PDF.
 */

const { pool } = require('../config/db');
const { generateBookingReference, generateQRValue, generateTransactionReference } = require('../utils/bookingReference');
const { generateQRBase64 } = require('../utils/qrGenerator');
const { generateTicketPDF } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

class TicketService {
  /**
   * Réservation d'un billet avec transaction SQL complète
   * Stratégie transactionnelle avec SELECT ... FOR UPDATE
   */
  async bookTicket(userId, { match_id, zone_name, quantity, payment_method }) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Récupérer le match avec verrouillage (FOR UPDATE)
      const [matchRows] = await connection.execute(
        'SELECT m.*, ht.name AS home_name, ht.short_name AS home_short, at2.name AS away_name, at2.short_name AS away_short, s.name AS stadium_name, s.city AS stadium_city FROM matches m JOIN teams ht ON m.home_team_id = ht.id JOIN teams at2 ON m.away_team_id = at2.id JOIN stadiums s ON m.stadium_id = s.id WHERE m.id = ? FOR UPDATE',
        [match_id]
      );

      if (matchRows.length === 0) {
        throw Object.assign(new Error('Match non trouvé.'), { statusCode: 404 });
      }

      const match = matchRows[0];

      // 2. Vérifier le statut du match
      if (!['scheduled', 'open'].includes(match.status)) {
        throw Object.assign(new Error('Ce match n\'accepte plus de réservations.'), { statusCode: 400 });
      }

      // 3. Vérifier les places disponibles
      if (match.available_seats < quantity) {
        throw Object.assign(new Error(`Places insuffisantes. Il reste ${match.available_seats} place(s).`), { statusCode: 400 });
      }

      // 4. Calculer le prix selon la zone
      const zoneMultipliers = { VIP: 4, TRIBUNE: 2, POPULAIRE: 1 };
      const multiplier = zoneMultipliers[zone_name] || 1;
      const unitPrice = parseFloat(match.ticket_base_price) * multiplier;
      const totalPrice = unitPrice * quantity;

      // 5. Générer les identifiants uniques
      const bookingReference = generateBookingReference();
      const qrCodeValue = generateQRValue(bookingReference, match.home_short, match.away_short);
      const transactionRef = generateTransactionReference();

      // 6. Décrémenter les places disponibles
      await connection.execute(
        'UPDATE matches SET available_seats = available_seats - ? WHERE id = ?',
        [quantity, match_id]
      );

      // 7. Créer le ticket
      const [ticketResult] = await connection.execute(
        `INSERT INTO tickets (user_id, match_id, zone_name, quantity, unit_price, total_price, qr_code_value, status, booking_reference)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'paid', ?)`,
        [userId, match_id, zone_name, quantity, unitPrice, totalPrice, qrCodeValue, bookingReference]
      );
      const ticketId = ticketResult.insertId;

      // 8. Créer le paiement (simulation)
      await connection.execute(
        `INSERT INTO payments (ticket_id, payment_method, amount, payment_status, transaction_reference, paid_at)
         VALUES (?, ?, ?, 'paid', ?, NOW())`,
        [ticketId, payment_method || 'card', totalPrice, transactionRef]
      );

      // 9. Log d'audit
      await connection.execute(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
         VALUES (?, 'TICKET_BOOKED', 'ticket', ?, ?)`,
        [userId, ticketId, JSON.stringify({
          match: `${match.home_short} vs ${match.away_short}`,
          zone: zone_name, quantity, total: totalPrice,
          booking_reference: bookingReference
        })]
      );

      // 10. COMMIT
      await connection.commit();

      // 11. Générer le QR code
      const qrBase64 = await generateQRBase64(qrCodeValue);

      return {
        ticket: {
          id: ticketId,
          booking_reference: bookingReference,
          match_id,
          home_team: match.home_name,
          home_short: match.home_short,
          away_team: match.away_name,
          away_short: match.away_short,
          stadium_name: match.stadium_name,
          stadium_city: match.stadium_city,
          match_date: match.match_date,
          zone: zone_name,
          quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
          status: 'paid',
          qr_code_value: qrCodeValue,
          qr_code_base64: qrBase64,
        },
        payment: {
          amount: totalPrice,
          method: payment_method || 'card',
          status: 'paid',
          transaction_reference: transactionRef,
        },
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /** Récupérer les billets de l'utilisateur connecté */
  async getMyTickets(userId) {
    const [rows] = await pool.execute(`
      SELECT t.*,
        m.match_date, m.status AS match_status,
        ht.name AS home_team_name, ht.short_name AS home_team_short, ht.logo_url AS home_team_logo,
        ht.color_primary AS home_color, ht.color_secondary AS home_color_secondary,
        at2.name AS away_team_name, at2.short_name AS away_team_short, at2.logo_url AS away_team_logo,
        at2.color_primary AS away_color, at2.color_secondary AS away_color_secondary,
        s.name AS stadium_name, s.city AS stadium_city
      FROM tickets t
      JOIN matches m ON t.match_id = m.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at2 ON m.away_team_id = at2.id
      JOIN stadiums s ON m.stadium_id = s.id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `, [userId]);
    return rows;
  }

  /** Récupérer un billet par ID */
  async getById(id) {
    const [rows] = await pool.execute(`
      SELECT t.*,
        m.match_date, m.status AS match_status,
        ht.name AS home_team_name, ht.short_name AS home_team_short,
        at2.name AS away_team_name, at2.short_name AS away_team_short,
        s.name AS stadium_name, s.city AS stadium_city,
        u.full_name AS user_name, u.email AS user_email
      FROM tickets t
      JOIN matches m ON t.match_id = m.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at2 ON m.away_team_id = at2.id
      JOIN stadiums s ON m.stadium_id = s.id
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]);

    if (rows.length === 0) {
      throw Object.assign(new Error('Billet non trouvé.'), { statusCode: 404 });
    }
    return rows[0];
  }

  /** Annuler un billet (par l'utilisateur ou l'admin) */
  async cancelTicket(ticketId, userId, isAdmin = false) {
    const ticket = await this.getById(ticketId);

    if (!isAdmin && ticket.user_id !== userId) {
      throw Object.assign(new Error('Accès non autorisé.'), { statusCode: 403 });
    }

    if (!['reserved', 'paid'].includes(ticket.status)) {
      throw Object.assign(new Error('Ce billet ne peut pas être annulé.'), { statusCode: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute('UPDATE tickets SET status = ? WHERE id = ?', ['cancelled', ticketId]);
      await connection.execute('UPDATE matches SET available_seats = available_seats + ? WHERE id = ?', [ticket.quantity, ticket.match_id]);
      await connection.execute(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, 'TICKET_CANCELLED', 'ticket', ?, ?)`,
        [userId, ticketId, JSON.stringify({ booking_reference: ticket.booking_reference })]
      );

      await connection.commit();
      return { message: 'Billet annulé avec succès.', booking_reference: ticket.booking_reference };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /** Scanner / utiliser un billet (agent ou admin) */
  async useTicket(ticketId, agentUserId) {
    const ticket = await this.getById(ticketId);

    if (ticket.status === 'used') {
      throw Object.assign(new Error('Ce billet a déjà été utilisé.'), { statusCode: 400 });
    }

    if (ticket.status !== 'paid') {
      throw Object.assign(new Error(`Impossible de valider un billet au statut "${ticket.status}".`), { statusCode: 400 });
    }

    await pool.execute('UPDATE tickets SET status = ? WHERE id = ?', ['used', ticketId]);
    await pool.execute(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, 'TICKET_SCANNED', 'ticket', ?, ?)`,
      [agentUserId, ticketId, JSON.stringify({ booking_reference: ticket.booking_reference, scanned_by: agentUserId })]
    );

    return { message: 'Billet validé avec succès.', booking_reference: ticket.booking_reference };
  }

  /** Récupérer le QR code d'un billet */
  async getQRCode(ticketId) {
    const ticket = await this.getById(ticketId);
    const qrBase64 = await generateQRBase64(ticket.qr_code_value);
    return { qr_code_base64: qrBase64, qr_code_value: ticket.qr_code_value };
  }

  /** Générer le PDF d'un billet */
  async generatePDF(ticketId) {
    const ticket = await this.getById(ticketId);
    const dateObj = new Date(ticket.match_date);

    const pdfBuffer = await generateTicketPDF({
      bookingReference: ticket.booking_reference,
      qrCodeValue: ticket.qr_code_value,
      homeName: ticket.home_team_name,
      awayName: ticket.away_team_name,
      homeShort: ticket.home_team_short,
      awayShort: ticket.away_team_short,
      stadiumName: ticket.stadium_name,
      stadiumCity: ticket.stadium_city,
      date: dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time: dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      zone: ticket.zone_name,
      quantity: ticket.quantity,
      totalPrice: ticket.total_price,
      userName: ticket.user_name,
    });

    return pdfBuffer;
  }

  /** Récupérer tous les billets (admin) */
  async getAllTickets(filters = {}) {
    let sql = `
      SELECT t.*,
        m.match_date,
        ht.short_name AS home_team_short, at2.short_name AS away_team_short,
        s.name AS stadium_name,
        u.full_name AS user_name, u.email AS user_email
      FROM tickets t
      JOIN matches m ON t.match_id = m.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at2 ON m.away_team_id = at2.id
      JOIN stadiums s ON m.stadium_id = s.id
      JOIN users u ON t.user_id = u.id
    `;
    const conditions = [];
    const params = [];

    if (filters.status) {
      conditions.push('t.status = ?');
      params.push(filters.status);
    }
    if (filters.match_id) {
      conditions.push('t.match_id = ?');
      params.push(filters.match_id);
    }

    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY t.created_at DESC';

    const [rows] = await pool.execute(sql, params);
    return rows;
  }
}

module.exports = new TicketService();

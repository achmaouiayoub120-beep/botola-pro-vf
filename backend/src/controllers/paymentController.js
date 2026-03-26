/**
 * Contrôleur paiements — Botola Pro Inwi
 */
const { pool } = require('../config/db');

const paymentController = {
  async getByTicket(req, res, next) {
    try {
      const [rows] = await pool.execute('SELECT * FROM payments WHERE ticket_id = ?', [req.params.ticketId]);
      res.json(rows);
    } catch (e) { next(e); }
  },
  async getAll(req, res, next) {
    try {
      const [rows] = await pool.execute(`
        SELECT p.*, t.booking_reference, u.full_name AS user_name
        FROM payments p
        JOIN tickets t ON p.ticket_id = t.id
        JOIN users u ON t.user_id = u.id
        ORDER BY p.created_at DESC
      `);
      res.json(rows);
    } catch (e) { next(e); }
  },
};

module.exports = paymentController;

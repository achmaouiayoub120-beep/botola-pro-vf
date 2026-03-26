/**
 * Contrôleur billetterie — Botola Pro Inwi
 */
const ticketService = require('../services/ticketService');

const ticketController = {
  /** Réserver un billet */
  async book(req, res, next) {
    try {
      const result = await ticketService.bookTicket(req.user.id, req.body);
      res.status(201).json({ message: 'Réservation effectuée avec succès !', ...result });
    } catch (e) { next(e); }
  },

  /** Mes billets */
  async getMyTickets(req, res, next) {
    try { res.json(await ticketService.getMyTickets(req.user.id)); } catch (e) { next(e); }
  },

  /** Détail d'un billet */
  async getById(req, res, next) {
    try { res.json(await ticketService.getById(req.params.id)); } catch (e) { next(e); }
  },

  /** Annuler un billet */
  async cancel(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';
      res.json(await ticketService.cancelTicket(req.params.id, req.user.id, isAdmin));
    } catch (e) { next(e); }
  },

  /** Scanner / utiliser un billet (agent) */
  async use(req, res, next) {
    try { res.json(await ticketService.useTicket(req.params.id, req.user.id)); } catch (e) { next(e); }
  },

  /** QR code d'un billet */
  async getQR(req, res, next) {
    try { res.json(await ticketService.getQRCode(req.params.id)); } catch (e) { next(e); }
  },

  /** Télécharger le PDF */
  async downloadPDF(req, res, next) {
    try {
      const pdfBuffer = await ticketService.generatePDF(req.params.id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=billet-botola-${req.params.id}.pdf`);
      res.send(pdfBuffer);
    } catch (e) { next(e); }
  },

  /** Tous les billets (admin) */
  async getAll(req, res, next) {
    try {
      const filters = { status: req.query.status, match_id: req.query.match_id };
      res.json(await ticketService.getAllTickets(filters));
    } catch (e) { next(e); }
  },
};

module.exports = ticketController;

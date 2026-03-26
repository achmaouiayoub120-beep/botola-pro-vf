/**
 * Contrôleur classement — Botola Pro Inwi
 */
const standingService = require('../services/standingService');

const standingController = {
  async getAll(req, res, next) {
    try {
      const season = req.query.season || '2025-2026';
      res.json(await standingService.getAll(season));
    } catch (e) { next(e); }
  },
  async update(req, res, next) {
    try { res.json(await standingService.update(req.params.teamId, req.body)); } catch (e) { next(e); }
  },
};

module.exports = standingController;

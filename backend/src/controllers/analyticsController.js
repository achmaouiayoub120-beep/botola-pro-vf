/**
 * Contrôleur analytics — Botola Pro Inwi
 */
const analyticsService = require('../services/analyticsService');

const analyticsController = {
  async getOverview(req, res, next) {
    try { res.json(await analyticsService.getOverview()); } catch (e) { next(e); }
  },
  async getSalesData(req, res, next) {
    try { res.json(await analyticsService.getSalesData()); } catch (e) { next(e); }
  },
  async getZoneDistribution(req, res, next) {
    try { res.json(await analyticsService.getZoneDistribution()); } catch (e) { next(e); }
  },
  async getTopMatches(req, res, next) {
    try { res.json(await analyticsService.getTopMatches()); } catch (e) { next(e); }
  },
  async getUserStats(req, res, next) {
    try { res.json(await analyticsService.getUserStats()); } catch (e) { next(e); }
  },
  async getRecentReservations(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      res.json(await analyticsService.getRecentReservations(limit));
    } catch (e) { next(e); }
  },
};

module.exports = analyticsController;

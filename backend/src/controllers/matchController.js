/**
 * Contrôleur matchs — Botola Pro Inwi
 */
const matchService = require('../services/matchService');

const matchController = {
  async getAll(req, res, next) {
    try {
      const filters = { team: req.query.team, stadium: req.query.stadium, status: req.query.status, maxPrice: req.query.maxPrice, date: req.query.date };
      res.json(await matchService.getAll(filters));
    } catch (e) { next(e); }
  },
  async getById(req, res, next) {
    try { res.json(await matchService.getById(req.params.id)); } catch (e) { next(e); }
  },
  async getUpcoming(req, res, next) {
    try { res.json(await matchService.getUpcoming()); } catch (e) { next(e); }
  },
  async create(req, res, next) {
    try { res.status(201).json(await matchService.create(req.body)); } catch (e) { next(e); }
  },
  async update(req, res, next) {
    try { res.json(await matchService.update(req.params.id, req.body)); } catch (e) { next(e); }
  },
  async updateStatus(req, res, next) {
    try { res.json(await matchService.updateStatus(req.params.id, req.body.status)); } catch (e) { next(e); }
  },
  async delete(req, res, next) {
    try { res.json(await matchService.delete(req.params.id)); } catch (e) { next(e); }
  },
};

module.exports = matchController;

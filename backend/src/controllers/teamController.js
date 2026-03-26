/**
 * Contrôleur équipes — Botola Pro Inwi
 */
const teamService = require('../services/teamService');

const teamController = {
  async getAll(req, res, next) {
    try { res.json(await teamService.getAll()); } catch (e) { next(e); }
  },
  async getById(req, res, next) {
    try { res.json(await teamService.getById(req.params.id)); } catch (e) { next(e); }
  },
  async create(req, res, next) {
    try { res.status(201).json(await teamService.create(req.body)); } catch (e) { next(e); }
  },
  async update(req, res, next) {
    try { res.json(await teamService.update(req.params.id, req.body)); } catch (e) { next(e); }
  },
  async delete(req, res, next) {
    try { res.json(await teamService.delete(req.params.id)); } catch (e) { next(e); }
  },
};

module.exports = teamController;

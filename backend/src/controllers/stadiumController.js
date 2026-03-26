/**
 * Contrôleur stades — Botola Pro Inwi
 */
const stadiumService = require('../services/stadiumService');

const stadiumController = {
  async getAll(req, res, next) {
    try { res.json(await stadiumService.getAll()); } catch (e) { next(e); }
  },
  async getById(req, res, next) {
    try { res.json(await stadiumService.getById(req.params.id)); } catch (e) { next(e); }
  },
  async getZones(req, res, next) {
    try { res.json(await stadiumService.getZones(req.params.id)); } catch (e) { next(e); }
  },
  async create(req, res, next) {
    try { res.status(201).json(await stadiumService.create(req.body)); } catch (e) { next(e); }
  },
  async update(req, res, next) {
    try { res.json(await stadiumService.update(req.params.id, req.body)); } catch (e) { next(e); }
  },
  async delete(req, res, next) {
    try { res.json(await stadiumService.delete(req.params.id)); } catch (e) { next(e); }
  },
};

module.exports = stadiumController;

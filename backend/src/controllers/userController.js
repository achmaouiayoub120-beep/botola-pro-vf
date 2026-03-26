/**
 * Contrôleur utilisateurs — Botola Pro Inwi
 */
const userService = require('../services/userService');

const userController = {
  async getAll(req, res, next) {
    try { res.json(await userService.getAll()); } catch (e) { next(e); }
  },
  async getById(req, res, next) {
    try { res.json(await userService.getById(req.params.id)); } catch (e) { next(e); }
  },
  async update(req, res, next) {
    try { res.json(await userService.update(req.params.id, req.body)); } catch (e) { next(e); }
  },
  async toggleStatus(req, res, next) {
    try { res.json(await userService.toggleStatus(req.params.id)); } catch (e) { next(e); }
  },
  async delete(req, res, next) {
    try { res.json(await userService.delete(req.params.id)); } catch (e) { next(e); }
  },
};

module.exports = userController;

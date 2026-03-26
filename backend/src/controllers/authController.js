/**
 * Contrôleur d'authentification — Botola Pro Inwi
 */
const authService = require('../services/authService');

const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ message: 'Compte créé avec succès.', user: result });
    } catch (error) { next(error); }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.json({ message: 'Connexion réussie.', ...result });
    } catch (error) { next(error); }
  },

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      res.json(user);
    } catch (error) { next(error); }
  },

  async changePassword(req, res, next) {
    try {
      const result = await authService.changePassword(req.user.id, req.body);
      res.json(result);
    } catch (error) { next(error); }
  },
};

module.exports = authController;

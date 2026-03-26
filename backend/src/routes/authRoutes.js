/**
 * Routes d'authentification — Botola Pro Inwi
 */
const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { verifyToken } = require('../middlewares/auth');
const authController = require('../controllers/authController');

const router = Router();

// POST /api/auth/register
router.post('/register', [
  body('full_name').trim().notEmpty().withMessage('Le nom complet est requis.'),
  body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  body('phone').optional().trim(),
], validate, authController.register);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
  body('password').notEmpty().withMessage('Le mot de passe est requis.'),
], validate, authController.login);

// GET /api/auth/profile
router.get('/profile', verifyToken, authController.getProfile);

// PUT /api/auth/change-password
router.put('/change-password', verifyToken, [
  body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis.'),
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères.'),
], validate, authController.changePassword);

module.exports = router;

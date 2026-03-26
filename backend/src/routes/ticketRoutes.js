/**
 * Routes billetterie — Botola Pro Inwi
 * Routes protégées par authentification JWT
 */
const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { verifyToken, requireRole } = require('../middlewares/auth');
const ticketController = require('../controllers/ticketController');

const router = Router();

// --- Utilisateur authentifié ---
router.post('/book', verifyToken, [
  body('match_id').isInt().withMessage('ID de match invalide.'),
  body('zone_name').isIn(['VIP', 'TRIBUNE', 'POPULAIRE']).withMessage('Zone invalide.'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantité entre 1 et 10.'),
  body('payment_method').optional().isIn(['card', 'cmi', 'paypal', 'cash']),
], validate, ticketController.book);

router.get('/my', verifyToken, ticketController.getMyTickets);
router.get('/:id', verifyToken, ticketController.getById);
router.get('/:id/qr', verifyToken, ticketController.getQR);
router.get('/:id/pdf', verifyToken, ticketController.downloadPDF);
router.patch('/:id/cancel', verifyToken, ticketController.cancel);

// --- Agent : scanner un billet ---
router.patch('/:id/use', verifyToken, requireRole('agent', 'admin'), ticketController.use);

// --- Admin : voir tous les billets ---
router.get('/', verifyToken, requireRole('admin'), ticketController.getAll);

module.exports = router;

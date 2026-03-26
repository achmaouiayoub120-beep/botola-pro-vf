/**
 * Routes paiements — Botola Pro Inwi
 */
const { Router } = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth');
const paymentController = require('../controllers/paymentController');

const router = Router();

router.get('/', verifyToken, requireRole('admin'), paymentController.getAll);
router.get('/ticket/:ticketId', verifyToken, paymentController.getByTicket);

module.exports = router;

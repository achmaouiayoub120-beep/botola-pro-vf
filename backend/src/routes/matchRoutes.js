/**
 * Routes matchs — Botola Pro Inwi
 */
const { Router } = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth');
const matchController = require('../controllers/matchController');

const router = Router();

router.get('/', matchController.getAll);
router.get('/upcoming', matchController.getUpcoming);
router.get('/:id', matchController.getById);

router.post('/', verifyToken, requireRole('admin'), matchController.create);
router.put('/:id', verifyToken, requireRole('admin'), matchController.update);
router.patch('/:id/status', verifyToken, requireRole('admin'), matchController.updateStatus);
router.delete('/:id', verifyToken, requireRole('admin'), matchController.delete);

module.exports = router;

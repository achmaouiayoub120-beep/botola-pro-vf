/**
 * Routes équipes — Botola Pro Inwi
 */
const { Router } = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth');
const teamController = require('../controllers/teamController');

const router = Router();

// Routes publiques
router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);

// Routes admin
router.post('/', verifyToken, requireRole('admin'), teamController.create);
router.put('/:id', verifyToken, requireRole('admin'), teamController.update);
router.delete('/:id', verifyToken, requireRole('admin'), teamController.delete);

module.exports = router;

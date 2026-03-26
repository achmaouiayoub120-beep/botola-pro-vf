/**
 * Routes utilisateurs (admin) — Botola Pro Inwi
 */
const { Router } = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth');
const userController = require('../controllers/userController');

const router = Router();

router.use(verifyToken, requireRole('admin'));

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.patch('/:id/toggle', userController.toggleStatus);
router.delete('/:id', userController.delete);

module.exports = router;

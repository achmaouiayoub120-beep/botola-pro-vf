/**
 * Routes stades — Botola Pro Inwi
 */
const { Router } = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth');
const stadiumController = require('../controllers/stadiumController');

const router = Router();

router.get('/', stadiumController.getAll);
router.get('/:id', stadiumController.getById);
router.get('/:id/zones', stadiumController.getZones);

router.post('/', verifyToken, requireRole('admin'), stadiumController.create);
router.put('/:id', verifyToken, requireRole('admin'), stadiumController.update);
router.delete('/:id', verifyToken, requireRole('admin'), stadiumController.delete);

module.exports = router;

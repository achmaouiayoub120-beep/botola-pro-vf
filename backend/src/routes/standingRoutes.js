/**
 * Routes classement — Botola Pro Inwi
 */
const { Router } = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth');
const standingController = require('../controllers/standingController');

const router = Router();

router.get('/', standingController.getAll);
router.put('/:teamId', verifyToken, requireRole('admin'), standingController.update);

module.exports = router;

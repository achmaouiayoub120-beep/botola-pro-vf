/**
 * Routes analytics (admin) — Botola Pro Inwi
 */
const { Router } = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth');
const analyticsController = require('../controllers/analyticsController');

const router = Router();

router.use(verifyToken, requireRole('admin'));

router.get('/overview', analyticsController.getOverview);
router.get('/sales', analyticsController.getSalesData);
router.get('/zones', analyticsController.getZoneDistribution);
router.get('/top-matches', analyticsController.getTopMatches);
router.get('/users', analyticsController.getUserStats);
router.get('/recent-reservations', analyticsController.getRecentReservations);

module.exports = router;

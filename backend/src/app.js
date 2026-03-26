/**
 * Application Express — Botola Pro Inwi
 * PFE 2024/2025
 * 
 * Configuration principale de l'application Express avec tous les
 * middlewares de sécurité, logging et routes API.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// ============================================================
// MIDDLEWARES DE SÉCURITÉ
// ============================================================

// Helmet — Headers de sécurité HTTP
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS — Autoriser le frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8090',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting — Protection contre les abus
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ============================================================
// MIDDLEWARES UTILITAIRES
// ============================================================

// Parsing JSON et URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes HTTP
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Fichiers statiques (PDFs générés, etc.)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================================
// ROUTES API
// ============================================================

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const stadiumRoutes = require('./routes/stadiumRoutes');
const matchRoutes = require('./routes/matchRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const standingRoutes = require('./routes/standingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/stadiums', stadiumRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/standings', standingRoutes);

// ============================================================
// ROUTE DE SANTÉ
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Botola Pro API est en ligne',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ============================================================
// GESTION D'ERREURS CENTRALISÉE
// ============================================================
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

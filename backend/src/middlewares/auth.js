/**
 * Middleware d'authentification JWT — Botola Pro Inwi
 * PFE 2024/2025
 * 
 * Gère la vérification des tokens JWT et le contrôle d'accès par rôle.
 */

const jwt = require('jsonwebtoken');

/**
 * Vérifie que la requête contient un token JWT valide.
 * Stocke les données utilisateur dans req.user.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Accès non autorisé',
      message: 'Token d\'authentification requis.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Session expirée',
        message: 'Votre session a expiré. Veuillez vous reconnecter.',
      });
    }
    return res.status(401).json({
      error: 'Token invalide',
      message: 'Le token fourni est invalide.',
    });
  }
}

/**
 * Vérifie que l'utilisateur possède le rôle requis.
 * @param  {...string} roles - Rôles autorisés (ex: 'admin', 'agent')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Authentification requise.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Accès interdit',
        message: `Rôle requis : ${roles.join(' ou ')}. Votre rôle : ${req.user.role}.`,
      });
    }

    next();
  };
}

/**
 * Middleware optionnel : attache l'utilisateur si un token est présent,
 * mais ne bloque pas si absent (pour les routes publiques avec contenu enrichi).
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // Token invalide ou expiré — on continue sans user
    }
  }

  next();
}

module.exports = { verifyToken, requireRole, optionalAuth };

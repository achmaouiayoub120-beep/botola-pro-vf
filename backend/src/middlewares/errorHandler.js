/**
 * Gestion centralisée des erreurs — Botola Pro Inwi
 * PFE 2024/2025
 */

/**
 * Middleware pour les routes non trouvées (404)
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `La route ${req.method} ${req.originalUrl} n'existe pas.`,
    status: 404,
  });
}

/**
 * Middleware de gestion globale des erreurs
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Erreur serveur:', err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Erreurs de validation express-validator
  if (err.type === 'validation') {
    return res.status(400).json({
      error: 'Erreur de validation',
      message: err.message,
      details: err.details || [],
    });
  }

  // Erreurs MySQL (code dupliqué, etc.)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Conflit',
      message: 'Cette valeur existe déjà dans la base de données.',
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'Référence invalide',
      message: 'L\'entité référencée n\'existe pas.',
    });
  }

  // Erreur JSON mal formée
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON invalide',
      message: 'Le corps de la requête n\'est pas un JSON valide.',
    });
  }

  // Erreur générique
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Erreur interne du serveur' : err.error || 'Erreur',
    message: statusCode === 500
      ? 'Une erreur inattendue est survenue. Veuillez réessayer.'
      : err.message,
  });
}

module.exports = { errorHandler, notFoundHandler };

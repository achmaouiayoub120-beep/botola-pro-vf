/**
 * Middleware de validation — Botola Pro Inwi
 * PFE 2024/2025
 * 
 * Wrapper pour express-validator afin de centraliser la gestion
 * des résultats de validation.
 */

const { validationResult } = require('express-validator');

/**
 * Vérifie les résultats de validation express-validator.
 * Retourne une erreur 400 si des erreurs de validation sont présentes.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erreur de validation',
      message: 'Les données envoyées sont invalides.',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
}

module.exports = { validate };

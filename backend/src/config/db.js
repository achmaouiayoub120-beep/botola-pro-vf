/**
 * Configuration de la connexion MySQL
 * Botola Pro Inwi — PFE 2024/2025
 * 
 * Utilise mysql2 avec un pool de connexions pour une gestion efficace
 * des connexions à la base de données.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Création du pool de connexions MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'botola_pro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Support des transactions
  multipleStatements: false,
  // Timezone Maroc
  timezone: '+01:00',
});

/**
 * Teste la connexion à la base de données
 * @returns {Promise<boolean>}
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL établie avec succès');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    return false;
  }
}

module.exports = { pool, testConnection };

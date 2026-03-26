/**
 * Point d'entrée du serveur — Botola Pro Inwi
 * PFE 2024/2025
 * 
 * Démarre le serveur Express et teste la connexion à la base de données.
 */

const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Tester la connexion à la base de données
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error('⚠️  Le serveur démarre sans connexion DB. Certaines fonctionnalités seront indisponibles.');
  }

  app.listen(PORT, () => {
    console.log('');
    console.log('  ╔═══════════════════════════════════════════╗');
    console.log('  ║   🏆 BOTOLA PRO INWI — API Backend       ║');
    console.log('  ║   Projet PFE 2024/2025                   ║');
    console.log('  ╠═══════════════════════════════════════════╣');
    console.log(`  ║   🌐 URL    : http://localhost:${PORT}        ║`);
    console.log(`  ║   📡 API    : http://localhost:${PORT}/api    ║`);
    console.log(`  ║   💚 Health : http://localhost:${PORT}/api/health ║`);
    console.log(`  ║   🔧 Mode   : ${(process.env.NODE_ENV || 'development').padEnd(23)}║`);
    console.log('  ╚═══════════════════════════════════════════╝');
    console.log('');
  });
}

startServer();

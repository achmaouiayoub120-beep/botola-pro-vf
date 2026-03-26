/**
 * Service d'analytics — Botola Pro Inwi
 * PFE 2024/2025
 */

const { pool } = require('../config/db');

class AnalyticsService {
  /** Vue d'ensemble : totaux principaux */
  async getOverview() {
    const [[users]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE role = "user"');
    const [[tickets]] = await pool.execute('SELECT COUNT(*) AS total, COALESCE(SUM(total_price), 0) AS revenue FROM tickets WHERE status IN ("paid", "used")');
    const [[matches]] = await pool.execute('SELECT COUNT(*) AS total FROM matches WHERE status IN ("scheduled", "open")');
    const [[recentUsers]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');

    return {
      totalUsers: users.total,
      totalTicketsSold: tickets.total,
      totalRevenue: parseFloat(tickets.revenue),
      activeMatches: matches.total,
      newUsersThisMonth: recentUsers.total,
    };
  }

  /** Ventes par jour (7 derniers jours) */
  async getSalesData() {
    const [rows] = await pool.execute(`
      SELECT DATE(created_at) AS date,
        COUNT(*) AS tickets_sold,
        COALESCE(SUM(total_price), 0) AS revenue
      FROM tickets
      WHERE status IN ('paid', 'used') AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    return rows;
  }

  /** Répartition des ventes par zone */
  async getZoneDistribution() {
    const [rows] = await pool.execute(`
      SELECT zone_name, COUNT(*) AS count, COALESCE(SUM(total_price), 0) AS revenue
      FROM tickets WHERE status IN ('paid', 'used')
      GROUP BY zone_name ORDER BY revenue DESC
    `);
    return rows;
  }

  /** Top matchs par revenus */
  async getTopMatches() {
    const [rows] = await pool.execute(`
      SELECT m.id, ht.short_name AS home_short, at2.short_name AS away_short,
        COUNT(t.id) AS tickets_sold, COALESCE(SUM(t.total_price), 0) AS revenue
      FROM tickets t
      JOIN matches m ON t.match_id = m.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at2 ON m.away_team_id = at2.id
      WHERE t.status IN ('paid', 'used')
      GROUP BY m.id, ht.short_name, at2.short_name
      ORDER BY revenue DESC LIMIT 5
    `);
    return rows;
  }

  /** Statistiques utilisateurs */
  async getUserStats() {
    const [rows] = await pool.execute(`
      SELECT role, COUNT(*) AS count FROM users GROUP BY role
    `);
    const [[activeUsers]] = await pool.execute('SELECT COUNT(*) AS count FROM users WHERE is_active = TRUE');
    return { byRole: rows, activeUsers: activeUsers.count };
  }

  /** Dernières réservations */
  async getRecentReservations(limit = 10) {
    const [rows] = await pool.execute(`
      SELECT t.id, t.booking_reference, t.zone_name, t.total_price, t.status, t.created_at,
        u.full_name AS user_name,
        ht.short_name AS home_short, at2.short_name AS away_short
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      JOIN matches m ON t.match_id = m.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at2 ON m.away_team_id = at2.id
      ORDER BY t.created_at DESC LIMIT ?
    `, [limit]);
    return rows;
  }
}

module.exports = new AnalyticsService();

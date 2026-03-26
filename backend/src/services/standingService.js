/**
 * Service de classement — Botola Pro Inwi
 * PFE 2024/2025
 */

const { pool } = require('../config/db');

class StandingService {
  /** Récupérer le classement complet trié par points */
  async getAll(season = '2025-2026') {
    const [rows] = await pool.execute(`
      SELECT s.*, t.name AS team_name, t.short_name AS team_short,
        t.logo_url AS team_logo, t.color_primary, t.color_secondary, t.city AS team_city
      FROM standings s
      JOIN teams t ON s.team_id = t.id
      WHERE s.season = ?
      ORDER BY s.points DESC, s.goal_difference DESC, s.goals_for DESC
    `, [season]);
    return rows;
  }

  /** Mettre à jour le classement d'une équipe */
  async update(teamId, data) {
    const { played, wins, draws, losses, goals_for, goals_against, form } = data;
    const season = data.season || '2025-2026';

    await pool.execute(`
      INSERT INTO standings (team_id, season, played, wins, draws, losses, goals_for, goals_against, form)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        played = VALUES(played), wins = VALUES(wins), draws = VALUES(draws),
        losses = VALUES(losses), goals_for = VALUES(goals_for),
        goals_against = VALUES(goals_against), form = VALUES(form)
    `, [teamId, season, played, wins, draws, losses, goals_for, goals_against, form || null]);

    return this.getAll(season);
  }
}

module.exports = new StandingService();

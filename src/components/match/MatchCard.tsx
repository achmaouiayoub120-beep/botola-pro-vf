import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import TeamLogo from "@/components/TeamLogo";

export interface ApiMatch {
  id: number;
  match_date: string;
  matchday: number;
  status: string;
  ticket_base_price: number | string;
  available_seats: number;
  total_seats: number;
  
  home_team_id: number;
  home_team_name: string;
  home_team_short: string;
  home_team_logo: string;
  home_color_primary: string;
  home_color_secondary: string;
  
  away_team_id: number;
  away_team_name: string;
  away_team_short: string;
  away_team_logo: string;
  away_color_primary: string;
  away_color_secondary: string;
  
  stadium_name: string;
  stadium_city: string;
}


function CountdownDisplay({ date }: { date: string }) {
  const { days, hours, minutes, seconds } = useCountdown(date);
  return (
    <div className="flex gap-2 font-mono text-xs text-primary">
      <span>{days}j</span>
      <span>{hours}h</span>
      <span>{minutes}m</span>
      <span>{seconds}s</span>
    </div>
  );
}

export default function MatchCard({ match }: { match: ApiMatch }) {
  const dateObj = new Date(match.match_date);
  const fillPercent = ((match.total_seats - match.available_seats) / match.total_seats) * 100;
  const isAlmostFull = fillPercent > 90;
  const isFull = match.available_seats === 0;

  const homeTeam = {
    id: match.home_team_id,
    name: match.home_team_name,
    shortName: match.home_team_short,
    colorPrimary: match.home_color_primary,
    colorSecondary: match.home_color_secondary,
    logoUrl: match.home_team_logo || null
  };

  const awayTeam = {
    id: match.away_team_id,
    name: match.away_team_name,
    shortName: match.away_team_short,
    colorPrimary: match.away_color_primary,
    colorSecondary: match.away_color_secondary,
    logoUrl: match.away_team_logo || null
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass overflow-hidden group cursor-pointer"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
          <span className="text-xs text-muted-foreground uppercase font-medium">
            <Calendar className="inline w-3 h-3 mr-1" />
            {dateObj.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="text-xs text-muted-foreground">
            <Clock className="inline w-3 h-3 mr-1" />
            {dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">J{match.matchday}</span>
      </div>

      {/* Teams */}
      <div className="px-5 py-6 flex items-center justify-between">
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamLogo team={homeTeam} size={48} />
          <span className="text-xs font-heading font-semibold text-foreground text-center leading-tight">{homeTeam.name}</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-4">
          <span className="font-display text-2xl text-muted-foreground">VS</span>
          <CountdownDisplay date={match.match_date} />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamLogo team={awayTeam} size={48} />
          <span className="text-xs font-heading font-semibold text-foreground text-center leading-tight">{awayTeam.name}</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{match.stadium_name}, {match.stadium_city}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <div className="flex-1">
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: fillPercent / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`h-full rounded-full origin-left ${isAlmostFull ? "bg-accent" : "bg-primary"}`}
              />
            </div>
          </div>
          <span className="font-mono text-xs">
            {match.available_seats.toLocaleString()} / {match.total_seats.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <span className="text-sm font-heading text-foreground">
          À partir de <span className="text-primary font-bold font-mono">{match.ticket_base_price} MAD</span>
        </span>
        <Link
          to={`/reservation/${match.id}`}
          className={`text-xs font-heading font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-300 ${
            isFull
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : isAlmostFull
              ? "bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30"
              : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50"
          }`}
          onClick={(e) => isFull && e.preventDefault()}
        >
          {isFull ? "COMPLET" : isAlmostFull ? "DERNIÈRES PLACES" : "RÉSERVER →"}
        </Link>
      </div>
    </motion.div>
  );
}

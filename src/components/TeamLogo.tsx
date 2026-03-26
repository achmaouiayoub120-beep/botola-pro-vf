import type { Team } from "@/data/teams";

interface TeamLogoProps {
  team: Team;
  size?: number;
  className?: string;
}

export default function TeamLogo({ team, size = 40, className = "" }: TeamLogoProps) {
  if (team.logo) {
    return (
      <img
        src={team.logo}
        alt={team.name}
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: team.colors[0],
        color: team.colors[1],
      }}
    >
      {team.shortName.slice(0, 3)}
    </div>
  );
}

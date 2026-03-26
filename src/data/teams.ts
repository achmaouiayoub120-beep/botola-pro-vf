import farLogo from "@/assets/teams/far.png";
import codmLogo from "@/assets/teams/codm.png";
import ocsLogo from "@/assets/teams/ocs.png";
import odjLogo from "@/assets/teams/odj.png";
import rcaLogo from "@/assets/teams/rca.png";
import rszLogo from "@/assets/teams/rsz.png";
import rsbLogo from "@/assets/teams/rsb.png";
import utsLogo from "@/assets/teams/uts.png";
import masLogo from "@/assets/teams/mas.png";
import kacmLogo from "@/assets/teams/kacm.png";
import irtLogo from "@/assets/teams/irt.png";
import dhjLogo from "@/assets/teams/dhj.png";

export interface Team {
  id: number;
  name: string;
  shortName: string;
  city: string;
  colors: [string, string];
  stadiumId: number;
  logo?: string;
}

export const TEAMS: Team[] = [
  { id: 1, name: "Wydad Athletic Club", shortName: "WAC", city: "Casablanca", colors: ["#DC143C", "#FFFFFF"], stadiumId: 1 },
  { id: 2, name: "Raja Club Athletic", shortName: "RCA", city: "Casablanca", colors: ["#00A651", "#FFFFFF"], stadiumId: 1, logo: rcaLogo },
  { id: 3, name: "AS FAR", shortName: "FAR", city: "Rabat", colors: ["#DC143C", "#FFFFFF"], stadiumId: 2, logo: farLogo },
  { id: 4, name: "FUS Rabat", shortName: "FUS", city: "Rabat", colors: ["#DC143C", "#FFFFFF"], stadiumId: 2 },
  { id: 5, name: "Maghreb de Fes", shortName: "MAS", city: "Fes", colors: ["#FFD700", "#000000"], stadiumId: 4, logo: masLogo },
  { id: 6, name: "RS Berkane", shortName: "RSB", city: "Berkane", colors: ["#FF6B00", "#000000"], stadiumId: 5, logo: rsbLogo },
  { id: 7, name: "Hassania Agadir", shortName: "HUSA", city: "Agadir", colors: ["#003F8A", "#FFFFFF"], stadiumId: 6 },
  { id: 8, name: "Ittihad de Tanger", shortName: "IRT", city: "Tanger", colors: ["#1A3C8F", "#FFFFFF"], stadiumId: 7, logo: irtLogo },
  { id: 9, name: "Olympique Club de Safi", shortName: "OCS", city: "Safi", colors: ["#1B2A4A", "#DC143C"], stadiumId: 8, logo: ocsLogo },
  { id: 10, name: "Difaa Hassani El Jadida", shortName: "DHJ", city: "El Jadida", colors: ["#00A651", "#FFFFFF"], stadiumId: 9, logo: dhjLogo },
  { id: 11, name: "COD Meknes", shortName: "CODM", city: "Meknes", colors: ["#DC143C", "#FFFFFF"], stadiumId: 10, logo: codmLogo },
  { id: 12, name: "Union Touarga Sportif", shortName: "UTS", city: "Rabat", colors: ["#D4A017", "#FFFFFF"], stadiumId: 2, logo: utsLogo },
  { id: 13, name: "Renaissance Zemamra", shortName: "RSZ", city: "Zemamra", colors: ["#2E7BD6", "#FFFFFF"], stadiumId: 10, logo: rszLogo },
  { id: 14, name: "Olympique Dcheira", shortName: "ODJ", city: "Dcheira", colors: ["#00A651", "#FFFFFF"], stadiumId: 6, logo: odjLogo },
  { id: 15, name: "Kawkab Marrakech", shortName: "KACM", city: "Marrakech", colors: ["#8B1A1A", "#FFD700"], stadiumId: 3, logo: kacmLogo },
  { id: 16, name: "Union Yacoub El Mansour", shortName: "UYM", city: "Rabat", colors: ["#00A651", "#FFFFFF"], stadiumId: 2 },
];

export const getTeamById = (id: number) => TEAMS.find(t => t.id === id);

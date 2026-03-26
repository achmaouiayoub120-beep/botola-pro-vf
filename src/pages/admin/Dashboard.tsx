import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Ticket,
  TrendingUp,
  Activity,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import api from "@/services/api";

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    totalRevenue: 0,
    activeMatches: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [topMatches, setTopMatches] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, salesRes, zonesRes, matchesRes, reservationsRes] = await Promise.all([
          api.get('/admin/analytics/overview'),
          api.get('/admin/analytics/sales'),
          api.get('/admin/analytics/zones'),
          api.get('/admin/analytics/top-matches'),
          api.get('/admin/analytics/recent-reservations')
        ]);

        setStats(overviewRes.data);
        setSalesData(salesRes.data);
        
        // Map zone colors
        const colors = {
          "VIP": "hsl(43, 90%, 48%)",
          "TRIBUNE": "hsl(213, 76%, 51%)",
          "POPULAIRE": "hsl(152, 100%, 32%)"
        };
        const mappedZones = zonesRes.data.map((z: any) => ({
          ...z,
          color: colors[z.name as keyof typeof colors] || "hsl(0, 0%, 50%)"
        }));
        setZoneData(mappedZones);
        
        setTopMatches(matchesRes.data);
        setRecentReservations(reservationsRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const DYNAMIC_STATS = [
    { label: "Total Utilisateurs", value: stats.totalUsers, change: "+0%", icon: Users, color: "text-primary" },
    { label: "Billets Vendus", value: stats.totalTickets, change: "+0%", icon: Ticket, color: "text-secondary" },
    { label: "Revenu Total", value: stats.totalRevenue || 0, suffix: " MAD", change: "+0%", icon: TrendingUp, color: "text-gold" },
    { label: "Matchs Actifs", value: stats.activeMatches, change: "En direct", icon: Activity, color: "text-accent" },
  ];
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display text-4xl text-foreground">TABLEAU DE BORD</h1>
        <p className="text-muted-foreground font-heading">Bienvenue dans le centre de contrôle Botola Ticket.</p>
      </header>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DYNAMIC_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong p-6 relative overflow-hidden group"
              >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{stat.label}</p>
                <h3 className="text-3xl font-display text-foreground mt-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix || ""} />
                </h3>
              </div>
              <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                {stat.change}
              </span>
              <span className="text-[10px] text-muted-foreground font-heading">vs mois dernier</span>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <stat.icon className="w-24 h-24" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-strong p-6">
          <h3 className="text-display text-xl mb-6">VENTES DE BILLETS (30 JOURS)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSalesDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSalesDash)" strokeWidth={3} name="Billets" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Distribution (Donut) */}
        <div className="glass-strong p-6">
          <h3 className="text-display text-xl mb-6">ZONES</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={zoneData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}`}
                >
                  {zoneData.map((entry: any, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Matches */}
        <div className="glass-strong p-6">
          <h3 className="text-display text-xl mb-6">TOP MATCHS</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMatches} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="match" stroke="hsl(var(--muted-foreground))" fontSize={10} width={80} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="revenue" fill="hsl(var(--gold))" radius={[0, 4, 4, 0]} name="Revenu (MAD)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="lg:col-span-2 glass-strong p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-display text-xl">DERNIÈRES RÉSERVATIONS</h3>
            <span className="text-[10px] text-muted-foreground font-mono">Mise à jour auto</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left py-2 px-3 font-semibold">ID</th>
                  <th className="text-left py-2 px-3 font-semibold">Utilisateur</th>
                  <th className="text-left py-2 px-3 font-semibold">Match</th>
                  <th className="text-center py-2 px-3 font-semibold">Zone</th>
                  <th className="text-right py-2 px-3 font-semibold">Montant</th>
                  <th className="text-center py-2 px-3 font-semibold">Statut</th>
                  <th className="text-right py-2 px-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r: any) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-xs text-primary">{r.booking_reference}</td>
                    <td className="py-2.5 px-3 text-xs font-heading">{r.full_name}</td>
                    <td className="py-2.5 px-3 text-xs">{r.match_teams}</td>
                    <td className="text-center py-2.5 px-3 text-xs">{r.zone}</td>
                    <td className="text-right py-2.5 px-3 font-mono text-xs">{r.amount} MAD</td>
                    <td className="text-center py-2.5 px-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${r.status === "CONFIRMED" ? "bg-primary/10 text-primary" :
                          r.status === "PENDING" ? "bg-gold/10 text-gold" :
                            "bg-accent/10 text-accent"
                        }`}>
                        {r.status === "CONFIRMED" ? "Confirmé" : r.status === "PENDING" ? "En attente" : "Annulé"}
                      </span>
                    </td>
                    <td className="text-right py-2.5 px-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="glass-strong p-6">
        <h3 className="text-display text-xl mb-4">ALERTES SYSTÈME</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: "warning", text: "Stade Adrar : Stock billets < 10%", icon: AlertCircle },
            { type: "info", text: "8 nouveaux utilisateurs inscrits aujourd'hui", icon: Users },
            { type: "success", text: "Match #124 : Score mis à jour avec succès", icon: Calendar },
          ].map((alert, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <alert.icon className={cn("w-4 h-4 mt-0.5", alert.type === "warning" ? "text-accent" : "text-primary")} />
              <p className="text-xs text-foreground font-heading">{alert.text}</p>
            </div>
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  );
}

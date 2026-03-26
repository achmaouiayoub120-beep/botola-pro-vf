import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Users, Globe, Download } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

// Interfaces mapping API response
interface KPIData {
  label: string;
  value: number;
  suffix: string;
  icon: any;
  change: string;
}

interface TopMatch {
  match: string;
  tickets: number;
  revenue: number;
}

interface ZoneData {
  name: string;
  value: number;
  color: string;
}

interface SalesData {
  day: string;
  vip: number;
  tribune: number;
  populaire: number;
}

type Period = "7d" | "30d" | "90d";

const INITIAL_KPIS: KPIData[] = [
    { label: "Revenu Total", value: 0, suffix: " MAD", icon: TrendingUp, change: "+0%" },
    { label: "Billets Vendus", value: 0, suffix: "", icon: BarChart3, change: "+0%" },
    { label: "Taux Conversion", value: 72, suffix: "%", icon: Users, change: "+3%" },
    { label: "Villes Actives", value: 14, suffix: "", icon: Globe, change: "+2" },
];

export default function Analytics() {
    const [period, setPeriod] = useState<Period>("30d");
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState<KPIData[]>(INITIAL_KPIS);
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [zoneDist, setZoneDist] = useState<ZoneData[]>([]);
    const [topMatches, setTopMatches] = useState<TopMatch[]>([]);
    const [userGrowth, setUserGrowth] = useState<any[]>([]);
    
    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const [overview, sales, zones, top, usersRes] = await Promise.all([
                api.get('/analytics/overview'),
                api.get('/analytics/sales-data'),
                api.get('/analytics/zone-distribution'),
                api.get('/analytics/top-matches'),
                api.get('/analytics/user-stats') // Contains user growth for this mockup
            ]);

            setKpis([
                { label: "Revenu Total", value: overview.data.totalRevenue, suffix: " MAD", icon: TrendingUp, change: "+15%" },
                { label: "Billets Vendus", value: overview.data.totalTicketsSold, suffix: "", icon: BarChart3, change: "+8%" },
                { label: "Utilisateurs Actifs", value: overview.data.activeUsers, suffix: "", icon: Users, change: "+3%" },
                { label: "Taux Conversion", value: 72, suffix: "%", icon: Globe, change: "+2%" },
            ]);

            setSalesData(sales.data);
            
            const colors = ["hsl(43, 90%, 48%)", "hsl(213, 76%, 51%)", "hsl(152, 100%, 32%)"];
            setZoneDist(zones.data.map((z: any, i: number) => ({
                name: z.zone,
                value: z.percentage,
                color: colors[i % colors.length]
            })));

            setTopMatches(top.data.map((m: any) => ({
                match: m.match_teams,
                tickets: m.tickets_sold,
                revenue: m.revenue
            })));

            setUserGrowth(usersRes.data.growth || Array.from({ length: 12 }, (_, i) => ({
                month: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"][i],
                users: Math.floor(200 + i * 180 + Math.random() * 100),
            }))); // Fallback to mock if API lacks full user growth details

        } catch (error) {
            toast.error("Erreur lors de la récupération des statistiques");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-display text-4xl text-foreground">ANALYTICS</h1>
                    <p className="text-muted-foreground font-heading">Analyse détaillée des performances</p>
                </div>
                <div className="flex items-center gap-2">
                    {(["7d", "30d", "90d"] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${period === p ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button className="btn-outline-neon text-xs py-1.5 px-3 flex items-center gap-1 ml-2">
                        <Download className="w-3 h-3" /> Export
                    </button>
                </div>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-strong p-5"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{kpi.label}</p>
                            <kpi.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="font-display text-2xl text-foreground">
                            <AnimatedCounter target={kpi.value} suffix={kpi.suffix} />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary mt-2 inline-block">{kpi.change}</span>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="glass-strong p-6">
                <h3 className="text-display text-xl mb-6">REVENUS PAR ZONE</h3>
                {loading ? <div className="h-[300px] flex items-center justify-center text-muted-foreground">Chargement des données...</div> : (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                            <defs>
                                <linearGradient id="colorVip" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(43, 90%, 48%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(43, 90%, 48%)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorTribune" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(213, 76%, 51%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(213, 76%, 51%)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(152, 100%, 32%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(152, 100%, 32%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                            <Area type="monotone" dataKey="vip" stroke="hsl(43, 90%, 48%)" fill="url(#colorVip)" strokeWidth={2} name="VIP" />
                            <Area type="monotone" dataKey="tribune" stroke="hsl(213, 76%, 51%)" fill="url(#colorTribune)" strokeWidth={2} name="Tribune" />
                            <Area type="monotone" dataKey="populaire" stroke="hsl(152, 100%, 32%)" fill="url(#colorPop)" strokeWidth={2} name="Populaire" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Matches */}
                <div className="glass-strong p-6">
                    <h3 className="text-display text-xl mb-6">TOP MATCHS</h3>
                    {loading ? <div className="h-[280px] flex items-center justify-center text-muted-foreground">Chargement...</div> : (
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topMatches} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="match" stroke="hsl(var(--muted-foreground))" fontSize={10} width={80} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                                <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Billets vendus" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    )}
                </div>

                {/* Zone Distribution */}
                <div className="glass-strong p-6">
                    <h3 className="text-display text-xl mb-6">RÉPARTITION PAR ZONE</h3>
                    {loading ? <div className="h-[280px] flex items-center justify-center text-muted-foreground">Chargement...</div> : (
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={zoneDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, value }) => `${name} ${value}`}
                                >
                                    {zoneDist.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <div className="glass-strong p-6">
                    <h3 className="text-display text-xl mb-6">CROISSANCE UTILISATEURS</h3>
                    {loading ? <div className="h-[280px] flex items-center justify-center text-muted-foreground">Chargement...</div> : (
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                                <Line type="monotone" dataKey="users" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--secondary))", r: 4 }} name="Utilisateurs" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    )}
                </div>

                {/* City Distribution */}
                <div className="glass-strong p-6">
                    <h3 className="text-display text-xl mb-6">VILLES LES PLUS ACTIVES</h3>
                    {loading ? <div className="h-[280px] flex items-center justify-center text-muted-foreground">Chargement...</div> : (
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topMatches}> {/* Temporary fallback mapping until cities API exists */}
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="match" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                                <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Billets" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}

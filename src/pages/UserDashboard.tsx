import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Ticket, Clock, User, LogOut, QrCode, Download, Calendar, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TeamLogo from "@/components/TeamLogo";
import { staggerContainer, staggerItem } from "@/design-system/animations";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { useTicketPDF } from "@/hooks/useTicketPDF";

type Tab = "overview" | "tickets" | "history" | "profile";

export interface ApiTicket {
  id: number;
  booking_reference: string;
  qr_code_value: string;
  zone: string;
  price: string;
  status: string;
  created_at: string;
  match_id: number;
  match_date: string;
  stadium_name: string;
  stadium_city: string;
  home_team_name: string;
  home_team_short: string;
  home_team_logo: string;
  home_color_primary: string;
  home_color_secondary: string;
  away_team_name: string;
  away_team_short: string;
  away_team_logo: string;
  away_color_primary: string;
  away_color_secondary: string;
}


// TABS Config

const TABS: { key: Tab; label: string; icon: typeof Home }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: Home },
    { key: "tickets", label: "Mes Billets", icon: Ticket },
    { key: "history", label: "Historique", icon: Clock },
    { key: "profile", label: "Profil", icon: User },
];

const KPIS = [
    { label: "Billets Actifs", value: 2, icon: Ticket, color: "text-primary" },
    { label: "Matchs à Venir", value: 2, icon: Calendar, color: "text-secondary" },
    { label: "Total Billets", value: 5, icon: Ticket, color: "text-gold" },
    { label: "Total Dépensé", value: 1100, suffix: " MAD", icon: Download, color: "text-accent" },
];

function TicketCard({ ticket }: { ticket: ApiTicket }) {
    const [showQR, setShowQR] = useState(false);
    const { generatePDF } = useTicketPDF();
    
    const isUpcoming = new Date(ticket.match_date) > new Date();

    const homeTeam = {
        id: 1,
        name: ticket.home_team_name,
        shortName: ticket.home_team_short,
        colorPrimary: ticket.home_color_primary || "#000",
        colorSecondary: ticket.home_color_secondary || "#fff",
        logoUrl: ticket.home_team_logo
    };

    const awayTeam = {
        id: 2,
        name: ticket.away_team_name,
        shortName: ticket.away_team_short,
        colorPrimary: ticket.away_color_primary || "#000",
        colorSecondary: ticket.away_color_secondary || "#fff",
        logoUrl: ticket.away_team_logo
    };

    const handleDownloadPDF = () => {
        const dateObj = new Date(ticket.match_date);
        generatePDF({
            ticketId: ticket.booking_reference,
            homeName: homeTeam.name,
            awayName: awayTeam.name,
            homeShort: homeTeam.shortName,
            awayShort: awayTeam.shortName,
            stadiumName: ticket.stadium_name,
            stadiumCity: ticket.stadium_city,
            date: dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
            time: dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            zone: ticket.zone,
            quantity: 1,
            totalPrice: parseFloat(ticket.price),
        });
    };

    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="glass p-5 relative overflow-hidden"
        >
            {/* Status badge */}
            <div className="absolute top-3 right-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isUpcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                    {isUpcoming ? "À venir" : "Passé"}
                </span>
            </div>

            {/* Teams */}
            <div className="flex items-center gap-3 mb-3">
                <TeamLogo team={homeTeam} size={32} />
                <span className="text-xs font-heading font-bold text-foreground">{homeTeam.shortName} vs {awayTeam.shortName}</span>
                <TeamLogo team={awayTeam} size={32} />
            </div>

            {/* Info */}
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
                <p className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(ticket.match_date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                </p>
                <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {ticket.stadium_name}
                </p>
                <p className="font-semibold text-foreground">
                    🎫 {ticket.zone} · 1 billet(s) · <span className="font-mono text-primary">{ticket.price} MAD</span>
                </p>
            </div>

            {/* QR Code toggle */}
            <AnimatePresence>
                {showQR && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex justify-center mb-3 overflow-hidden"
                    >
                        <div className="p-2 bg-white rounded-lg">
                            <QRCodeSVG value={`BOTOLA-TICKET:${ticket.qr_code_value}`} size={80} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-2">
                <button onClick={() => setShowQR(!showQR)} className="flex-1 flex items-center justify-center gap-1 text-[10px] font-heading font-bold text-primary border border-primary/20 rounded-lg py-1.5 hover:bg-primary/5 transition-colors">
                    <QrCode className="w-3 h-3" />
                    {showQR ? "Masquer" : "QR Code"}
                </button>
                <button onClick={handleDownloadPDF} className="flex-1 flex items-center justify-center gap-1 text-[10px] font-heading font-bold text-foreground border border-border rounded-lg py-1.5 hover:bg-muted transition-colors">
                    <Download className="w-3 h-3" />
                    PDF
                </button>
            </div>

            {/* Ticket ID */}
            <p className="font-mono text-[9px] text-muted-foreground mt-2 text-center">{ticket.booking_reference}</p>
        </motion.div>
    );
}

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [tickets, setTickets] = useState<ApiTicket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await api.get('/tickets/my-tickets');
                setTickets(res.data);
            } catch (error) {
                console.error("Erreur lors du chargement des billets:", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchTickets();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null;

    const upcomingTickets = tickets.filter(t => new Date(t.match_date) > new Date());
    const pastTickets = tickets.filter(t => new Date(t.match_date) <= new Date());
    const totalSpent = tickets.reduce((acc, t) => acc + parseFloat(t.price), 0);

    const DYNAMIC_KPIS = [
        { label: "Billets Actifs", value: upcomingTickets.length, icon: Ticket, color: "text-primary" },
        { label: "Matchs à Venir", value: upcomingTickets.length, icon: Calendar, color: "text-secondary" },
        { label: "Total Billets", value: tickets.length, icon: Ticket, color: "text-gold" },
        { label: "Total Dépensé", value: totalSpent, suffix: " MAD", icon: Download, color: "text-accent" },
    ];

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* ═══ SIDEBAR ═══ */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="glass p-5 lg:sticky lg:top-24">
                            {/* Avatar */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <User className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-heading font-bold text-foreground">{user?.full_name}</h3>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>

                            <div className="border-t border-border pt-4 space-y-1">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-heading font-medium transition-all duration-200 ${activeTab === tab.key
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                        {activeTab === tab.key && <ChevronRight className="w-3 h-3 ml-auto" />}
                                    </button>
                                ))}

                                <div className="border-t border-border pt-2 mt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-heading font-medium text-destructive hover:bg-destructive/10 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Déconnexion
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ═══ MAIN CONTENT ═══ */}
                    <main className="flex-1">
                        <AnimatePresence mode="wait">
                            {/* OVERVIEW */}
                            {activeTab === "overview" && (
                                <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <h1 className="text-display text-3xl text-foreground mb-6">MON ESPACE</h1>

                                    {/* KPIs */}
                                    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        {DYNAMIC_KPIS.map((kpi) => (
                                            <motion.div key={kpi.label} variants={staggerItem} className="glass p-4 text-center">
                                                <kpi.icon className={`w-5 h-5 mx-auto mb-2 ${kpi.color}`} />
                                                <div className="font-display text-2xl text-foreground">
                                                    <AnimatedCounter target={kpi.value} suffix={kpi.suffix || ""} />
                                                </div>
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{kpi.label}</p>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Recent tickets */}
                                    <h2 className="font-heading font-bold text-foreground text-lg mb-4">Billets récents</h2>
                                    
                                    {loading ? (
                                        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                                    ) : upcomingTickets.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {upcomingTickets.slice(0, 4).map((ticket) => (
                                                <TicketCard key={ticket.id} ticket={ticket} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="glass p-8 text-center text-muted-foreground">
                                            Aucun billet récent.
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* TICKETS */}
                            {activeTab === "tickets" && (
                                <motion.div key="tickets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <h1 className="text-display text-3xl text-foreground mb-6">MES BILLETS</h1>
                                    {loading ? (
                                        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                                    ) : tickets.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {tickets.map((ticket) => (
                                                <TicketCard key={ticket.id} ticket={ticket} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="glass p-8 text-center text-muted-foreground">
                                            Vous n'avez aucun billet.
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* HISTORY */}
                            {activeTab === "history" && (
                                <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <h1 className="text-display text-3xl text-foreground mb-6">HISTORIQUE</h1>
                                    <div className="glass overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                                    <th className="text-left py-3 px-4">Billet</th>
                                                    <th className="text-left py-3 px-2">Match</th>
                                                    <th className="text-center py-3 px-2">Zone</th>
                                                    <th className="text-center py-3 px-2">Prix</th>
                                                    <th className="text-center py-3 px-2">Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan={5} className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></td>
                                                    </tr>
                                                ) : tickets.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="py-8 text-center text-muted-foreground">Aucun historique disponible.</td>
                                                    </tr>
                                                ) : tickets.map((t) => {
                                                    const isUpcoming = new Date(t.match_date) > new Date();
                                                    return (
                                                        <tr key={t.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                                                            <td className="py-3 px-4 font-mono text-xs text-primary">{t.booking_reference}</td>
                                                            <td className="py-3 px-2 text-xs font-heading">{t.home_team_short} vs {t.away_team_short}</td>
                                                            <td className="text-center py-3 px-2 text-xs">{t.zone}</td>
                                                            <td className="text-center py-3 px-2 font-mono text-xs">{t.price} MAD</td>
                                                            <td className="text-center py-3 px-2">
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isUpcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                                                    {isUpcoming ? "À venir" : "Passé"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {/* PROFILE */}
                            {activeTab === "profile" && (
                                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <h1 className="text-display text-3xl text-foreground mb-6">MON PROFIL</h1>
                                    <div className="glass p-6 space-y-4 max-w-lg">
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Nom complet</label>
                                            <input defaultValue={user?.full_name} className="w-full bg-muted rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary" disabled />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                                            <input defaultValue={user?.email} className="w-full bg-muted rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary" disabled />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Téléphone</label>
                                            <input defaultValue={user?.phone || 'Non renseigné'} className="w-full bg-muted rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary" disabled />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Date d'inscription</label>
                                            <p className="text-sm text-foreground font-mono">{new Date(user?.created_at).toLocaleDateString("fr-FR")}</p>
                                        </div>
                                        <button className="btn-neon mt-4">Sauvegarder</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}

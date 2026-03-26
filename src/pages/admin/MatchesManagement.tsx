import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Calendar, Clock, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/services/api";

interface ApiMatch {
  id: number;
  home_team_id: number;
  home_team_name: string;
  home_team_short: string;
  away_team_id: number;
  away_team_name: string;
  away_team_short: string;
  stadium_id: number;
  stadium_name: string;
  stadium_city: string;
  match_date: string;
  ticket_base_price: string;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED";
  total_seats: number;
  available_seats: number;
}

interface ApiTeam {
  id: number;
  name: string;
  short_name: string;
}

interface ApiStadium {
  id: number;
  name: string;
  city: string;
  capacity: number;
}
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function MatchesManagement() {
  const [matches, setMatches] = useState<ApiMatch[]>([]);
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [stadiums, setStadiums] = useState<ApiStadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchesRes, teamsRes, stadiumsRes] = await Promise.all([
        api.get('/matches'),
        api.get('/teams'),
        api.get('/stadiums')
      ]);
      setMatches(matchesRes.data.data || matchesRes.data);
      setTeams(teamsRes.data);
      setStadiums(stadiumsRes.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    homeTeamId: "",
    awayTeamId: "",
    stadiumId: "",
    date: "",
    priceVip: "",
    priceTribune: "",
    pricePopulaire: "",
    status: "SCHEDULED" as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.homeTeamId || !formData.awayTeamId || !formData.stadiumId || !formData.date || !formData.pricePopulaire) {
      toast.error("Veuillez remplir tous les champs obligatoires (prix Populaire sert de base)");
      return;
    }

    if (formData.homeTeamId === formData.awayTeamId) {
      toast.error("L'équipe à domicile et à l'extérieur doivent être différentes.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/matches', {
        homeTeamId: Number(formData.homeTeamId),
        awayTeamId: Number(formData.awayTeamId),
        stadiumId: Number(formData.stadiumId),
        matchDate: formData.date,
        matchday: 27,
        ticketBasePrice: Number(formData.pricePopulaire),
        status: formData.status
      });

      toast.success("Match créé avec succès !");
      setIsDialogOpen(false);
      fetchData(); // Refresh UI
      
      // Reset form
      setFormData({
        homeTeamId: "",
        awayTeamId: "",
        stadiumId: "",
        date: "",
        priceVip: "",
        priceTribune: "",
        pricePopulaire: "",
        status: "SCHEDULED"
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la création du match");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce match ?")) {
      try {
        await api.delete(`/matches/${id}`);
        toast.success("Match supprimé !");
        fetchData();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-display text-4xl text-foreground">GESTION DES MATCHS</h1>
          <p className="text-muted-foreground font-heading">Programmez et gérez les {matches.length} rencontres.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="btn-neon flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Créer un match
            </button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-border/50 text-foreground max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Créer un Match</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Équipe Domicile *</label>
                  <select 
                    required
                    value={formData.homeTeamId}
                    onChange={(e) => {
                      setFormData({...formData, homeTeamId: e.target.value});
                      // Auto select preferred stadium if possible
                      const team = getTeamById(Number(e.target.value));
                      if (team && !formData.stadiumId) {
                        setFormData(prev => ({...prev, stadiumId: team.stadiumId.toString()}));
                      }
                    }}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sélectionner</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Équipe Extérieure *</label>
                  <select 
                    required
                    value={formData.awayTeamId}
                    onChange={(e) => setFormData({...formData, awayTeamId: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sélectionner</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Stade *</label>
                <select 
                  required
                  value={formData.stadiumId}
                  onChange={(e) => setFormData({...formData, stadiumId: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner un stade</option>
                  {stadiums.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Date & Heure *</label>
                <input 
                  type="datetime-local" 
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Prix des Billets (MAD) *</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block text-center">VIP</label>
                    <input 
                      type="number" 
                      required min="0" placeholder="0"
                      value={formData.priceVip}
                      onChange={(e) => setFormData({...formData, priceVip: e.target.value})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none text-center focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block text-center">TRIBUNE</label>
                    <input 
                      type="number" 
                      required min="0" placeholder="0"
                      value={formData.priceTribune}
                      onChange={(e) => setFormData({...formData, priceTribune: e.target.value})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none text-center focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block text-center">POPULAIRE</label>
                    <input 
                      type="number" 
                      required min="0" placeholder="0"
                      value={formData.pricePopulaire}
                      onChange={(e) => setFormData({...formData, pricePopulaire: e.target.value})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none text-center focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Statut *</label>
                <select 
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED"})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="SCHEDULED">À venir (SCHEDULED)</option>
                  <option value="LIVE">En direct (LIVE)</option>
                  <option value="FINISHED">Terminé (FINISHED)</option>
                  <option value="CANCELLED">Annulé (CANCELLED)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,166,81,0.5)] disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : "Programmer le match"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="glass-strong p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Date & Heure</TableHead>
              <TableHead>Match</TableHead>
              <TableHead>Stade</TableHead>
              <TableHead>Prix (V/T/P)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun match trouvé
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match) => {
                const date = new Date(match.match_date);
                const basePrice = parseFloat(match.ticket_base_price);

                return (
                  <TableRow key={match.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-sm font-semibold">
                          <Calendar className="w-3 h-3 text-primary" />
                          {date.toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {date.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-heading font-bold text-sm">
                      {match.home_team_short} vs {match.away_team_short}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{match.stadium_name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {basePrice * 3}/{basePrice * 1.5}/{basePrice}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                        match.status === "SCHEDULED" ? "bg-primary/10 text-primary" :
                        match.status === "LIVE" ? "bg-red-500/10 text-red-500 animate-pulse" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {match.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(match.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

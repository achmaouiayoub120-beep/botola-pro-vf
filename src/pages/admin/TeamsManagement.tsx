import { useState, useEffect } from "react";
import api from "@/services/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ApiTeam {
  id: number;
  name: string;
  short_name: string;
  city: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  stadium_id: number;
}

interface ApiStadium {
  id: number;
  name: string;
  city: string;
}

export default function TeamsManagement() {
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [stadiums, setStadiums] = useState<ApiStadium[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, stadiumsRes] = await Promise.all([
        api.get('/teams'),
        api.get('/stadiums')
      ]);
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
    name: "",
    shortName: "",
    city: "",
    colors: "#000000,#FFFFFF",
    stadiumId: "",
    logo: ""
  });

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.shortName || !formData.city || !formData.stadiumId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const colorsArr = formData.colors.split(',');
    const primaryColor = colorsArr[0] || "#000000";
    const secondaryColor = colorsArr[1] || "#FFFFFF";

    setIsSubmitting(true);
    try {
      await api.post('/teams', {
        name: formData.name,
        shortName: formData.shortName.toUpperCase(),
        city: formData.city,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        logoUrl: formData.logo,
        stadiumId: Number(formData.stadiumId)
      });

      toast.success("Équipe ajoutée avec succès !");
      setIsDialogOpen(false);
      fetchData();
      
      // Reset form
      setFormData({
        name: "",
        shortName: "",
        city: "",
        colors: "#000000,#FFFFFF",
        stadiumId: "",
        logo: ""
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la création de l'équipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe ?")) {
      try {
        await api.delete(`/teams/${id}`);
        toast.success("Équipe supprimée !");
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
          <h1 className="text-display text-4xl text-foreground">GESTION DES ÉQUIPES</h1>
          <p className="text-muted-foreground font-heading">Gérez les {teams.length} clubs de la Botola Pro.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="btn-neon flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Ajouter une équipe
            </button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-border/50 text-foreground max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Ajouter une Équipe</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Nom Complet *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Raja Club Athletic"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Sigle (Court) *</label>
                  <input 
                    type="text" 
                    required
                    maxLength={5}
                    value={formData.shortName}
                    onChange={(e) => setFormData({...formData, shortName: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary uppercase"
                    placeholder="Ex: RCA"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Ville *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: Casablanca"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Stade Principal *</label>
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">URL du Logo (Optionnel)</label>
                <input 
                  type="url" 
                  value={formData.logo}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Couleurs (Hex 1, Hex 2)</label>
                <input 
                  type="text" 
                  required
                  value={formData.colors}
                  onChange={(e) => setFormData({...formData, colors: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="#00A651,#FFFFFF"
                />
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
                  {isSubmitting ? "Ajout..." : "Ajouter l'équipe"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="glass-strong p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher une équipe ou une ville..." 
            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>Nom du Club</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Couleurs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Chargement des équipes...
                </TableCell>
              </TableRow>
            ) : filteredTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucune équipe trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredTeams.map((team) => (
                <TableRow key={team.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                      {team.logo_url ? (
                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">{team.short_name}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-heading font-semibold text-foreground">{team.name}</TableCell>
                  <TableCell className="text-muted-foreground">{team.city}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full border border-border shadow-sm" style={{ background: team.primary_color }} />
                      <div className="w-4 h-4 rounded-full border border-border shadow-sm" style={{ background: team.secondary_color }} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(team.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

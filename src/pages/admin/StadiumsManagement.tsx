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
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ApiStadium {
  id: number;
  name: string;
  city: string;
  capacity: number;
  image_url: string;
  location_url: string;
}

export default function StadiumsManagement() {
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
      const res = await api.get('/stadiums');
      setStadiums(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des stades");
    } finally {
      setLoading(false);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    capacity: "",
    image: "",
    description: "",
    location: ""
  });

  const filteredStadiums = stadiums.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.city || !formData.capacity || !formData.image || !formData.description || !formData.location) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/stadiums', {
        name: formData.name,
        city: formData.city,
        capacity: Number(formData.capacity),
        imageUrl: formData.image,
        description: formData.description,
        locationUrl: formData.location
      });

      toast.success("Stade ajouté avec succès !");
      setIsDialogOpen(false);
      fetchData();
      
      // Reset form
      setFormData({
        name: "",
        city: "",
        capacity: "",
        image: "",
        description: "",
        location: ""
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la création du stade");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stade ?")) {
      try {
        await api.delete(`/stadiums/${id}`);
        toast.success("Stade supprimé !");
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
          <h1 className="text-display text-4xl text-foreground">GESTION DES STADES</h1>
          <p className="text-muted-foreground font-heading">Gérez les {stadiums.length} infrastructures sportives.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="btn-neon flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Ajouter un stade
            </button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-border/50 text-foreground max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Ajouter un Stade</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Nom du Stade *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Grand Stade de Tanger"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Ville *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: Tanger"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Capacité *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: 65000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Description *</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Brève description du stade..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">URL de l'image *</label>
                <input 
                  type="url" 
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Embed Google Maps (src URL) *</label>
                <input 
                  type="url" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://www.google.com/maps/embed?..."
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
                  {isSubmitting ? "Ajout..." : "Ajouter le stade"}
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
            placeholder="Rechercher un stade ou une ville..." 
            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Nom du Stade</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Chargement des stades...
                </TableCell>
              </TableRow>
            ) : filteredStadiums.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Aucun stade trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredStadiums.map((stadium) => (
                <TableRow key={stadium.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                  <TableCell className="font-heading font-semibold text-foreground flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    {stadium.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{stadium.city}</TableCell>
                  <TableCell className="font-mono text-sm">{stadium.capacity.toLocaleString()} places</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(stadium.id)}
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

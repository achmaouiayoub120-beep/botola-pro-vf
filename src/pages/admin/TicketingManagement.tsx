import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Download, QrCode, CheckCircle2 } from "lucide-react";

interface ApiReservation {
  id: number;
  booking_reference: string;
  user_id: number;
  full_name: string;
  match_id: number;
  match_teams: string;
  zone: string;
  amount: string;
  status: "CONFIRMED" | "USED" | "CANCELLED" | "PENDING";
  created_at: string;
}

export default function TicketingManagement() {
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets'); // admin gets all
      setReservations(res.data.data || res.data); // depending on mapping
    } catch (error) {
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const handleValidater = async (id: number) => {
      // In a real system, would trigger payment validation or mark as paid
      toast.info("Fonctionnalité de validation manuelle en cours de développement");
  };
  
  const handleScanner = async (id: number) => {
    try {
      await api.patch(`/tickets/${id}/use`);
      toast.success("Billet scanné / utilisé avec succès");
      fetchTickets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors du scan");
    }
  };

  const filtered = reservations.filter(r => 
    r.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.match_teams?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-display text-4xl text-foreground">BILLETTERIE & RÉSERVATIONS</h1>
          <p className="text-muted-foreground font-heading">Suivi des ventes et validation des billets.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline-neon flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Exporter rapport
          </button>
          <button className="btn-neon flex items-center gap-2 text-sm">
            <QrCode className="w-4 h-4" /> Scanner Billet
          </button>
        </div>
      </header>

      <div className="glass-strong p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher par ID, utilisateur ou match..." 
            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>ID Billet</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Match / Zone</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Chargement des réservations...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucune réservation trouvée
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((res) => (
                <TableRow key={res.id} className="border-border/50 text-sm">
                  <TableCell className="font-mono font-bold text-primary">{res.booking_reference}</TableCell>
                  <TableCell className="font-heading">{res.full_name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">{res.match_teams}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{res.zone} (x1)</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-bold">{res.amount} MAD</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      res.status === "CONFIRMED" ? "bg-primary/10 text-primary" :
                      res.status === "USED" ? "bg-primary/10 text-primary" :
                      res.status === "PENDING" ? "bg-gold/10 text-gold" :
                      "bg-destructive/10 text-destructive"
                    )}>
                      {res.status === "CONFIRMED" ? "Confirmé" : res.status === "USED" ? "Utilisé" : res.status === "PENDING" ? "En attente" : "Annulé"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {res.status === "PENDING" && (
                        <button 
                          onClick={() => handleValidater(res.id)}
                          title="Valider" 
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {(res.status === "CONFIRMED") && (
                        <button 
                          onClick={() => handleScanner(res.id)}
                          title="Scanner à la porte" 
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

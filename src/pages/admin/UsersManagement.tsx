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
import { Search, Shield, UserX, UserCheck, History } from "lucide-react";

interface ApiUser {
  id: number;
  full_name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "BLOCKED";
  created_at: string;
  lastReservation?: string; // Optional if we fetch it later
}

export default function UsersManagement() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await api.patch(`/users/${id}/toggle`);
      toast.success("Statut mis à jour !");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur de mise à jour");
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display text-4xl text-foreground">GESTION DES UTILISATEURS</h1>
        <p className="text-muted-foreground font-heading">Gérez les comptes et les permissions.</p>
      </header>

      <div className="glass-strong p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur (nom, email)..." 
            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière Réservation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Chargement des utilisateurs...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-border/50 text-sm">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-foreground">{user.full_name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                <TableCell>
                  <span className={cn(
                    "flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    user.role === "ADMIN" ? "bg-gold/10 text-gold" : "bg-muted text-muted-foreground"
                  )}>
                    {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    user.status === "ACTIVE" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  )}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.lastReservation || "Aucune"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button title="Historique" className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                      <History className="w-4 h-4" />
                    </button>
                    {user.status === "ACTIVE" ? (
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        title="Bloquer" 
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        title="Débloquer" 
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

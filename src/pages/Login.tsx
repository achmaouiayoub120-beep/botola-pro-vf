import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Shield, User } from "lucide-react";
import botolaLogo from "@/assets/botola-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { toast } from "sonner";

type LoginMode = "user" | "admin";

export default function Login() {
  const [mode, setMode] = useState<LoginMode>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      // Verification of role matching selected mode
      if (mode === 'admin' && user.role !== 'admin') {
        toast.error("Cet email n'a pas de droits administrateur.");
        setLoading(false);
        return;
      }
      if (mode === 'user' && user.role === 'admin') {
         // Admin can still login from user panel, but let's redirect them to admin
         toast.success("Bienvenue Administrateur !");
      } else {
         toast.success(`Bienvenue ${user.full_name} !`);
      }

      login(token, user);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={botolaLogo} alt="Botola Pro" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="font-display text-3xl text-foreground tracking-wide">
            BOTOLA <span className="text-primary">TICKET</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-heading">
            Connectez-vous a votre espace
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-xl bg-muted p-1 mb-6">
          <button
            onClick={() => setMode("user")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-heading font-semibold transition-all duration-300 ${
              mode === "user"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4" />
            Utilisateur
          </button>
          <button
            onClick={() => setMode("admin")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-heading font-semibold transition-all duration-300 ${
              mode === "admin"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="w-4 h-4" />
            Administrateur
          </button>
        </div>

        {/* Form */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: mode === "admin" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="glass p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === "admin" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
            }`}>
              {mode === "admin" ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-heading font-bold text-foreground text-lg">
                {mode === "admin" ? "Espace Admin" : "Espace Utilisateur"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {mode === "admin" ? "Gerez la plateforme Botola Ticket" : "Accedez a vos billets et reservations"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-heading">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-muted rounded-lg pl-10 pr-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder={mode === "admin" ? "admin@botola.ma" : "email@exemple.com"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-heading">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted rounded-lg pl-10 pr-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Votre mot de passe"
                  required
                />
              </div>
            </div>

            {mode === "user" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border accent-primary" />
                  Se souvenir de moi
                </label>
                <button type="button" className="text-primary hover:underline font-medium">
                  Mot de passe oublie ?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-60 ${
                mode === "admin"
                  ? "bg-accent text-accent-foreground hover:opacity-90"
                  : "btn-neon"
              }`}
              style={mode === "admin" ? { boxShadow: "0 4px 16px hsl(348 85% 55% / 0.25)" } : undefined}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {mode === "user" && (
            <p className="text-center text-xs text-muted-foreground mt-6">
              Pas encore de compte ?{" "}
              <button onClick={() => navigate("/register")} type="button" className="text-primary font-semibold hover:underline">
                Creer un compte
              </button>
            </p>
          )}

          {mode === "admin" && (
            <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/10">
              <p className="text-[11px] text-muted-foreground text-center">
                Acces reserve aux administrateurs autorises de la plateforme Botola Ticket.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

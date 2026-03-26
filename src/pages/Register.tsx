import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, Phone, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import botolaLogo from "@/assets/botola-logo.png";
import api from "@/services/api";
import { toast } from "sonner";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/register', {
                full_name: `${firstName} ${lastName}`.trim(),
                email,
                phone,
                password
            });
            toast.success("Compte créé avec succès ! Vous pouvez vous connecter.");
            navigate("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-hero px-4 py-8">
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
                        Créez votre compte supporter
                    </p>
                </div>

                {/* Form */}
                <div className="glass-premium p-6" style={{ boxShadow: "var(--shadow-elevated)" }}>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-heading font-bold text-foreground text-lg">Inscription</h2>
                            <p className="text-xs text-muted-foreground">Rejoignez la communauté Botola Ticket</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block font-heading">Prénom</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="Ahmed"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block font-heading">Nom</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-muted rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Karim"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block font-heading">Adresse email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="email@exemple.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block font-heading">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="+212 6XX XXX XXX"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block font-heading">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-muted rounded-lg pl-10 pr-10 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Min. 8 caractères"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block font-heading">Confirmer le mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Confirmez le mot de passe"
                                    required
                                />
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-accent mt-1">Les mots de passe ne correspondent pas</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-neon py-3 disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                    Création du compte...
                                </span>
                            ) : (
                                "Créer mon compte"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground mt-6">
                        Déjà un compte ?{" "}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

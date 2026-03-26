import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import botolaLogo from "@/assets/botola-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  { label: "Accueil", path: "/" },
  { label: "Matchs", path: "/matches" },
  { label: "Stades", path: "/stadiums" },
  { label: "Classement", path: "/classement" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      style={{ borderBottom: "1px solid hsl(152 100% 50% / 0.08)" }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={botolaLogo} alt="Botola Pro" className="h-10 w-auto" />
          <span className="font-display text-2xl tracking-wide text-foreground">
            BOTOLA <span className="text-primary">TICKET</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <UserIcon className="w-4 h-4" />
                </div>
                {user.full_name}
              </button>
              
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-lg border border-border py-2 flex flex-col z-50 overflow-hidden"
                  >
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-primary transition-colors"
                      >
                        <Shield className="w-4 h-4" /> Admin
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-primary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Mon espace
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Connexion
            </Link>
          )}

          <Link to="/matches" className="btn-neon text-xs py-2 px-5">
            Acheter un Billet
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-strong border-t border-border"
        >
          <div className="flex flex-col gap-4 p-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium ${location.pathname === link.path ? "text-primary" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <>
                <div className="h-px bg-border my-2 px-4 hidden" />
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-muted-foreground flex justify-between"
                  >
                    Administration <Shield className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground flex justify-between"
                >
                  Mon Espace <LayoutDashboard className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-destructive text-left flex justify-between"
                >
                  Déconnexion <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-muted-foreground flex justify-between"
              >
                Connexion <UserIcon className="w-4 h-4" />
              </Link>
            )}

            <Link
              to="/matches"
              onClick={() => setMobileOpen(false)}
              className="btn-neon text-xs py-2 px-5 text-center mt-2"
            >
              Acheter un Billet
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

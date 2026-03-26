import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Reservation from "./pages/Reservation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import Stadiums from "./pages/Stadiums";
import StadiumDetails from "./pages/StadiumDetails";

// Admin Imports
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import TeamsManagement from "./pages/admin/TeamsManagement";
import StadiumsManagement from "./pages/admin/StadiumsManagement";
import MatchesManagement from "./pages/admin/MatchesManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import TicketingManagement from "./pages/admin/TicketingManagement";
import Analytics from "./pages/admin/Analytics";

const queryClient = new QueryClient();

// Composant pour protéger les routes
function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-primary">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function Layout() {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/reservation/:matchId" element={<Reservation />} />
        <Route path="/stadiums" element={<Stadiums />} />
        <Route path="/stadiums/:id" element={<StadiumDetails />} />
        <Route path="/classement" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'agent']} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="teams" element={<TeamsManagement />} />
            <Route path="stadiums" element={<StadiumsManagement />} />
            <Route path="matches" element={<MatchesManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="ticketing" element={<TicketingManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


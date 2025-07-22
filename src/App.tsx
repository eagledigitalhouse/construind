import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Páginas públicas
import Index from "./pages/Index";
import PatrocinioPage from "./pages/PatrocinioPage";
import ExpositorPage from "./pages/ExpositorPage";
import ExpositoresPage from "./pages/ExpositoresPage";
import FormularioPreInscricaoExpositores from "./pages/FormularioPreInscricaoExpositores";
import ConfirmacaoPreInscricao from "./pages/ConfirmacaoPreInscricao";
import NotFound from "./pages/NotFound";

// Páginas administrativas
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPatrocinadores from "./pages/admin/AdminPatrocinadores";
import AdminExpositores from "./pages/admin/AdminExpositores";
import AdminPreInscricaoExpositores from "./pages/admin/AdminPreInscricaoExpositores";
import AdminStands from "./pages/admin/AdminStands";
import AdminNewsletter from "./pages/admin/AdminNewsletter";

// Importar a página de teste


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/patrocinio" element={<PatrocinioPage />} />
            <Route path="/expositor" element={<ExpositorPage />} />
            <Route path="/expositores" element={<ExpositoresPage />} />
            <Route path="/pre-inscricao-expositores" element={<FormularioPreInscricaoExpositores />} />
            <Route path="/confirmacao-pre-inscricao" element={<ConfirmacaoPreInscricao />} />
            
            
            {/* Rota de Login Administrativo */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Rotas Administrativas Protegidas */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/patrocinadores" element={
              <ProtectedRoute>
                <AdminPatrocinadores />
              </ProtectedRoute>
            } />
            <Route path="/admin/expositores" element={
              <ProtectedRoute>
                <AdminExpositores />
              </ProtectedRoute>
            } />
            <Route path="/admin/pre-inscricao-expositores" element={
              <ProtectedRoute>
                <AdminPreInscricaoExpositores />
              </ProtectedRoute>
            } />
            <Route path="/admin/stands" element={
              <ProtectedRoute>
                <AdminStands />
              </ProtectedRoute>
            } />
            <Route path="/admin/newsletter" element={
              <ProtectedRoute>
                <AdminNewsletter />
              </ProtectedRoute>
            } />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

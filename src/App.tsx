import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Páginas públicas
import FormularioPreInscricaoExpositores from "./pages/FormularioPreInscricaoExpositores";
import ConfirmacaoPreInscricao from "./pages/ConfirmacaoPreInscricao";
import NotFound from "./pages/NotFound";

// Páginas administrativas
import AdminLogin from "./pages/admin/AdminLogin";

import AdminDashboard from "./pages/admin/AdminDashboard";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SpeedInsights />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            },
            success: {
              style: {
                border: '1px solid #10b981',
                background: '#f0fdf4'
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff'
              }
            },
            error: {
              style: {
                border: '1px solid #ef4444',
                background: '#fef2f2'
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff'
              }
            }
          }}
        />
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<FormularioPreInscricaoExpositores />} />
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




            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SpeedInsights } from "@vercel/speed-insights/react";

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
import AdminContratos from "./pages/admin/AdminContratos";




import AdminAgenda from "./pages/admin/AdminAgenda";
import Messages from "./pages/Messages";
import TesteToast from "./pages/TesteToast";

// Páginas financeiras
import FinancialCenter from "./pages/financial/index";
import InvoicesPage from "./pages/financial/invoices/index";
import ExpensesPage from "./pages/financial/expenses/index";
import ReportsPage from "./pages/reports/index";



// Importar a página de teste


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
            <Route path="/" element={<Index />} />
            <Route path="/patrocinio" element={<PatrocinioPage />} />
            <Route path="/expositor" element={<ExpositorPage />} />
            <Route path="/expositores" element={<ExpositoresPage />} />
            <Route path="/pre-inscricao-expositores" element={<FormularioPreInscricaoExpositores />} />
            <Route path="/confirmacao-pre-inscricao" element={<ConfirmacaoPreInscricao />} />
            <Route path="/teste-toast" element={<TesteToast />} />
            
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
            <Route path="/admin/contratos" element={
              <ProtectedRoute>
                <AdminContratos />
              </ProtectedRoute>
            } />




            <Route path="/admin/agenda" element={
              <ProtectedRoute>
                <AdminAgenda />
              </ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            
            {/* Rotas Financeiras */}
            <Route path="/financial" element={
              <ProtectedRoute>
                <FinancialCenter />
              </ProtectedRoute>
            } />
            <Route path="/financial/invoices" element={
              <ProtectedRoute>
                <InvoicesPage />
              </ProtectedRoute>
            } />
            <Route path="/financial/expenses" element={
              <ProtectedRoute>
                <ExpensesPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <ReportsPage />
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

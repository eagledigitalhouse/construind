import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PatrocinioPage from "./pages/PatrocinioPage";
import ExpositorPage from "./pages/ExpositorPage";
import AdminPatrocinadores from "./pages/AdminPatrocinadores";
import AdminExpositores from "./pages/AdminExpositores";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import NavbarDemoPage from "./pages/NavbarDemoPage";
import ExpositoresPage from "./pages/ExpositoresPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/patrocinio" element={<PatrocinioPage />} />
          <Route path="/expositor" element={<ExpositorPage />} />
          <Route path="/expositores" element={<ExpositoresPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/patrocinadores" element={<AdminPatrocinadores />} />
        <Route path="/admin/expositores" element={<AdminExpositores />} />
          <Route path="/navbar-demo" element={<NavbarDemoPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

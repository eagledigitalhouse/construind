import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Otimizações para produção
    minify: 'esbuild', // Usar esbuild ao invés de terser para evitar problemas
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para melhor cache
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'animation-vendor': ['framer-motion', 'gsap', 'aos'],
        },
      },
    },
    // Tamanho máximo de chunk warning
    chunkSizeWarningLimit: 1000,
    // Otimizar assets
    assetsInlineLimit: 4096, // 4kb
  },
  // Otimizações de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'sonner',
    ],
  },
}));

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AOS from 'aos';
import 'aos/dist/aos.css';


// Inicialize AOS
AOS.init({
  duration: 800,
  once: false,
  mirror: true,
});



createRoot(document.getElementById("root")!).render(<App />);

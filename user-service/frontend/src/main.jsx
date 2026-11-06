import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { TipProvider } from './components/Tooltip.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TipProvider>
      <App />
    </TipProvider>
  </StrictMode>
);

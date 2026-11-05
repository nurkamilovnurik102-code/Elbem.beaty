import './i18n';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';

// Visual layers: base foundation -> component design system -> ambient atmosphere.
import './styles.css';
import './premium-theme.css';
import './ambient-background.css';
import './release-ui-fixes.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter><App/></BrowserRouter>
  </React.StrictMode>
);

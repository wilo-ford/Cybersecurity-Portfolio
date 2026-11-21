import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './immersive.css';
import './contact.css';
import './experience.css';
const projectId = location.pathname.match(/^\/projets\/([^/]+)\/?$/)?.[1] || null;
const root = document.getElementById('root');
const app = <React.StrictMode><App projectId={projectId} /></React.StrictMode>;
if (root.hasChildNodes()) hydrateRoot(root, app);else createRoot(root).render(app);
import './refinements.css';

import './v2-theme.css';

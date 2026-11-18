import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
export function render(projectId = null) {
  return renderToString(<App projectId={projectId} />);
}

import React from 'react';
import ReactDOM from 'react-dom/client';
// The import of App.tsx is correct without the extension for most bundlers.
// FIX: Added .tsx extension to App import to resolve module resolution error.
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
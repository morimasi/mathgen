
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: The error "File '.../App.tsx' is not a module" was likely because App.tsx contained placeholder text.
// The import itself is correct without the extension for most bundlers.
import App from './App';

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
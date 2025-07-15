import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ListingProvider } from './context/ListingContext';
import { ToastProvider } from './toast/ToastProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <ListingProvider>
          <App />
        </ListingProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
); 
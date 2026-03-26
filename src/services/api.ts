import axios from 'axios';

const api = axios.create({
  // Using the Vite proxy configured in vite.config.ts
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('botola_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs (ex: token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si on reçoit une 401 et qu'on n'est pas déjà sur la page de login
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('botola_token');
        localStorage.removeItem('botola_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

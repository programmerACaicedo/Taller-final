import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Servicios de nodos
export const nodeService = {
  getAll: async () => {
    const response = await api.get('/graph/nodes');
    return response.data;
  },

  create: async (name) => {
    const response = await api.post('/graph/nodes', { name });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/graph/nodes/${id}`);
  },
};

// Servicios de aristas
export const edgeService = {
  getAll: async () => {
    const response = await api.get('/graph/edges');
    return response.data;
  },

  create: async (src_id, dst_id, weight) => {
    const response = await api.post('/graph/edges', { src_id, dst_id, weight });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/graph/edges/${id}`);
  },
};

// Servicios de algoritmos
export const algorithmService = {
  bfs: async (start_id, max_depth) => {
    const response = await api.get(`/graph/bfs?start_id=${start_id}&max_depth=${max_depth}`);
    return response.data;
  },

  dijkstra: async (src_id, dst_id) => {
    const response = await api.get(`/graph/shortest-path?src_id=${src_id}&dst_id=${dst_id}`);
    return response.data;
  },
};

export default api;
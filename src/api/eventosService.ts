import axios from 'axios';
import type { Clubes } from '../types';

const API_URL = import.meta.env.VITE_API_EVENTOS_URL;

// Create an axios instance
const axiosAuth = axios.create();

// Add a request interceptor to include the token
axiosAuth.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export interface Evento {
  id: number;
  nombre: string;
  tipo: 'LLAVES' | 'PUNTOS' | 'MIXTO';
  ordenEncuentros: 'AZAR' | 'MANUAL';
  fases: number;
  clubes?: Clubes[];
  equipos?: any[]; // Define Equipo type if available
}

export const getEventos = async (): Promise<Evento[]> => {
  try {
    const response = await axiosAuth.get(API_URL);
    let data = response.data;

    // If the response is a string, parse it as JSON
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse API response string as JSON:', e);
        return []; // Return empty if JSON parsing fails
      }
    }

    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.content)) {
      return data.content;
    }

    console.warn('getEventos API response is not in a recognized format, returning empty array.', data);
    return [];
  } catch (error) {
    console.error('Failed to fetch eventos:', error);
    return []; // Return empty array on error to prevent crashes
  }
};

export const getEventoById = async (id: number): Promise<Evento> => {
  const response = await axiosAuth.get(`${API_URL}/${id}`);
  return response.data;
};

export const crearEvento = async (evento: Omit<Evento, 'id'>): Promise<Evento> => {
  const response = await axiosAuth.post(API_URL, evento);
  return response.data;
};

export const updateEvento = async (id: number, evento: Partial<Evento>): Promise<Evento> => {
  const response = await axiosAuth.put(`${API_URL}/${id}`, evento);
  return response.data;
};

export const deleteEvento = async (id: number): Promise<void> => {
  await axiosAuth.delete(`${API_URL}/${id}`);
};

export const addClubToEvento = async (eventoId: number, clubId: number): Promise<void> => {
  await axiosAuth.post(`${API_URL}/${eventoId}/clubes/${clubId}`);
};

export const removeClubFromEvento = async (eventoId: number, clubId: number): Promise<void> => {
  await axiosAuth.delete(`${API_URL}/${eventoId}/clubes/${clubId}`);
};

export const addEquipoToEvento = async (eventoId: number, equipoId: number): Promise<void> => {
  await axiosAuth.post(`${API_URL}/${eventoId}/equipos/${equipoId}`, {});
};

export const removeEquipoFromEvento = async (eventoId: number, equipoId: number): Promise<void> => {
  await axiosAuth.delete(`${API_URL}/${eventoId}/equipos/${equipoId}`);
};

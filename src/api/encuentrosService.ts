
import axios from 'axios';
import type { Clubes, Equipos } from '../types/index';

const API_URL = import.meta.env.VITE_API_ENCUENTROS_URL;

const axiosAuth = axios.create();

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

export interface Encuentro {
  id: number;
  clubLocal: Clubes;
  clubVisitante: Clubes;
  fecha: string; // ISO string
  fase: number;
  resultado: string;
  evento: { id: number };
  estado: 'DISPUTADO' | 'POR_DISPUTAR';
}

// Payload for creating a new encounter
export type CreateEncuentroPayload = {
  evento: { id: number };
  clubLocal: { cod: number };
  clubVisitante: { cod: number };
  fecha: string;
  fase: number;
  resultado: string;
};

// Payload for updating an existing encounter
export type UpdateEncuentroPayload = Partial<Encuentro>;


export const getEncuentros = async (eventoId?: number): Promise<Encuentro[]> => {
  let url = API_URL;
  if (eventoId) {
    url = `${url}?evento_id=${eventoId}`;
  }
  const response = await axiosAuth.get(url);
  return response.data;
};

export const getEncuentroById = async (id: number): Promise<Encuentro> => {
  const response = await axiosAuth.get(`${API_URL}/${id}`);
  return response.data;
};

export const createEncuentro = async (encuentro: CreateEncuentroPayload): Promise<Encuentro> => {
  const response = await axiosAuth.post(API_URL, encuentro);
  return response.data;
};

export const updateEncuentro = async (id: number, encuentro: UpdateEncuentroPayload): Promise<Encuentro> => {
    const response = await axiosAuth.put(`${API_URL}/${id}`, encuentro);
    return response.data;
};

export const deleteEncuentro = async (id: number): Promise<void> => {
  await axiosAuth.delete(`${API_URL}/${id}`);
};

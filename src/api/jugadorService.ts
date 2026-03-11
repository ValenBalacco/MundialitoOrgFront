import axios from 'axios';
import type { Jugador } from '../types/index';

const API_URL = import.meta.env.VITE_API_JUGADORES_URL;

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

export async function getJugadores(): Promise<Jugador[]> {
    const response = await axiosAuth.get(API_URL);
    return response.data;
}

export async function getJugadorById(id: number): Promise<Jugador | null> {
    const response = await axiosAuth.get(`${API_URL}/${id}`);
    return response.data;
}

export async function createJugador(jugador: Omit<Jugador, 'cod'>): Promise<Jugador> {
    const response = await axiosAuth.post(API_URL, jugador);
    return response.data;
}

export async function updateJugador(id: number, jugador: Jugador): Promise<Jugador> {
    const response = await axiosAuth.put(`${API_URL}/${id}`, jugador);
    return response.data;
}

export async function deleteJugador(id: number): Promise<Jugador> {
    // Cambia el jugador a inactivo en vez de eliminarlo físicamente
    const response = await axiosAuth.put(`${API_URL}/${id}`, { activo: false });
    return response.data;
}

export async function setJugadorActivo(id: number, activo: boolean): Promise<Jugador | null> {
    const response = await axiosAuth.put(`${API_URL}/${id}/activo?activo=${activo}`, {});
    return response.data;
}

export async function getJugadoresByClub(clubId: number): Promise<Jugador[]> {
    const response = await axiosAuth.get(`${API_URL}?clubId=${clubId}`);
    return response.data;
}

export const getJugadoresInactivos = async (clubId?: number): Promise<Jugador[]> => {
  let url = `${API_URL}/inactivos`;
  if (clubId) {
    url += `?clubId=${clubId}`;
  }
  const response = await axiosAuth.get(url);
  return response.data;
};
import axios from 'axios';
import type { Equipos, EquiposDto, Jugador, Staff } from '../types/index';

const API_URL = import.meta.env.VITE_API_EQUIPOS_URL;

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

export async function getEquipos(): Promise<Equipos[]> {
    const response = await axiosAuth.get(API_URL);
    return response.data;
}

export async function getEquipoById(id: number): Promise<Equipos | null> {
    const response = await axiosAuth.get(`${API_URL}/${id}`);
    return response.data;
}

export async function createEquipo(equipo: any): Promise<Equipos> {
    const response = await axiosAuth.post(API_URL, equipo);
    return response.data;
}

export async function updateEquipo(id: number, equipo: EquiposDto): Promise<Equipos> {
    const response = await axiosAuth.put(`${API_URL}/${id}`, equipo);
    return response.data;
}

export async function deleteEquipo(id: number): Promise<void> {
    await axiosAuth.delete(`${API_URL}/${id}`);
}

export async function setEquipoActivo(id: number, activo: boolean): Promise<Equipos | null> {
    const response = await axiosAuth.put(`${API_URL}/${id}/activo?activo=${activo}`);
    return response.data;
}

export async function getEquiposByClub(clubId: number): Promise<Equipos[]> {
    const response = await axiosAuth.get(`${API_URL}/club/${clubId}`);
    return response.data;
}

export async function addJugadoresToEquipo(equipoId: number, jugadorIds: number[]): Promise<Jugador[]> {
    const response = await axiosAuth.post(`${API_URL}/${equipoId}/jugadores`, jugadorIds);
    return response.data;
}

export async function removeJugadoresFromEquipo(equipoId: number, jugadorIds: number[]): Promise<Jugador[]> {
    const response = await axiosAuth.delete(`${API_URL}/${equipoId}/jugadores`, { data: jugadorIds });
    return response.data;
}

export async function addStaffToEquipo(equipoId: number, staffIds: number[]): Promise<Staff[]> {
    const response = await axiosAuth.post(`${API_URL}/${equipoId}/staff`, staffIds);
    return response.data;
}

export async function removeStaffFromEquipo(equipoId: number, staffIds: number[]): Promise<Staff[]> {
    const response = await axiosAuth.delete(`${API_URL}/${equipoId}/staff`, { data: staffIds });
    return response.data;
}
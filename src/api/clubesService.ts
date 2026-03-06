import axios from 'axios';
import type { Clubes } from '../types/index';

const API_URL = import.meta.env.VITE_API_CLUBES_URL;

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


export async function getClubes(): Promise<Clubes[]> {
    const response = await axiosAuth.get(API_URL);
    return response.data;
}

export async function getClubById(id: number): Promise<Clubes | null> {
    const response = await axiosAuth.get(`${API_URL}/${id}`);
    return response.data;
}

export async function createClub(club: Omit<Clubes, 'cod'>): Promise<Clubes> {
    const response = await axiosAuth.post(API_URL, club);
    return response.data;
}

export async function updateClub(id: number, club: Clubes): Promise<Clubes> {
    const response = await axiosAuth.put(`${API_URL}/${id}`, club);
    return response.data;
}

export async function deleteClub(id: number): Promise<void> {
    await axiosAuth.delete(`${API_URL}/${id}`);
}

export async function setClubActivo(id: number, activo: boolean): Promise<Clubes | null> {
    const response = await axiosAuth.put(`${API_URL}/${id}/activo?activo=${activo}`);
    return response.data;
}
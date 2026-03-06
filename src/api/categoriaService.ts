import axios from 'axios';
import type { Categoria } from '../types/index';

const API_URL = import.meta.env.VITE_API_CATEGORIAS_URL;

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

export async function getCategorias(): Promise<Categoria[]> {
    const response = await axiosAuth.get(API_URL);
    return response.data;
}

export async function getCategoria(id: number): Promise<Categoria | null> {
    const response = await axiosAuth.get(`${API_URL}/${id}`);
    return response.data;
}

export async function createCategoria(categoria: Omit<Categoria, 'cod'>): Promise<Categoria> {
    const response = await axiosAuth.post(API_URL, categoria);
    return response.data;
}

export async function updateCategoria(id: number, categoria: Categoria): Promise<Categoria> {
    const response = await axiosAuth.put(`${API_URL}/${id}`, categoria);
    return response.data;
}

export async function deleteCategoria(id: number): Promise<void> {
    await axiosAuth.delete(`${API_URL}/${id}`);
}

export async function setCategoriaActivo(id: number, activo: boolean): Promise<Categoria | null> {
    const response = await axiosAuth.put(`${API_URL}/${id}/activo?activo=${activo}`);
    return response.data;
}

export async function getCategoriasByClub(clubId: number): Promise<Categoria[]> {
    const response = await axiosAuth.get(`${API_URL}/club/${clubId}`);
    return response.data;
}
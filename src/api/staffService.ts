import axios from 'axios';
import type { Staff } from '../types/index';

const API_URL = import.meta.env.VITE_API_STAFF_URL;

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

export async function getStaff(): Promise<Staff[]> {
    const response = await axiosAuth.get(API_URL);
    return response.data;
}

export async function getStaffById(id: number): Promise<Staff | null> {
    const response = await axiosAuth.get(`${API_URL}/${id}`);
    return response.data;
}

export async function createStaff(staff: Omit<Staff, 'cod'>): Promise<Staff> {
    const response = await axiosAuth.post(API_URL, staff);
    return response.data;
}

export async function updateStaff(id: number, staff: Staff): Promise<Staff> {
    const response = await axiosAuth.put(`${API_URL}/${id}`, staff);
    return response.data;
}

export async function deleteStaff(id: number): Promise<void> {
    await axiosAuth.delete(`${API_URL}/${id}`);
}

export async function setStaffActivo(id: number, activo: boolean): Promise<Staff | null> {
    const response = await axiosAuth.put(`${API_URL}/${id}/activo?activo=${activo}`);
    return response.data;
}

export async function getStaffByClub(clubId: number): Promise<Staff[]> {
    const response = await axiosAuth.get(`${API_URL}?clubId=${clubId}`);
    return response.data;
}
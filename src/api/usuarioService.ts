import type { Usuario } from '../types/index';

const API_URL = import.meta.env.VITE_API_USUARIOS_URL;

export async function getUsuarioByUsername(username: string): Promise<Usuario | null> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${username}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) return null;
    return await res.json();
}

export async function login(username: string, password: string): Promise<string> {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error al iniciar sesión' }));
        throw new Error(errorData.message || 'Error al iniciar sesión');
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    if (data.club && data.club.cod) {
        localStorage.setItem('clubId', data.club.cod.toString());
    }
    return data.token;
}

export async function crearUsuario(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const res = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    });
    if (!res.ok) throw new Error('Error al crear usuario');
    return await res.json();
}

export async function getUsuarios(): Promise<Usuario[]> {
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return await res.json();
}

// Actualizar usuario completo
export async function updateUsuario(id: number, usuario: Usuario): Promise<Usuario> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuario),
    });
    if (!res.ok) throw new Error('Error al actualizar usuario');
    return await res.json();
}

// Eliminar usuario (marcar como inactivo)
export async function eliminarUsuario(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error('Error al eliminar usuario');
}

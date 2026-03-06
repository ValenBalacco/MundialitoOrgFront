export interface Usuario {
    id: number;
    username: string;
    password: string;
    rol: 'ADMIN' | 'CLUB';
    activo: boolean;
    club?: Clubes;
}

export interface Clubes {
    cod: number;
    nombre: string;
    pais: string;
    localidad: string;
    responsable: string;
    telefonoClub: string;
    faxClub: string;
    telefonoResponsable: string;
    email: string;
    idiomaContacto: string;
    activo: boolean;
    equipos?: Equipos[];
    staff?: Staff[];
}

export interface Equipos {
    cod: number;
    nombreEquipo: string;
    corto: string;
    grupo: string;
    nJugadores: number;      // Cambiado a number
    nStaff: number;          // Cambiado a number
    nAcompanantes: number;   // Cambiado a number
    fotoEquipo: string;
    fotoEquipacion1: string;
    fotoEquipacion2: string;
    activo: boolean;
    club?: Clubes;
    categoria?: Categoria;
    jugadores?: Jugador[];
    staff?: Staff[];
}

export interface Jugador {
    cod: number;
    nombre: string;
    apellido: string;
    fechaNacimiento: string; // ISO string
    numeroDocumento: string;
    numeroCamiseta: number;
    demarcacion: string;
    goles: number;
    amarilla: number;
    tarjetaRoja: number;
    foto: string;
    activo: boolean;
    equipo?: Equipos;
    categoria?: Categoria;
}

export interface Staff {
    cod: number;
    nombre: string;
    apellido: string;
    cargo: string;
    foto: string;
    activo: boolean;
    club?: Clubes;
    equipo?: Equipos;
    categoria?: Categoria;
}

export interface Categoria {
    cod: number;
    nombre: string;
    categoria2?: string;
    color: string;
    descripcionCorta: string;
    activo: boolean;
    club?: Clubes;
}

export interface EquiposDto {
    nombreEquipo: string;
    corto: string;
    grupo: string;
    nJugadores: number;
    nStaff: number;
    nAcompanantes: number;
    fotoEquipo: string;
    fotoEquipacion1: string;
    fotoEquipacion2: string;
    activo: boolean;
    categoria?: { cod: number } | null;
    club?: { cod: number } | null;
    jugadoresIds: number[];
    staffIds: number[];
}
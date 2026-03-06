import { useState } from 'react';
import { login, getUsuarioByUsername } from '../../../api/usuarioService';
import styles from './LoginScreen.module.css';
import Swal from 'sweetalert2';
import { MdPerson, MdLock } from 'react-icons/md';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = await login(username, password);
            if (token === 'Credenciales inválidas') {
                MySwal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: 'Usuario o contraseña incorrectos',
                    confirmButtonColor: '#1976d2',
                    background: '#e3f2fd',
                });
            } else {
                localStorage.setItem('token', token);
                const usuario = await getUsuarioByUsername(username);
                localStorage.setItem('username', username);
                if (usuario?.club?.nombre) {
                    localStorage.setItem('club', usuario.club.nombre);
                    localStorage.setItem('clubId', usuario.club.cod.toString());
                } else {
                    localStorage.removeItem('club');
                    localStorage.removeItem('clubId');
                }
                if (usuario?.rol === 'ADMIN') {
                    window.location.href = '/admin';
                } else if (usuario?.rol === 'CLUB') {
                    window.location.href = '/club';
                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'Rol desconocido',
                        confirmButtonColor: '#1976d2',
                        background: '#e3f2fd',
                    });
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
            MySwal.fire({
                icon: 'error',
                title: '¡Error!',
                text: errorMessage,
                confirmButtonColor: '#1976d2',
                background: '#e3f2fd',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.loginBox}>
                <div className={styles.imageContainer}>
                    <img src="/assets/login-bg.png" alt="Mundialito" className={styles.image} />
                    <div className={styles.imageOverlay}>
                        <h1 className={styles.welcomeTitle}>Gestor de Clubes</h1>
                        <p className={styles.welcomeText}>Gestión de Torneos</p>
                    </div>
                </div>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <MdPerson className={styles.inputIcon} />
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className={styles.input}
                                placeholder="Usuario"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <MdLock className={styles.inputIcon} />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className={styles.input}
                                placeholder="Contraseña"
                            />
                        </div>
                        <button type="submit" disabled={loading} className={styles.button}>
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
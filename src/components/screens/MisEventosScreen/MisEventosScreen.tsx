import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Evento, getEventos, getEventoById, addEquipoToEvento } from '../../../api/eventosService';
import { Equipos, getEquiposByClub } from '../../../api/equiposService';
import styles from './MisEventosScreen.module.css';
import Swal from 'sweetalert2';
import { MdVisibility } from 'react-icons/md';
import SlideBoard from '../../ui/SlideBoard/SlideBoard';

const MisEventosScreen = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [myEquipos, setMyEquipos] = useState<Equipos[]>([]);
    const navigate = useNavigate();

    const clubId = localStorage.getItem('clubId');
    const clubName = localStorage.getItem('club');

    useEffect(() => {
        const fetchEventosAndEquipos = async () => {
            if (clubId) {
                const allEventos = await getEventos();
                const eventosDelClub: Evento[] = [];

                for (const ev of allEventos) {
                    const fullEvento = await getEventoById(ev.id);
                    if (fullEvento.clubes?.some(c => c.cod === Number(clubId))) {
                        eventosDelClub.push(fullEvento);
                    }
                }
                setEventos(eventosDelClub);

                const equiposData = await getEquiposByClub(Number(clubId));
                setMyEquipos(equiposData);
            }
        };

        fetchEventosAndEquipos();
    }, [clubId]);

    const handleAddEquipoToEvento = async (eventoId: number, equipoId: number) => {
        if (eventoId && equipoId) {
            try {
                await addEquipoToEvento(eventoId, equipoId);
                Swal.fire('Inscrito', 'Equipo inscrito en el evento.', 'success');
                // Refresh data
                const fullEvento = await getEventoById(eventoId);
                setEventos(eventos.map(e => e.id === eventoId ? fullEvento : e));
            } catch (error) {
                console.error("Error adding equipo to evento", error);
                Swal.fire('Error', 'No se pudo inscribir el equipo.', 'error');
            }
        }
    };

    const handleViewDetails = (id: number) => {
        navigate(`/club/eventos/${id}`);
    };

    return (
        <div className={styles.wrapper}>
            <SlideBoard />
            <div className={styles.panelContainer}>
                <h1 className={styles.panelTitle}>Mis Eventos</h1>
                <div className={styles.grid}>
                    {eventos.map(evento => (
                        <div key={evento.id} className={styles.card}>
                            <h2 className={styles.cardTitle}>{evento.nombre}</h2>
                            <div className={styles.inscripcionSection}>
                                <select
                                    className={styles.equipoSelect}
                                    onChange={(e) => {
                                        const equipoId = Number(e.target.value);
                                        if (equipoId) {
                                            handleAddEquipoToEvento(evento.id, equipoId);
                                        }
                                    }}
                                    value=""
                                >
                                    <option value="">Inscribir un equipo</option>
                                    {myEquipos
                                        .filter(eq => !evento.equipos?.some(ee => ee.cod === eq.cod))
                                        .map(equipo => (
                                        <option key={equipo.cod} value={equipo.cod}>
                                            {equipo.nombreEquipo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.equiposInscritos}>
                                <h3>Equipos Inscritos:</h3>
                                <ul>
                                    {evento.equipos?.filter(eq => myEquipos.some(me => me.cod === eq.cod)).map(eq => (
                                        <li key={eq.cod}>{eq.nombreEquipo}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button className={styles.viewBtn} onClick={() => handleViewDetails(evento.id)} title="Ver Detalles">
                                    <MdVisibility size={20} /> Ver
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MisEventosScreen;
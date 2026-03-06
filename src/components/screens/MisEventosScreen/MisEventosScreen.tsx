
import { useEffect, useState } from 'react';
import { Evento, getEventos, getEventoById, addEquipoToEvento } from '../../../api/eventosService';
import { Equipos, getEquiposByClub } from '../../../api/equiposService';
import styles from './MisEventosScreen.module.css';
import Swal from 'sweetalert2';

const MisEventosScreen = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [myEquipos, setMyEquipos] = useState<Equipos[]>([]);
    const [selectedEventoId, setSelectedEventoId] = useState<number | null>(null);
    const [selectedEquipoId, setSelectedEquipoId] = useState<number | ''>('');

    const clubId = localStorage.getItem('clubId');

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

    const handleAddEquipoToEvento = async () => {
        if (selectedEventoId && selectedEquipoId) {
            try {
                await addEquipoToEvento(selectedEventoId, Number(selectedEquipoId));
                Swal.fire('Inscrito', 'Equipo inscrito en el evento.', 'success');
                setSelectedEventoId(null);
                setSelectedEquipoId('');
            } catch (error) {
                console.error("Error adding equipo to evento", error);
                Swal.fire('Error', 'No se pudo inscribir el equipo.', 'error');
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1>Mis Eventos</h1>
            <div className={styles.eventosList}>
                {eventos.map(evento => (
                    <div key={evento.id} className={styles.eventoCard}>
                        <h2>{evento.nombre}</h2>
                        <p>{evento.tipo}</p>
                        <div>
                            <select onChange={(e) => {
                                setSelectedEventoId(evento.id);
                                setSelectedEquipoId(e.target.value);
                            }}>
                                <option value="">Inscribir un equipo</option>
                                {myEquipos
                                    .filter(eq => !evento.equipos?.some(ee => ee.cod === eq.cod))
                                    .map(equipo => (
                                    <option key={equipo.cod} value={equipo.cod}>
                                        {equipo.nombreEquipo}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleAddEquipoToEvento} disabled={!selectedEquipoId || selectedEventoId !== evento.id}>
                                Inscribir
                            </button>
                        </div>
                        <div className={styles.equiposInscritos}>
                            <h3>Equipos Inscritos:</h3>
                            <ul>
                                {evento.equipos?.map(eq => (
                                    <li key={eq.cod}>{eq.nombreEquipo}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MisEventosScreen;

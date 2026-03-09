
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventoById, type Evento } from '../../../api/eventosService';
import { getEncuentros, type Encuentro } from '../../../api/encuentrosService';
import styles from './VerMiEventoScreen.module.css';
import Swal from 'sweetalert2';
import { Clubes } from '../../../types';
import SlideBoard from '../../ui/SlideBoard/SlideBoard';
import { generateBracket, BracketRound } from '../../../utils/bracket';
import Bracket from '../../ui/Bracket/Bracket';

type Tab = 'posiciones' | 'proximos' | 'disputados' | 'todos' | 'llaves';

interface TeamStats {
    pos: number;
    club: Clubes;
    puntos: number;
    jugados: number;
    ganados: number;
    empatados: number;
    perdidos: number;
    golesFavor: number;
    golesContra: number;
}

const VerMiEventoScreen = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [encuentros, setEncuentros] = useState<Encuentro[]>([]);
    const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
    const [bracketData, setBracketData] = useState<BracketRound[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>('proximos');

    const clubId = localStorage.getItem('clubId');

    useEffect(() => {
        const fetchEventData = async () => {
            if (id) {
                try {
                    const eventoData = await getEventoById(Number(id));
                    setEvento(eventoData);
                    if (eventoData.tipo === 'PUNTOS') {
                        setActiveTab('posiciones');
                    } else if (eventoData.tipo === 'LLAVES') {
                        setActiveTab('llaves');
                    }

                    const encuentrosData = await getEncuentros(Number(id));
                    setEncuentros(encuentrosData);
                } catch (error) {
                    console.error("Error fetching event data", error);
                    Swal.fire('Error', 'No se pudieron cargar los datos del evento.', 'error');
                }
            }
        };
        fetchEventData();
    }, [id]);

    useEffect(() => {
        if (evento && encuentros) {
            if (evento.tipo === 'PUNTOS') {
                calculateTeamStats();
            } else if (evento.tipo === 'LLAVES' && evento.clubes) {
                const generatedBracket = generateBracket(evento.clubes, encuentros);
                setBracketData(generatedBracket);
            }
        }
    }, [evento, encuentros]);

    const calculateTeamStats = () => {
        if (!evento?.clubes) return;

        const stats: Map<number, TeamStats> = new Map(evento.clubes.map(club => [
            club.cod,
            { pos: 0, club, puntos: 0, jugados: 0, ganados: 0, empatados: 0, perdidos: 0, golesFavor: 0, golesContra: 0 }
        ]));

        encuentros.forEach(encuentro => {
            if (encuentro.estado === 'DISPUTADO') {
                const [golesLocal, golesVisitante] = encuentro.resultado.split('-').map(Number);
                const localStats = stats.get(encuentro.clubLocal.cod);
                const visitanteStats = stats.get(encuentro.clubVisitante.cod);

                if (localStats && visitanteStats) {
                    localStats.jugados++;
                    visitanteStats.jugados++;
                    localStats.golesFavor += golesLocal;
                    visitanteStats.golesFavor += golesVisitante;
                    localStats.golesContra += golesVisitante;
                    visitanteStats.golesContra += golesLocal;

                    if (golesLocal > golesVisitante) {
                        localStats.puntos += 3;
                        localStats.ganados++;
                        visitanteStats.perdidos++;
                    } else if (golesLocal < golesVisitante) {
                        visitanteStats.puntos += 3;
                        visitanteStats.ganados++;
                        localStats.perdidos++;
                    } else {
                        localStats.puntos += 1;
                        visitanteStats.puntos += 1;
                        localStats.empatados++;
                        visitanteStats.empatados++;
                    }
                }
            }
        });

        const sortedStats = [...stats.values()].sort((a, b) => b.puntos - a.puntos);
        sortedStats.forEach((stat, index) => stat.pos = index + 1);
        setTeamStats(sortedStats);
    };

    const myClubId = Number(clubId);
    const misPartidosPorDisputar = encuentros.filter(e => (e.clubLocal.cod === myClubId || e.clubVisitante.cod === myClubId) && e.estado !== 'DISPUTADO');
    const misPartidosDisputados = encuentros.filter(e => (e.clubLocal.cod === myClubId || e.clubVisitante.cod === myClubId) && e.estado === 'DISPUTADO');

    if (!evento) {
        return <div className={styles.wrapper}>Cargando...</div>;
    }

    return (
        <div className={styles.wrapper}>
            <SlideBoard />
            <div className={styles.panelContainer}>
                <div className={styles.header}>
                    <h1>{evento.nombre}</h1>
                    <div className={styles.tabs}>
                        {evento.tipo === 'PUNTOS' && (
                            <button className={activeTab === 'posiciones' ? styles.activeTab : ''} onClick={() => setActiveTab('posiciones')}>
                                Tabla de Posiciones
                            </button>
                        )}
                        {evento.tipo === 'LLAVES' && (
                            <button className={activeTab === 'llaves' ? styles.activeTab : ''} onClick={() => setActiveTab('llaves')}>
                                Llaves
                            </button>
                        )}
                        <button className={activeTab === 'proximos' ? styles.activeTab : ''} onClick={() => setActiveTab('proximos')}>
                            Mis Próximos Partidos
                        </button>
                        <button className={activeTab === 'disputados' ? styles.activeTab : ''} onClick={() => setActiveTab('disputados')}>
                            Mis Partidos Disputados
                        </button>
                        <button className={activeTab === 'todos' ? styles.activeTab : ''} onClick={() => setActiveTab('todos')}>
                            Todos los Partidos
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {activeTab === 'posiciones' && evento.tipo === 'PUNTOS' && (
                        <div className={styles.section}>
                            <h2>Tabla de Posiciones</h2>
                            <div className={styles.tableWrapper}>
                                <table className={styles.dataTable}>
                                    <thead>
                                        <tr>
                                            <th>Pos</th>
                                            <th>Club</th>
                                            <th>Pts</th>
                                            <th>PJ</th>
                                            <th>PG</th>
                                            <th>PE</th>
                                            <th>PP</th>
                                            <th>GF</th>
                                            <th>GC</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamStats.map(stat => (
                                            <tr key={stat.club.cod}>
                                                <td>{stat.pos}</td>
                                                <td>
                                                    <div className={styles.clubInfo}>
                                                        {stat.club.escudo && <img src={stat.club.escudo} alt={`Escudo de ${stat.club.nombre}`} className={styles.escudoSmall} />}
                                                        {stat.club.nombre}
                                                    </div>
                                                </td>
                                                <td>{stat.puntos}</td>
                                                <td>{stat.jugados}</td>
                                                <td>{stat.ganados}</td>
                                                <td>{stat.empatados}</td>
                                                <td>{stat.perdidos}</td>
                                                <td>{stat.golesFavor}</td>
                                                <td>{stat.golesContra}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'llaves' && evento.tipo === 'LLAVES' && (
                        <div className={styles.section}>
                            <h2>Llaves del Torneo</h2>
                            <Bracket data={bracketData} />
                        </div>
                    )}

                    {activeTab === 'proximos' && (
                        <div className={styles.section}>
                            <h2>Mis Próximos Partidos</h2>
                            <div className={styles.tableWrapper}>
                                <table className={styles.dataTable}>
                                    <thead>
                                        <tr>
                                            <th>Club Local</th>
                                            <th>Club Visitante</th>
                                            <th>Fecha</th>
                                            <th>Fase</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {misPartidosPorDisputar.map(encuentro => (
                                            <tr key={encuentro.id}>
                                                <td>
                                                    <div className={styles.clubInfo}>
                                                        {encuentro.clubLocal.escudo && <img src={encuentro.clubLocal.escudo} alt={`Escudo de ${encuentro.clubLocal.nombre}`} className={styles.escudoSmall} />}
                                                        {encuentro.clubLocal.nombre}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={styles.clubInfo}>
                                                        {encuentro.clubVisitante.escudo && <img src={encuentro.clubVisitante.escudo} alt={`Escudo de ${encuentro.clubVisitante.nombre}`} className={styles.escudoSmall} />}
                                                        {encuentro.clubVisitante.nombre}
                                                    </div>
                                                </td>
                                                <td>{new Date(encuentro.fecha).toLocaleString()}</td>
                                                <td>{encuentro.fase}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'disputados' && (
                        <div className={styles.section}>
                            <h2>Mis Partidos Disputados</h2>
                            <div className={styles.tableWrapper}>
                                <table className={styles.dataTable}>
                                    <thead>
                                        <tr>
                                            <th>Club Local</th>
                                            <th>Club Visitante</th>
                                            <th>Fecha</th>
                                            <th>Resultado</th>
                                            <th>Fase</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {misPartidosDisputados.map(encuentro => (
                                            <tr key={encuentro.id}>
                                                <td>
                                                    <div className={styles.clubInfo}>
                                                        {encuentro.clubLocal.escudo && <img src={encuentro.clubLocal.escudo} alt={`Escudo de ${encuentro.clubLocal.nombre}`} className={styles.escudoSmall} />}
                                                        {encuentro.clubLocal.nombre}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={styles.clubInfo}>
                                                        {encuentro.clubVisitante.escudo && <img src={encuentro.clubVisitante.escudo} alt={`Escudo de ${encuentro.clubVisitante.nombre}`} className={styles.escudoSmall} />}
                                                        {encuentro.clubVisitante.nombre}
                                                    </div>
                                                </td>
                                                <td>{new Date(encuentro.fecha).toLocaleString()}</td>
                                                <td>{encuentro.resultado}</td>
                                                <td>{encuentro.fase}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'todos' && (
                        <div className={styles.section}>
                            <h2>Todos los Partidos del Evento</h2>
                            <div className={styles.tableWrapper}>
                                <table className={styles.dataTable}>
                                    <thead>
                                        <tr>
                                            <th>Club Local</th>
                                            <th>Club Visitante</th>
                                            <th>Fecha</th>
                                            <th>Resultado</th>
                                            <th>Estado</th>
                                            <th>Fase</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {encuentros.map(encuentro => (
                                            <tr key={encuentro.id}>
                                                <td>
                                                    <div className={styles.clubInfo}>
                                                        {encuentro.clubLocal.escudo && <img src={encuentro.clubLocal.escudo} alt={`Escudo de ${encuentro.clubLocal.nombre}`} className={styles.escudoSmall} />}
                                                        {encuentro.clubLocal.nombre}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={styles.clubInfo}>
                                                        {encuentro.clubVisitante.escudo && <img src={encuentro.clubVisitante.escudo} alt={`Escudo de ${encuentro.clubVisitante.nombre}`} className={styles.escudoSmall} />}
                                                        {encuentro.clubVisitante.nombre}
                                                    </div>
                                                </td>
                                                <td>{new Date(encuentro.fecha).toLocaleString()}</td>
                                                <td>{encuentro.resultado}</td>
                                                <td>{encuentro.estado}</td>
                                                <td>{encuentro.fase}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerMiEventoScreen;

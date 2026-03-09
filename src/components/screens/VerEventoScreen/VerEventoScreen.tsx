
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventoById, Evento, addClubToEvento, removeClubFromEvento, addEquipoToEvento, removeEquipoFromEvento } from '../../../api/eventosService';
import { getClubes, Clubes } from '../../../api/clubesService';
import { getEquipos, Equipos } from '../../../api/equiposService';
import { Encuentro, getEncuentros } from '../../../api/encuentrosService';
import styles from './VerEventoScreen.module.css';
import Swal from 'sweetalert2';
import GestionarPartidosModal from './GestionarPartidosModal';
import { MdSportsSoccer, MdShuffle, MdFormatListNumbered, MdGroupAdd, MdDelete, MdOpenInNew, MdArrowBack } from 'react-icons/md';
import { generateBracket, BracketRound } from '../../../utils/bracket';
import Bracket from '../../ui/Bracket/Bracket';
import ImageModal from '../../ui/Equipos/ImageModal';

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

const VerEventoScreen = () => {
    const { id } = useParams<{ id: string }>();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [allClubs, setAllClubs] = useState<Clubes[]>([]);
    const [allEquipos, setAllEquipos] = useState<Equipos[]>([]);
    const [activeTab, setActiveTab] = useState<'general' | 'partidos'>('general');
    const [encuentros, setEncuentros] = useState<Encuentro[]>([]);
    const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
    const [bracketData, setBracketData] = useState<BracketRound[]>([]);

    const [selectedClub, setSelectedClub] = useState<number | ''>('');
    const [selectedEquipo, setSelectedEquipo] = useState<number | ''>('');
    const [isPartidosModalOpen, setIsPartidosModalOpen] = useState(false);
    const navigate = useNavigate();

    const [selectedEquipoModal, setSelectedEquipoModal] = useState<Equipos | null>(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    const handleOpenImageModal = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
        setImageModalOpen(true);
    };

    const handleCloseImageModal = () => {
        setSelectedImageUrl(null);
        setImageModalOpen(false);
    };

    const handleViewEquipo = (equipo: Equipos) => {
        setSelectedEquipoModal(equipo);
    };

    const handleCloseEquipoModal = () => {
        setSelectedEquipoModal(null);
    };

    const fetchEventoDetails = async () => {
        if (id) {
            try {
                const eventoData = await getEventoById(Number(id));
                setEvento(eventoData);
            } catch (error) {
                console.error("Error fetching event details", error);
                Swal.fire('Error', 'No se pudieron cargar los detalles del evento.', 'error');
            }
        }
    };

    const fetchClubsAndEquipos = async () => {
        try {
            const clubsData = await getClubes();
            setAllClubs(clubsData);
            const equiposData = await getEquipos();
            setAllEquipos(equiposData);
        } catch (error) {
            console.error("Error fetching clubs or equipos", error);
        }
    };

    const fetchEncuentros = async () => {
        if (id) {
            const data = await getEncuentros(Number(id));
            setEncuentros(data);
        }
    };

    useEffect(() => {
        fetchEventoDetails();
        fetchClubsAndEquipos();
        fetchEncuentros();
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
    }, [encuentros, evento]);

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

    const handleAddClub = async () => {
        if (id && selectedClub) {
            try {
                await addClubToEvento(Number(id), Number(selectedClub));
                fetchEventoDetails();
                Swal.fire('Club Agregado', 'El club ha sido agregado al evento.', 'success');
                setSelectedClub('');
            } catch (error) {
                console.error("Error adding club to event", error);
                Swal.fire('Error', 'No se pudo agregar el club.', 'error');
            }
        }
    };

    const handleRemoveClub = async (clubId: number) => {
        if (id) {
            try {
                await removeClubFromEvento(Number(id), clubId);
                fetchEventoDetails();
                Swal.fire('Club Eliminado', 'El club ha sido eliminado del evento.', 'success');
            } catch (error) {
                console.error("Error removing club from event", error);
                Swal.fire('Error', 'No se pudo eliminar el club.', 'error');
            }
        }
    };

    const handleAddEquipo = async () => {
        if (id && selectedEquipo) {
            try {
                await addEquipoToEvento(Number(id), Number(selectedEquipo));
                fetchEventoDetails();
                Swal.fire('Equipo Agregado', 'El equipo ha sido agregado al evento.', 'success');
                setSelectedEquipo('');
            } catch (error) {
                console.error("Error adding equipo to event", error);
                Swal.fire('Error', 'No se pudo agregar el equipo.', 'error');
            }
        }
    };

    const handleRemoveEquipo = async (equipoId: number) => {
        if (id) {
            try {
                await removeEquipoFromEvento(Number(id), equipoId);
                fetchEventoDetails();
                Swal.fire('Equipo Eliminado', 'El equipo ha sido eliminado del evento.', 'success');
            } catch (error) {
                console.error("Error removing equipo from event", error);
                Swal.fire('Error', 'No se pudo eliminar el equipo.', 'error');
            }
        }
    };

    if (!evento) {
        return <div>Cargando...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <MdArrowBack /> Volver
                </button>
                <div className={styles.headerContent}>
                    <h1>{evento.nombre}</h1>
                    <div className={styles.details}>
                        <span><MdSportsSoccer /> <strong>Tipo:</strong> {evento.tipo}</span>
                        <span><MdShuffle /> <strong>Orden:</strong> {evento.ordenEncuentros}</span>

                    </div>
                </div>
                <div className={styles.tabs}>
                    <button className={activeTab === 'general' ? styles.activeTab : ''} onClick={() => setActiveTab('general')}>General</button>
                    <button className={activeTab === 'partidos' ? styles.activeTab : ''} onClick={() => setActiveTab('partidos')}>Partidos</button>
                </div>
            </div>

            {activeTab === 'general' && (
                <>
                    <div className={styles.managementSection}>
                        <h2>Gestionar Clubes</h2>
                        <div className={styles.addSection}>
                            <select value={selectedClub} onChange={(e) => setSelectedClub(Number(e.target.value))}>
                                <option value="">Seleccionar Club</option>
                                {allClubs.filter(c => !evento.clubes?.some(ec => ec.cod === c.cod)).map(club => (
                                    <option key={club.cod} value={club.cod}>{club.nombre}</option>
                                ))}
                            </select>
                            <button onClick={handleAddClub}><MdGroupAdd /> Agregar Club</button>
                        </div>
                        <ul className={styles.list}>
                            {evento.clubes && evento.clubes.length > 0 ? evento.clubes.map(club => (
                                <li key={club.cod}>
                                    <div className={styles.clubInfo}>
                                        {club.escudo && <img src={club.escudo} alt={`Escudo de ${club.nombre}`} className={styles.escudoSmall} />}
                                        {club.nombre}
                                    </div>
                                    <button onClick={() => handleRemoveClub(club.cod)}><MdDelete /> Eliminar</button>
                                </li>
                            )) : <p>No hay clubes en el evento.</p>}
                        </ul>
                    </div>

                    <div className={styles.managementSection}>
                        <h2>Gestionar Equipos</h2>
                        <div className={styles.addSection}>
                            <select value={selectedEquipo} onChange={(e) => setSelectedEquipo(Number(e.target.value))}>
                                <option value="">Seleccionar Equipo</option>
                                {allEquipos.filter(e => !evento.equipos?.some(ee => ee.cod === e.cod)).map(equipo => (
                                    <option key={equipo.cod} value={equipo.cod}>{equipo.nombreEquipo}</option>
                                ))}
                            </select>
                            <button onClick={handleAddEquipo}><MdGroupAdd /> Agregar Equipo</button>
                        </div>
                        <ul className={styles.list}>
                            {evento.equipos && evento.equipos.length > 0 ? evento.equipos.map(equipo => (
                                <li key={equipo.cod}>
                                    <div className={styles.equipoInfo}>
                                        {equipo.club?.escudo && <img src={equipo.club.escudo} alt={`Escudo de ${equipo.club.nombre}`} className={styles.escudoSmall} />}
                                        <div className={styles.equipoNombre}>
                                            <span>{equipo.nombreEquipo}</span>
                                            <span className={styles.clubNombre}>{equipo.club?.nombre}</span>
                                        </div>
                                    </div>
                                    <div className={styles.equipoActions}>
                                        <button onClick={() => handleViewEquipo(equipo)}><MdOpenInNew /> Ver</button>
                                        <button onClick={() => handleRemoveEquipo(equipo.cod)}><MdDelete /> Eliminar</button>
                                    </div>
                                </li>
                            )) : <p>No hay equipos en el evento.</p>}
                        </ul>
                    </div>
                </>
            )}
            {activeTab === 'partidos' && (
                <div className={styles.managementSection}>
                    <h2>Gestionar Partidos</h2>
                    <button className={styles.partidosBtn} onClick={() => setIsPartidosModalOpen(true)}>
                        <MdOpenInNew /> Administrar Partidos
                    </button>

                    {evento.tipo === 'PUNTOS' && (
                        <div className={styles.tableContainer}>
                            <h4>Tabla de Posiciones</h4>
                            <table className={styles.eventTable}>
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
                    )}
                     {evento.tipo === 'LLAVES' && (
                        <div>
                            <h4>Llaves del Torneo</h4>
                            <Bracket data={bracketData} />
                        </div>
                    )}
                </div>
            )}
            {evento && (
                <GestionarPartidosModal
                    open={isPartidosModalOpen}
                    onClose={() => setIsPartidosModalOpen(false)}
                    evento={evento}
                    onPartidosChanged={fetchEncuentros}
                />
            )}

            {selectedEquipoModal && (
              <div className={styles.carnetOverlay} onClick={handleCloseEquipoModal}>
                <div className={styles.carnetModal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h2>Detalles del Equipo</h2>
                    <button className={styles.closeBtn} onClick={handleCloseEquipoModal}>&times;</button>
                  </div>
                  <div className={styles.modalContent}>
                    <div className={styles.modalSection}>
                      <h3>Información General</h3>
                      <div className={styles.modalDatosGrid}>
                        <div className={styles.modalDatoLabel}>Nombre</div>
                        <div className={styles.modalDatoValue}>{selectedEquipoModal.nombreEquipo}</div>
                        <div className={styles.modalDatoLabel}>Nombre corto</div>
                        <div className={styles.modalDatoValue}>{selectedEquipoModal.corto}</div>
                        <div className={styles.modalDatoLabel}>Grupo</div>
                        <div className={styles.modalDatoValue}>{selectedEquipoModal.grupo}</div>
                        <div className={styles.modalDatoLabel}>Categoría</div>
                        <div className={styles.modalDatoValue}>{selectedEquipoModal.categoria?.nombre ?? 'N/A'}</div>
                        <div className={styles.modalDatoLabel}>Club</div>
                        <div className={styles.modalDatoValue}>{selectedEquipoModal.club?.nombre ?? 'N/A'}</div>
                      </div>
                    </div>
                    <div className={styles.modalSection}>
                      <h3>Fotos</h3>
                      <div className={styles.modalFotosRow}>
                        {selectedEquipoModal.fotoEquipo ? <img src={selectedEquipoModal.fotoEquipo} className={styles.modalFotoImg} onClick={() => handleOpenImageModal(selectedEquipoModal.fotoEquipo!)} /> : <div className={styles.modalFotoPlaceholder}>Equipo</div>}
                        {selectedEquipoModal.fotoEquipacion1 ? <img src={selectedEquipoModal.fotoEquipacion1} className={styles.modalFotoImg} onClick={() => handleOpenImageModal(selectedEquipoModal.fotoEquipacion1!)} /> : <div className={styles.modalFotoPlaceholder}>Equipación 1</div>}
                        {selectedEquipoModal.fotoEquipacion2 ? <img src={selectedEquipoModal.fotoEquipacion2} className={styles.modalFotoImg} onClick={() => handleOpenImageModal(selectedEquipoModal.fotoEquipacion2!)} /> : <div className={styles.modalFotoPlaceholder}>Equipación 2</div>}
                      </div>
                    </div>
                    <div className={styles.modalSection}>
                      <h3>Jugadores</h3>
                      <table className={styles.modalTable}>
                        <thead><tr><th>Foto</th><th>Nombre</th><th>Número</th><th>Demarcación</th></tr></thead>
                        <tbody>
                          {selectedEquipoModal.jugadores?.length ? selectedEquipoModal.jugadores.map(j => (
                            <tr key={j.cod}>
                              <td>
                                {j.foto ? (
                                  <img src={j.foto} alt={`${j.nombre} ${j.apellido}`} className={styles.tableFotoImg} onClick={() => handleOpenImageModal(j.foto)} />
                                ) : (
                                  <div className={styles.tableFotoPlaceholder}>Sin foto</div>
                                )}
                              </td>
                              <td>{j.nombre} {j.apellido}</td>
                              <td>{j.numeroCamiseta}</td>
                              <td>{j.demarcacion}</td>
                            </tr>
                          )) : <tr><td colSpan={4} className={styles.modalTableEmpty}>No hay jugadores</td></tr>}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.modalSection}>
                      <h3>Staff</h3>
                      <table className={styles.modalTable}>
                        <thead><tr><th>Foto</th><th>Nombre</th><th>Cargo</th></tr></thead>
                        <tbody>
                          {selectedEquipoModal.staff?.length ? selectedEquipoModal.staff.map(s => (
                            <tr key={s.cod}>
                              <td>
                                {s.foto ? (
                                  <img src={s.foto} alt={`${s.nombre} ${s.apellido}`} className={styles.tableFotoImg} onClick={() => handleOpenImageModal(s.foto)} />
                                ) : (
                                  <div className={styles.tableFotoPlaceholder}>Sin foto</div>
                                )}
                              </td>
                              <td>{s.nombre} {s.apellido}</td>
                              <td>{s.cargo}</td>
                            </tr>
                          )) : <tr><td colSpan={3} className={styles.modalTableEmpty}>No hay staff</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <ImageModal
              isOpen={imageModalOpen}
              onClose={handleCloseImageModal}
              imageUrl={selectedImageUrl}
            />
        </div>
    );
};

export default VerEventoScreen;

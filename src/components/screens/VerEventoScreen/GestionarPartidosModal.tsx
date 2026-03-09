import { useEffect, useState } from 'react';
import { Evento } from '../../../api/eventosService';
import { Encuentro, getEncuentros, deleteEncuentro, createEncuentro, type CreateEncuentroPayload } from '../../../api/encuentrosService';
import styles from './GestionarPartidosModal.module.css';
import { MdEdit, MdDelete, MdAdd, MdArrowBack, MdShuffle } from 'react-icons/md';
import Swal from 'sweetalert2';
import CreateEditPartidoModal from './CreateEditPartidoModal';

interface Props {
    open: boolean;
    onClose: () => void;
    evento: Evento;
    onPartidosChanged: () => void;
}

const GestionarPartidosModal = ({ open, onClose, evento, onPartidosChanged }: Props) => {
    const [encuentros, setEncuentros] = useState<Encuentro[]>([]);
    const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
    const [selectedPartido, setSelectedPartido] = useState<Encuentro | null>(null);

    const fetchEncuentros = async () => {
        if (evento) {
            const data = await getEncuentros(evento.id);
            setEncuentros(data);
            onPartidosChanged();
        }
    };

    useEffect(() => {
        if (open) {
            fetchEncuentros();
        }
    }, [open, evento]);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Eliminar partido?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            await deleteEncuentro(id);
            fetchEncuentros();
            Swal.fire('Eliminado', 'El partido ha sido eliminado.', 'success');
        }
    };

    const handleOpenCreateModal = () => {
        setSelectedPartido(null);
        setIsCreateEditModalOpen(true);
    };

    const handleOpenEditModal = (partido: Encuentro) => {
        setSelectedPartido(partido);
        setIsCreateEditModalOpen(true);
    };
    
    const handleSave = () => {
        fetchEncuentros();
    }

    const handleGenerateEncuentros = async () => {
        if (!evento.clubes || evento.clubes.length < 2) {
            Swal.fire('Error', 'No hay suficientes clubes en el evento para generar partidos.', 'error');
            return;
        }

        let newEncuentros: CreateEncuentroPayload[] = [];
        const clubes = [...evento.clubes];

        if (evento.tipo === 'PUNTOS') {
            const result = await Swal.fire({
                title: 'Generar Partidos por Puntos',
                text: '¿Desea que los partidos sean de ida y vuelta?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ida y Vuelta',
                cancelButtonText: 'Solo Ida',
            });

            const idaYVuelta = result.isConfirmed;

            for (let i = 0; i < clubes.length; i++) {
                for (let j = i + 1; j < clubes.length; j++) {
                    newEncuentros.push({
                        evento: { id: evento.id },
                        clubLocal: { cod: clubes[i].cod },
                        clubVisitante: { cod: clubes[j].cod },
                        fecha: new Date().toISOString(),
                        fase: 1,
                        resultado: '0-0',
                    });
                    if (idaYVuelta) {
                        newEncuentros.push({
                            evento: { id: evento.id },
                            clubLocal: { cod: clubes[j].cod },
                            clubVisitante: { cod: clubes[i].cod },
                            fecha: new Date().toISOString(),
                            fase: 1,
                            resultado: '0-0',
                        });
                    }
                }
            }
        } else if (evento.tipo === 'LLAVES') {
            // Shuffle clubes
            for (let i = clubes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [clubes[i], clubes[j]] = [clubes[j], clubes[i]];
            }

            for (let i = 0; i < clubes.length; i += 2) {
                if (clubes[i + 1]) {
                    newEncuentros.push({
                        evento: { id: evento.id },
                        clubLocal: { cod: clubes[i].cod },
                        clubVisitante: { cod: clubes[i+1].cod },
                        fecha: new Date().toISOString(),
                        fase: 1,
                        resultado: '0-0',
                    });
                }
            }
        }

        try {
            await Promise.all(newEncuentros.map(encuentro => createEncuentro(encuentro)));
            fetchEncuentros();
            Swal.fire('Generados', 'Los partidos han sido generados exitosamente.', 'success');
        } catch (error) {
            console.error("Error generating encuentros", error);
            Swal.fire('Error', 'No se pudieron generar los partidos.', 'error');
        }
    };

    if (!open) return null;

    return (
        <>
            <div className={styles.darkOverlay}>
                <div className={styles.darkModal}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.darkTitle}>Gestionar Partidos del Evento: {evento.nombre}</h3>
                        <div className={styles.headerActions}>
                            <button className={styles.generateBtn} onClick={handleGenerateEncuentros} disabled={evento.ordenEncuentros === 'MANUAL'}>
                                <MdShuffle size={20} />
                                Generar Partidos al Azar
                            </button>
                            <button className={styles.createBtn} onClick={handleOpenCreateModal}>
                                <MdAdd size={20} />
                                Crear Partido
                            </button>
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <h4>Partidos</h4>
                        <table className={styles.eventTable}>
                            <thead>
                                <tr>
                                    <th>Club Local</th>
                                    <th>Club Visitante</th>
                                    <th>Fecha</th>
                                    <th>Fase</th>
                                    <th>Resultado</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
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
                                        <td>{encuentro.fase}</td>
                                        <td>{encuentro.resultado}</td>
                                        <td>{encuentro.estado}</td>
                                        <td>
                                            <div className={styles.buttonGroup}>
                                                <button className={styles.editBtn} onClick={() => handleOpenEditModal(encuentro)} title="Editar">
                                                    <MdEdit size={20} />
                                                </button>
                                                <button className={styles.deleteBtn} onClick={() => handleDelete(encuentro.id)} title="Eliminar">
                                                    <MdDelete size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.footer}>
                        <button className={styles.backBtn} onClick={onClose}>
                            <MdArrowBack /> Volver
                        </button>
                    </div>
                </div>
            </div>
            <CreateEditPartidoModal
                open={isCreateEditModalOpen}
                onClose={() => setIsCreateEditModalOpen(false)}
                onSaved={handleSave}
                evento={evento}
                partido={selectedPartido}
            />
        </>
    )
};

export default GestionarPartidosModal;

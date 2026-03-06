
import { useEffect, useState } from 'react';
import { Evento } from '../../../api/eventosService';
import { Encuentro, getEncuentros, deleteEncuentro } from '../../../api/encuentrosService';
import styles from './GestionarPartidosModal.module.css';
import { MdClose, MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import Swal from 'sweetalert2';
import CreateEditPartidoModal from './CreateEditPartidoModal';

interface Props {
    open: boolean;
    onClose: () => void;
    evento: Evento;
}

const GestionarPartidosModal = ({ open, onClose, evento }: Props) => {
    const [encuentros, setEncuentros] = useState<Encuentro[]>([]);
    const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
    const [selectedPartido, setSelectedPartido] = useState<Encuentro | null>(null);

    const fetchEncuentros = async () => {
        if (evento) {
            const data = await getEncuentros(evento.id);
            setEncuentros(data);
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

    if (!open) return null;

    return (
        <>
            <div className={styles.darkOverlay}>
                <div className={styles.darkModal}>
                    <button className={styles.closeIcon} onClick={onClose}>
                        <MdClose size={28} />
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className={styles.darkTitle}>Gestionar Partidos del Evento: {evento.nombre}</h3>
                        <button className={styles.createBtn} onClick={handleOpenCreateModal}>
                            <MdAdd size={20} />
                            Crear Partido
                        </button>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.eventTable}>
                            <thead>
                                <tr>
                                    <th>Club Local</th>
                                    <th>Club Visitante</th>
                                    <th>Fecha</th>
                                    <th>Fase</th>
                                    <th>Resultado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {encuentros.map(encuentro => (
                                    <tr key={encuentro.id}>
                                        <td>{encuentro.clubLocal.nombre}</td>
                                        <td>{encuentro.clubVisitante.nombre}</td>
                                        <td>{new Date(encuentro.fecha).toLocaleString()}</td>
                                        <td>{encuentro.fase}</td>
                                        <td>{encuentro.resultado}</td>
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

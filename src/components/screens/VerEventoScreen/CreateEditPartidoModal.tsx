import { useEffect, useState } from 'react';
import { Encuentro, createEncuentro, updateEncuentro } from '../../../api/encuentrosService';
import { Evento } from '../../../api/eventosService';
import styles from './CreateEditPartidoModal.module.css';
import Swal from 'sweetalert2';

interface Props {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    evento: Evento;
    partido: Encuentro | null;
}

const CreateEditPartidoModal = ({ open, onClose, onSaved, evento, partido }: Props) => {
    const [clubLocalId, setClubLocalId] = useState<number | ''>('');
    const [clubVisitanteId, setClubVisitanteId] = useState<number | ''>('');
    const [fecha, setFecha] = useState('');
    const [fase, setFase] = useState(1);
    const [resultado, setResultado] = useState('');
    const [estado, setEstado] = useState<'DISPUTADO' | 'POR_DISPUTAR'>('POR_DISPUTAR');

    const availableClubs = evento.clubes || [];

    useEffect(() => {
        if (partido) {
            setClubLocalId(partido.clubLocal.cod);
            setClubVisitanteId(partido.clubVisitante.cod);
            setFecha(new Date(partido.fecha).toISOString().slice(0, 16));
            setFase(partido.fase);
            setResultado(partido.resultado);
            setEstado(partido.estado);
        } else {
            setClubLocalId('');
            setClubVisitanteId('');
            setFecha('');
            setFase(1);
            setResultado('0-0');
            setEstado('POR_DISPUTAR');
        }
    }, [partido, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clubLocalId || !clubVisitanteId) {
            Swal.fire('Error', 'Debe seleccionar ambos clubes.', 'error');
            return;
        }

        try {
            if (partido) {
                const clubLocal = availableClubs.find(c => c.cod === Number(clubLocalId));
                const clubVisitante = availableClubs.find(c => c.cod === Number(clubVisitanteId));

                if (!clubLocal || !clubVisitante) {
                    Swal.fire('Error', 'Club no encontrado.', 'error');
                    return;
                }

                const updatedEncuentroData = {
                    id: partido.id,
                    evento: { id: evento.id },
                    clubLocal,
                    clubVisitante,
                    fecha,
                    fase,
                    resultado,
                    estado,
                };
                await updateEncuentro(partido.id, updatedEncuentroData);
                Swal.fire('Actualizado', 'El partido ha sido actualizado.', 'success');
            } else {
                const encuentroData = {
                    evento: { id: evento.id },
                    clubLocal: { cod: Number(clubLocalId) },
                    clubVisitante: { cod: Number(clubVisitanteId) },
                    fecha,
                    fase,
                    resultado,
                };
                await createEncuentro(encuentroData);
                Swal.fire('Creado', 'El partido ha sido creado.', 'success');
            }
            onSaved();
            onClose();
        } catch (error) {
            console.error("Error saving partido", error);
            Swal.fire('Error', 'No se pudo guardar el partido.', 'error');
        }
    };
    
    if (!open) return null;

    return (
        <div className={styles.darkOverlay}>
            <div className={styles.darkModal}>
                <button className={styles.closeIcon} onClick={onClose}>&times;</button>
                <h2>{partido ? 'Editar Partido' : 'Crear Partido'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Club Local</label>
                        <select value={clubLocalId} onChange={e => setClubLocalId(Number(e.target.value))} required>
                            <option value="">Seleccione un club</option>
                            {availableClubs.map(club => (
                                <option key={club.cod} value={club.cod}>{club.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Club Visitante</label>
                        <select value={clubVisitanteId} onChange={e => setClubVisitanteId(Number(e.target.value))} required>
                            <option value="">Seleccione un club</option>
                            {availableClubs.map(club => (
                                <option key={club.cod} value={club.cod}>{club.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fecha y Hora</label>
                        <input type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fase</label>
                        <input type="number" value={fase} onChange={e => setFase(Number(e.target.value))} min="1" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Estado</label>
                        <select value={estado} onChange={e => setEstado(e.target.value as 'DISPUTADO' | 'POR_DISPUTAR')}>
                            <option value="POR_DISPUTAR">Por Disputar</option>
                            <option value="DISPUTADO">Disputado</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Resultado</label>
                        <input type="text" value={resultado} onChange={e => setResultado(e.target.value)} disabled={estado === 'POR_DISPUTAR'} />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveBtn}>Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEditPartidoModal;

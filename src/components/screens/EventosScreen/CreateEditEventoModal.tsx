import { useEffect, useState } from 'react';
import { Evento, crearEvento, updateEvento } from '../../../api/eventosService';
import styles from './CreateEditEventoModal.module.css';
import Swal from 'sweetalert2';
import { MdSave, MdCancel } from 'react-icons/md';

interface CreateEditEventoModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    evento: Evento | null;
    isEditMode: boolean;
}

const CreateEditEventoModal = ({ open, onClose, onSave, evento, isEditMode }: CreateEditEventoModalProps) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'LLAVES' | 'PUNTOS' >('PUNTOS');
  const [ordenEncuentros, setOrdenEncuentros] = useState<'AZAR' | 'MANUAL'>('AZAR');

  useEffect(() => {
    if (evento && isEditMode) {
        setNombre(evento.nombre);
        setTipo(evento.tipo);
        setOrdenEncuentros(evento.ordenEncuentros);
    } else {
        setNombre('');
        setTipo('PUNTOS');
        setOrdenEncuentros('AZAR');
    }
  }, [evento, isEditMode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode && evento) {
        const eventoData = { nombre, tipo, ordenEncuentros };
        await updateEvento(evento.id, eventoData);
        Swal.fire('Actualizado', 'El evento ha sido actualizado.', 'success');
      } else {
        const eventoData = { nombre, tipo, ordenEncuentros, fases: 1 };
        await crearEvento(eventoData);
        Swal.fire('Creado', 'El evento ha sido creado.', 'success');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving event", error);
      Swal.fire('Error', 'No se pudo guardar el evento.', 'error');
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
        <div className={styles.modal}>
            <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.title}>{isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento'}</h3>
                <div className={styles.formGroup} style={{ flexBasis: '100%' }}>
                <label htmlFor="nombre">Nombre del Evento</label>
                <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Mundialito 2024"
                    required
                />
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                    <label htmlFor="tipo">Tipo de Competencia</label>
                    <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)} required>
                        <option value="PUNTOS">Puntos</option>
                        <option value="LLAVES">Llaves</option>
                        
                    </select>
                    </div>
                    <div className={styles.formGroup}>
                    <label htmlFor="ordenEncuentros">Orden de Encuentros</label>
                    <select id="ordenEncuentros" value={ordenEncuentros} onChange={(e) => setOrdenEncuentros(e.target.value as typeof ordenEncuentros)} required>
                        <option value="AZAR">Azar</option>
                        <option value="MANUAL">Manual</option>
                    </select>
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveBtn}>
                    <MdSave size={20} />
                    {isEditMode ? 'Guardar Cambios' : 'Crear Evento'}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>
                    <MdCancel size={20} />
                    Cancelar
                </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default CreateEditEventoModal;

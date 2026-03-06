
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Evento, crearEvento, updateEvento, getEventoById } from '../../../api/eventosService';
import styles from './CreateEditEventoForm.module.css';
import Swal from 'sweetalert2';

const CreateEditEventoForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'LLAVES' | 'PUNTOS' | 'MIXTO'>('PUNTOS');
  const [ordenEncuentros, setOrdenEncuentros] = useState<'AZAR' | 'MANUAL'>('AZAR');
  const [fases, setFases] = useState(1);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      getEventoById(Number(id)).then(evento => {
        setNombre(evento.nombre);
        setTipo(evento.tipo);
        setOrdenEncuentros(evento.orden_encuentros);
        setFases(evento.fases);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventoData = { nombre, tipo, orden_encuentros: ordenEncuentros, fases };

    try {
      if (isEditMode && id) {
        await updateEvento(Number(id), eventoData);
        Swal.fire('Actualizado', 'El evento ha sido actualizado.', 'success');
      } else {
        await crearEvento(eventoData);
        Swal.fire('Creado', 'El evento ha sido creado.', 'success');
      }
      navigate('/eventos');
    } catch (error) {
      console.error("Error saving event", error);
      Swal.fire('Error', 'No se pudo guardar el evento.', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <h1>{isEditMode ? 'Editar Evento' : 'Crear Evento'}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tipo">Tipo</label>
          <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)} required>
            <option value="PUNTOS">Puntos</option>
            <option value="LLAVES">Llaves</option>
            <option value="MIXTO">Mixto</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="ordenEncuentros">Orden de Encuentros</label>
          <select id="ordenEncuentros" value={ordenEncuentros} onChange={(e) => setOrdenEncuentros(e.target.value as typeof ordenEncuentros)} required>
            <option value="AZAR">Azar</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>
        {tipo === 'MIXTO' && (
          <div className={styles.formGroup}>
            <label htmlFor="fases">Fases</label>
            <input
              id="fases"
              type="number"
              value={fases}
              onChange={(e) => setFases(Number(e.target.value))}
              min="1"
              required
            />
          </div>
        )}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveBtn}>{isEditMode ? 'Guardar Cambios' : 'Crear Evento'}</button>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/eventos')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditEventoForm;

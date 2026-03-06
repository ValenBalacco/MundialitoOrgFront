import { useState, useEffect } from 'react';
import styles from './SelectPersonModal.module.css';
import { MdAdd, MdDelete } from 'react-icons/md';

interface Item {
  id: number;
  nombre?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  items: Item[];
  existingIds: number[];
  onSave: (newIds: number[]) => void;
}

const SelectPersonModal = ({ open, onClose, title, items, existingIds, onSave }: Props) => {
  const [currentIds, setCurrentIds] = useState<number[]>([]);

  useEffect(() => {
    if (open) {
      setCurrentIds(existingIds);
    }
  }, [open, existingIds]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ minWidth: '400px' }}>
        <h3>{title}</h3>
        <div className={styles.list}>
          {items.map(item => (
            <div key={item.id} className={styles.listItem}>
              <span>{item.nombre || "Sin nombre"}</span>
              {currentIds.includes(item.id) ? (
                <div className={styles.itemActions}>
                  <span className={styles.inTeamLabel}>En el Equipo</span>
                  <button onClick={() => setCurrentIds(prev => prev.filter(i => i !== item.id))} className={styles.removeBtn} title="Quitar">
                    <MdDelete size={20} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setCurrentIds(prev => [...prev, item.id])} className={styles.addBtn} title="Agregar">
                  <MdAdd size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <button onClick={() => { onSave(currentIds); onClose(); }}>Guardar Cambios</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default SelectPersonModal;

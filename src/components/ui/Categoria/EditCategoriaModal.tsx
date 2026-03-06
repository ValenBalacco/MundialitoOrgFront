import { useEffect, useState } from 'react';
import type { Categoria } from '../../../types';
import styles from './Modal.module.css';
import { MdClose, MdPalette } from 'react-icons/md';

interface Props {
  open: boolean;
  categoria: Categoria | null;
  onClose: () => void;
  onSave: (cod: number, categoria: Categoria) => Promise<void>;
}

const EditCategoriaModal = ({ open, categoria, onClose, onSave }: Props) => {
  const [nombre, setNombre] = useState('');
  const [categoria2, setCategoria2] = useState('');
  const [color, setColor] = useState('#1976d2');
  const [descripcionCorta, setDescripcionCorta] = useState('');
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre ?? '');
      setCategoria2(categoria.categoria2 ?? '');
      setColor(categoria.color ?? '#1976d2');
      setDescripcionCorta(categoria.descripcionCorta ?? '');
      setActivo(categoria.activo ?? true);
    }
  }, [categoria]);

  if (!open || !categoria) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCategoria = {
      ...categoria,
      nombre,
      categoria2,
      color,
      descripcionCorta,
      activo,
    };
    await onSave(categoria.cod, updatedCategoria);
    onClose();
  };

  return (
    <div className={styles.darkOverlay}>
      <div className={styles.darkModal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>
        <h3 className={styles.darkTitle}>Editar categoría</h3>
        <form className={styles.darkForm} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Nombre alternativo</label>
              <input value={categoria2} onChange={e => setCategoria2(e.target.value)} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <label
                  htmlFor="colorInputEdit"
                  style={{
                    display: 'inline-flex', alignItems: 'center', cursor: 'pointer',
                    border: '2px solid #1976d2', borderRadius: '8px', padding: '4px 8px',
                    background: '#f5faff', gap: '0.3rem'
                  }}
                  title="Selecciona color"
                >
                  <MdPalette size={22} color={color} />
                  <input
                    id="colorInputEdit" type="color" value={color}
                    onChange={e => setColor(e.target.value)}
                    style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                  />
                  <span style={{ fontWeight: 500, color: color, marginLeft: 6 }}>{color}</span>
                </label>
              </div>
            </div>
            <div className={styles.field}>
              <label>Descripción corta</label>
              <textarea
                value={descripcionCorta}
                onChange={e => setDescripcionCorta(e.target.value)}
                rows={2} maxLength={80} required
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label style={{ flexDirection: 'row', alignItems: 'center' }}>
                Activo
                <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} style={{ width: 'auto', marginLeft: '1rem' }} />
              </label>
            </div>
          </div>
          <button type="submit" className={styles.darkBtn}>Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default EditCategoriaModal;
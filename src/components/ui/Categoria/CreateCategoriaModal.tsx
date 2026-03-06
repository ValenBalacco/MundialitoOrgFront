import { useState } from 'react';
import type { Categoria } from '../../../types';
import { createCategoria } from '../../../api/categoriaService';
import styles from './Modal.module.css';
import { MdClose, MdPalette } from 'react-icons/md';



interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (categoria: Categoria) => void;
}

const CreateCategoriaModal = ({ open, onClose, onCreated }: Props) => {
  const [nombre, setNombre] = useState('');
  const [categoria2, setCategoria2] = useState('');
  const [color, setColor] = useState('#1976d2');
  const [descripcionCorta, setDescripcionCorta] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clubId = localStorage.getItem('clubId');
    const nuevaCategoria = {
      nombre,
      categoria2,
      color,
      descripcionCorta,
      activo: true,
      cod: undefined,
      club: clubId ? { cod: Number(clubId) } : undefined,
    };
    const categoriaCreada = await createCategoria(nuevaCategoria as any);
    onCreated?.(categoriaCreada);
    onClose();
  };

  if (!open) return null;
  return (
    <div className={styles.darkOverlay}>
      <div className={styles.darkModal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>
        <h3 className={styles.darkTitle}>Crear categoría</h3>
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
                  htmlFor="colorInput"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: '2px solid #1976d2',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    background: '#f5faff',
                    gap: '0.3rem'
                  }}
                  title="Selecciona color"
                >
                  <MdPalette size={22} color={color} />
                  <input
                    id="colorInput"
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                  <span style={{ fontWeight: 500, color: color, marginLeft: 6 }}>{color}</span>
                </label>
                <span style={{ fontSize: '0.98rem', color: '#1976d2', marginLeft: 8 }}>Selecciona color</span>
              </div>
            </div>
            <div className={styles.field}>
              <label>Descripción corta</label>
              <textarea
                value={descripcionCorta}
                onChange={e => setDescripcionCorta(e.target.value)}
                rows={2}
                maxLength={80}
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.darkBtn}>Crear</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoriaModal;
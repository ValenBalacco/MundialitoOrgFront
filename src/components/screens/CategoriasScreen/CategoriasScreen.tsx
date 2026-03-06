import { useEffect, useState } from 'react';
import styles from './CategoriasScreen.module.css';
import SlideBoard from '../../ui/SlideBoard/SlideBoard';
import { FaPlus, FaTrash, FaEdit, FaEye, FaTimes } from 'react-icons/fa';
import CreateCategoriaModal from '../../ui/Categoria/CreateCategoriaModal';
import EditCategoriaModal from '../../ui/Categoria/EditCategoriaModal';
import {
  getCategoriasByClub,
  deleteCategoria,
  updateCategoria,
} from '../../../api/categoriaService';
import type { Categoria } from '../../../types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CategoriasScreen = () => {
  const [categoriasList, setCategoriasList] = useState<Categoria[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<Categoria | null>(null);
  const [categoriaToView, setCategoriaToView] = useState<Categoria | null>(null);

  useEffect(() => {
    const clubId = localStorage.getItem('clubId');
    if (clubId) {
      getCategoriasByClub(Number(clubId)).then(setCategoriasList);
    }
  }, []);

  const handleCategoriaCreated = (categoria: Categoria) => {
    setCategoriasList(prev => [...prev, categoria]);
  };

  const handleDelete = async (categoria: Categoria) => {
    const result = await MySwal.fire({
      title: '¿Eliminar categoría?',
      text: `¿Estás seguro que deseas eliminar "${categoria.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#3182ce',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      await deleteCategoria(categoria.cod);
      setCategoriasList(prev => prev.filter(cat => cat.cod !== categoria.cod));
      MySwal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'La categoría ha sido eliminada.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const getContrastingTextColor = (bgColor: string) => {
    if (!bgColor) return '#000';
    const color = bgColor.charAt(0) === '#' ? bgColor.substring(1) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000' : '#fff';
  };

  return (
    <div className={styles.wrapper}>
      <SlideBoard />
      <div className={styles.panelContainer}>
        <div className={styles.header}>
          <h2 className={styles.panelTitle}>Categorías del Club</h2>
          <button className={styles.createBtn} onClick={() => setOpenCreateModal(true)}>
            <FaPlus /> Crear Categoría
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.categoriaTable}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Color</th>
                <th className={styles.actionsHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categoriasList.filter(cat => cat.activo).map(categoria => (
                <tr key={categoria.cod}>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.descripcionCorta}</td>
                  <td>
                    <span
                      className={styles.categoriaBadge}
                      style={{
                        backgroundColor: categoria.color,
                        color: getContrastingTextColor(categoria.color),
                      }}
                    >
                      {categoria.nombre}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.buttonGroup}>
                      <button
                        className={`${styles.iconButton} ${styles.viewBtn}`}
                        title="Ver"
                        onClick={() => {
                          setCategoriaToView(categoria);
                          setOpenViewModal(true);
                        }}
                      >
                        <FaEye />
                      </button>
                      <button
                        className={`${styles.iconButton} ${styles.editBtn}`}
                        title="Editar"
                        onClick={() => {
                          setCategoriaToEdit(categoria);
                          setOpenEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`${styles.iconButton} ${styles.deleteBtn}`}
                        title="Eliminar"
                        onClick={() => handleDelete(categoria)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Crear Categoría */}
        <CreateCategoriaModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onCreated={handleCategoriaCreated}
        />

        {/* Editar Categoría */}
        <EditCategoriaModal
          open={openEditModal}
          categoria={categoriaToEdit}
          onClose={() => setOpenEditModal(false)}
          onSave={async (cod, categoriaActualizada) => {
            const categoriaEditada = await updateCategoria(cod, categoriaActualizada);
            setCategoriasList(prev =>
              prev.map(cat => (cat.cod === cod ? categoriaEditada : cat))
            );
          }}
        />

        {/* Ver Categoría */}
        {openViewModal && categoriaToView && (
          <div className={styles.carnetOverlay}>
            <div className={styles.carnetModal}>
              <div className={styles.modalHeader}>
                <h2>{categoriaToView.nombre}</h2>
                <button className={styles.closeBtn} onClick={() => setOpenViewModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className={styles.modalContent}>
                <div className={styles.modalDatosGrid}>
                  <p className={styles.modalDatoLabel}>Nombre alternativo:</p>
                  <p className={styles.modalDatoValue}>
                    {categoriaToView.categoria2 || '—'}
                  </p>

                  <p className={styles.modalDatoLabel}>Descripción:</p>
                  <p className={styles.modalDatoValue}>{categoriaToView.descripcionCorta}</p>

                  <p className={styles.modalDatoLabel}>Color:</p>
                  <p
                    className={styles.modalDatoValue}
                    style={{
                      backgroundColor: categoriaToView.color,
                      color: getContrastingTextColor(categoriaToView.color),
                      padding: '0.4rem 1rem',
                      borderRadius: '12px',
                      display: 'inline-block',
                    }}
                  >
                    {categoriaToView.color}
                  </p>

                  <p className={styles.modalDatoLabel}>Estado:</p>
                  <p className={styles.modalDatoValue}>
                    {categoriaToView.activo ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriasScreen;

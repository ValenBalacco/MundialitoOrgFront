import { useEffect, useMemo, useState } from 'react';
import styles from './StaffScreen.module.css';
import SlideBoard from '../../ui/SlideBoard/SlideBoard';
import { FaPlus, FaTrash, FaEdit, FaEye, FaUndo } from 'react-icons/fa';
import CreateStaffModal from '../../ui/Staff/CreateStaffModal';
import EditStaffModal from '../../ui/Staff/EditStaffModal';
import ImageModal from '../../ui/Equipos/ImageModal';
import { getStaffByClub, setStaffActivo, updateStaff, getStaffInactivos } from '../../../api/staffService';
import type { Staff } from '../../../types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const StaffScreen = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showActivos, setShowActivos] = useState(true);
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

  useEffect(() => {
    const clubId = localStorage.getItem('clubId');
    if (clubId) {
      if (showActivos) {
        getStaffByClub(Number(clubId)).then(setStaffList);
      } else {
        getStaffInactivos(Number(clubId)).then(setStaffList);
      }
    }
  }, [showActivos]);

  const handleStaffUpdated = async (cod: number, updatedStaff: Staff) => {
    try {
      const savedStaff = await updateStaff(cod, updatedStaff);
      setStaffList(prev => prev.map(s => (s.cod === cod ? savedStaff : s)));
      setOpenEditModal(false);
      MySwal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'El miembro del staff ha sido actualizado.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating staff:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el miembro del staff.',
      });
    }
  };

  const handleStaffCreated = (nuevoStaff: Staff) => {
    setStaffList(prev => [...prev, nuevoStaff]);
  };

  const handleView = (staff: Staff) => {
    setSelectedStaff(staff);
  };

  const handleCloseModal = () => {
    setSelectedStaff(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedStaff) {
        handleCloseModal();
      }
    };
    if (selectedStaff) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStaff]);

  const handleDelete = async (staff: Staff) => {
    const result = await MySwal.fire({
      title: '¿Eliminar staff?',
      text: `¿Estás seguro que deseas eliminar a "${staff.nombre} ${staff.apellido}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#3182ce',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      if (!staff.cod) return;
      await setStaffActivo(staff.cod, false);
      setStaffList(prev => prev.map(s => s.cod === staff.cod ? { ...s, activo: false } : s));
      MySwal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El staff ha sido eliminado.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleReactivate = async (staff: Staff) => {
    const result = await MySwal.fire({
      title: '¿Reactivar miembro del staff?',
      text: `¿Estás seguro que deseas reactivar a "${staff.nombre} ${staff.apellido}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3182ce',
      cancelButtonColor: '#e53935',
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      if (!staff.cod) return;
      await setStaffActivo(staff.cod, true);
      setStaffList(prev => prev.map(s => s.cod === staff.cod ? { ...s, activo: true } : s));
      MySwal.fire({
        icon: 'success',
        title: 'Reactivado',
        text: 'El miembro del staff ha sido reactivado.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const filteredStaff = staffList.filter(s => showActivos ? s.activo : !s.activo);

  return (
    <div className={styles.wrapper}>
      <SlideBoard />
      <div className={styles.panelContainer}>
        <div className={styles.header}>
          <h2 className={styles.panelTitle}>Staff del Club</h2>
          <div className={styles.headerActions}>
            <div className={styles.toggleGroup}>
              <button className={`${styles.toggleBtn} ${showActivos ? styles.activeToggle : ''}`} onClick={() => setShowActivos(true)}>Activos</button>
              <button className={`${styles.toggleBtn} ${!showActivos ? styles.activeToggle : ''}`} onClick={() => setShowActivos(false)}>Inactivos</button>
            </div>
            <button className={styles.createBtn} onClick={() => setOpenCreateModal(true)}>
              <FaPlus /> Crear Staff
            </button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.staffTable}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Estado</th>
                <th className={styles.actionsHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map(staff => (
                <tr key={staff.cod}>
                  <td data-label="Foto">
                    {staff.foto ? (
                      <img src={staff.foto} alt={`${staff.nombre} ${staff.apellido}`} className={styles.tableFotoImg} onClick={() => handleOpenImageModal(staff.foto)} />
                    ) : (
                      <div className={styles.tableFotoPlaceholder}>Sin foto</div>
                    )}
                  </td>
                  <td data-label="Nombre">{staff.nombre} {staff.apellido}</td>
                  <td data-label="Cargo">{staff.cargo}</td>
                  <td data-label="Teléfono">{staff.telefono}</td>
                  <td data-label="Email">{staff.email}</td>
                  <td data-label="Estado">{staff.activo ? 'Activo' : 'Inactivo'}</td>
                  <td data-label="Acciones" className={styles.actionsCell}>
                    <div className={styles.buttonGroup}>
                      <button className={`${styles.iconButton} ${styles.viewBtn}`} title="Ver" onClick={() => handleView(staff)}>
                        <FaEye />
                      </button>
                      <button
                        className={`${styles.iconButton} ${styles.editBtn}`}
                        title="Editar"
                        onClick={() => {
                          setStaffToEdit(staff);
                          setOpenEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      {showActivos ? (
                        <button className={`${styles.iconButton} ${styles.deleteBtn}`} title="Eliminar" onClick={() => handleDelete(staff)}>
                          <FaTrash />
                        </button>
                      ) : (
                        <button className={`${styles.iconButton} ${styles.reactivateBtn}`} title="Reactivar" onClick={() => handleReactivate(staff)}>
                          <FaUndo />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron miembros del staff {showActivos ? 'activos' : 'inactivos'}.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <CreateStaffModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onCreated={handleStaffCreated}
        />

        {selectedStaff && (
          <div className={styles.carnetOverlay} onClick={handleCloseModal}>
            <div className={styles.carnetModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Carnet Staff</h2>
                <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.carnetHeader}>
                  {selectedStaff.foto ? (
                    <img
                      src={selectedStaff.foto}
                      alt="Foto Staff"
                      className={styles.staffPhoto}
                      onClick={() => handleOpenImageModal(selectedStaff.foto!)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <div className={styles.staffPhotoPlaceholder}>Sin foto</div>
                  )}
                  <div className={styles.staffInfo}>
                    <h3>{selectedStaff.nombre} {selectedStaff.apellido}</h3>
                    <p>{selectedStaff.cargo}</p>
                  </div>
                </div>

                <div className={styles.modalSection}>
                  <h3>Detalles</h3>
                  <div className={styles.modalDatosGrid}>
                    <div className={styles.modalDatoLabel}>Documento:</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.numeroDocumento ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Fecha de Nacimiento:</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.fechaNacimiento ? new Date(selectedStaff.fechaNacimiento).toLocaleDateString() : 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Nacionalidad:</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.nacionalidad ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Teléfono:</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.telefono ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Email:</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.email ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Equipo</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.equipo?.nombreEquipo ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Categoría</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.categoria?.nombre ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Observaciones:</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.observaciones ?? 'N/A'}</div>
                  </div>
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

        <EditStaffModal
          open={openEditModal}
          staff={staffToEdit}
          onClose={() => setOpenEditModal(false)}
          onSave={handleStaffUpdated}
        />
      </div>
    </div>
  );
};

export default StaffScreen;

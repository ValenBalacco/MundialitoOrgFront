import { useEffect, useState } from 'react';
import styles from './StaffScreen.module.css';
import SlideBoard from '../../ui/SlideBoard/SlideBoard';
import { FaPlus, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import CreateStaffModal from '../../ui/Staff/CreateStaffModal';
import EditStaffModal from '../../ui/Staff/EditStaffModal';
import ImageModal from '../../ui/Equipos/ImageModal';
import { getStaffByClub, setStaffActivo, updateStaff } from '../../../api/staffService';
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
      getStaffByClub(Number(clubId)).then(setStaffList);
    }
  }, []);

  const handleStaffCreated = (nuevoStaff: Staff) => {
    setStaffList(prev => [...prev, nuevoStaff]);
  };

  const handleView = (staff: Staff) => {
    setSelectedStaff(staff);
  };

  const handleCloseModal = () => {
    setSelectedStaff(null);
  };

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
      setStaffList(prev => prev.filter(s => s.cod !== staff.cod));
      MySwal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El staff ha sido eliminado.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <SlideBoard />
      <div className={styles.panelContainer}>
        <div className={styles.header}>
          <h2 className={styles.panelTitle}>Staff del Club</h2>
          <button className={styles.createBtn} onClick={() => setOpenCreateModal(true)}>
            <FaPlus />
            Crear Staff
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.staffTable}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Cargo</th>
                <th className={styles.actionsHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {staffList.filter(s => s.activo).map(staff => (
                <tr key={staff.cod}>
                  <td>
                    {staff.foto ? (
                      <img src={staff.foto} alt={`${staff.nombre} ${staff.apellido}`} className={styles.tableFotoImg} onClick={() => handleOpenImageModal(staff.foto)} />
                    ) : (
                      <div className={styles.tableFotoPlaceholder}>Sin foto</div>
                    )}
                  </td>
                  <td>{staff.nombre} {staff.apellido}</td>
                  <td>{staff.cargo}</td>
                  <td className={styles.actionsCell}>
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
                      <button className={`${styles.iconButton} ${styles.deleteBtn}`} title="Eliminar" onClick={() => handleDelete(staff)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                    <div className={styles.modalDatoLabel}>Equipo</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.equipo?.nombreEquipo ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Categoría</div>
                    <div className={styles.modalDatoValue}>{selectedStaff.categoria?.nombre ?? 'N/A'}</div>
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
          onSave={async (cod, updatedStaff) => {
            await updateStaff(cod, updatedStaff); // GUARDA cambios
            const clubId = localStorage.getItem('clubId');
            if (clubId) {
              const updatedList = await getStaffByClub(Number(clubId)); // RECARGA lista
              setStaffList(updatedList);
            }
          }}
        />
      </div>
    </div>
  );
};

export default StaffScreen;

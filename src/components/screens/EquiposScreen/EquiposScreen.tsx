import { useEffect, useState } from 'react';
import styles from './EquiposScreen.module.css';
import SlideBoard from '../../ui/SlideBoard/SlideBoard';
import { FaPlus, FaTrash, FaEdit, FaEye, FaUserPlus, FaShieldAlt } from 'react-icons/fa';
import CreateEquipoModal from '../../ui/Equipos/CreateEquipoModal';
import SelectPersonModal from '../../ui/SelectPersonModal';
import EditEquipoModal from '../../ui/Equipos/EditEquipoModal';
import ImageModal from '../../ui/Equipos/ImageModal';
import { getEquiposByClub, setEquipoActivo, updateEquipo, getEquipoById, addJugadoresToEquipo, removeJugadoresFromEquipo, addStaffToEquipo, removeStaffFromEquipo } from '../../../api/equiposService';
import { getJugadoresByClub } from '../../../api/jugadorService';
import { getStaffByClub } from '../../../api/staffService';
import { getCategoriasByClub } from '../../../api/categoriaService';
import type { Equipos, Jugador, Staff, Categoria, EquiposDto } from '../../../types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EquiposScreen = () => {
  const [equiposList, setEquiposList] = useState<Equipos[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<Equipos | null>(null);
  const [openJugadorModal, setOpenJugadorModal] = useState(false);
  const [openStaffModal, setOpenStaffModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [equipoToEdit, setEquipoToEdit] = useState<Equipos | null>(null);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipos | null>(null);
  const [jugadoresList, setJugadoresList] = useState<Jugador[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [categoriasList, setCategoriasList] = useState<Categoria[]>([]);

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
      getEquiposByClub(Number(clubId)).then(setEquiposList);
      getJugadoresByClub(Number(clubId)).then(setJugadoresList);
      getStaffByClub(Number(clubId)).then(setStaffList);
      getCategoriasByClub(Number(clubId)).then(setCategoriasList);
    }
  }, []);

  const handleEquipoCreated = (nuevoEquipo: Equipos) => {
    setEquiposList(prev => [...prev, nuevoEquipo]);
  };

  const handleView = (equipo: Equipos) => {
    setSelectedEquipo(equipo);
  };

  const handleCloseModal = () => {
    setSelectedEquipo(null);
  };

  const handleDelete = async (equipo: Equipos) => {
    const result = await MySwal.fire({
      title: '¿Eliminar equipo?',
      text: `¿Estás seguro que deseas eliminar el equipo "${equipo.nombreEquipo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#3182ce',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      if (!equipo.cod) return;
      await setEquipoActivo(equipo.cod, false);
      setEquiposList(prev => prev.filter(eq => eq.cod !== equipo.cod));
      MySwal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El equipo ha sido eliminado.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  //  Función para determinar color de texto según fondo
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
          <h2 className={styles.panelTitle}>Equipos del Club</h2>
          <button className={styles.createBtn} onClick={() => setOpenCreateModal(true)}>
            <FaPlus />
            Crear Equipo
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.equipoTable}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equiposList
                .filter(eq => eq && eq.activo)
                .map((equipo) => (
                  <tr key={equipo.cod}>
                    <td data-label="Nombre">
                      <div className={styles.equipoInfo}>
                        <span className={styles.equipoNombre}>{equipo.nombreEquipo}</span>
                        {equipo.categoria && (
                          <span
                            className={styles.categoriaBadge}
                            style={{
                              backgroundColor: equipo.categoria.color,
                              color: getContrastingTextColor(equipo.categoria.color),
                            }}
                          >
                            {equipo.categoria.nombre}
                          </span>
                        )}
                      </div>
                    </td>
                    <td data-label="Acciones">
                      <div className={styles.buttonGroup}>
                        <button className={`${styles.iconButton} ${styles.deleteBtn}`} title="Eliminar" onClick={() => handleDelete(equipo)}>
                          <FaTrash />
                        </button>
                        <button
                          className={`${styles.iconButton} ${styles.editBtn}`}
                          title="Editar"
                          onClick={() => {
                            setEquipoToEdit(equipo);
                            setOpenEditModal(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button className={`${styles.iconButton} ${styles.viewBtn}`} title="Ver" onClick={() => handleView(equipo)}>
                          <FaEye />
                        </button>
                        <button
                          className={styles.addBtn}
                          title="Agregar Jugador"
                          onClick={() => {
                            setEquipoSeleccionado(equipo);
                            setOpenJugadorModal(true);
                          }}
                        >
                          <FaUserPlus /> Jugador
                        </button>
                        <button
                          className={styles.addBtn}
                          title="Agregar Staff"
                          onClick={() => {
                            setEquipoSeleccionado(equipo);
                            setOpenStaffModal(true);
                          }}
                        >
                          <FaShieldAlt /> Staff
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <CreateEquipoModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onCreated={handleEquipoCreated}
        />

        {selectedEquipo && (
          <div className={styles.carnetOverlay} onClick={handleCloseModal}>
            <div className={styles.carnetModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Detalles del Equipo</h2>
                <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.modalSection}>
                  <h3>Información General</h3>
                  <div className={styles.modalDatosGrid}>
                    <div className={styles.modalDatoLabel}>Nombre</div>
                    <div className={styles.modalDatoValue}>{selectedEquipo.nombreEquipo}</div>
                    <div className={styles.modalDatoLabel}>Nombre corto</div>
                    <div className={styles.modalDatoValue}>{selectedEquipo.corto}</div>
                    <div className={styles.modalDatoLabel}>Grupo</div>
                    <div className={styles.modalDatoValue}>{selectedEquipo.grupo}</div>
                    <div className={styles.modalDatoLabel}>Categoría</div>
                    <div className={styles.modalDatoValue}>{selectedEquipo.categoria?.nombre ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Club</div>
                    <div className={styles.modalDatoValue}>{selectedEquipo.club?.nombre ?? 'N/A'}</div>
                  </div>
                </div>
                <div className={styles.modalSection}>
                  <h3>Fotos</h3>
                  <div className={styles.modalFotosRow}>
                    {selectedEquipo.fotoEquipo ? <img src={selectedEquipo.fotoEquipo} className={styles.modalFotoImg} onClick={() => handleOpenImageModal(selectedEquipo.fotoEquipo!)} /> : <div className={styles.modalFotoPlaceholder}>Equipo</div>}
                    {selectedEquipo.fotoEquipacion1 ? <img src={selectedEquipo.fotoEquipacion1} className={styles.modalFotoImg} onClick={() => handleOpenImageModal(selectedEquipo.fotoEquipacion1!)} /> : <div className={styles.modalFotoPlaceholder}>Equipación 1</div>}
                    {selectedEquipo.fotoEquipacion2 ? <img src={selectedEquipo.fotoEquipacion2} className={styles.modalFotoImg} onClick={() => handleOpenImageModal(selectedEquipo.fotoEquipacion2!)} /> : <div className={styles.modalFotoPlaceholder}>Equipación 2</div>}
                  </div>
                </div>
                <div className={styles.modalSection}>
                  <h3>Jugadores</h3>
                  <table className={styles.modalTable}>
                    <thead><tr><th>Foto</th><th>Nombre</th><th>Número</th><th>Demarcación</th></tr></thead>
                    <tbody>
                      {selectedEquipo.jugadores?.length ? selectedEquipo.jugadores.map(j => (
                        <tr key={j.cod}>
                          <td>
                            {j.foto ? (
                              <img src={j.foto} alt={`${j.nombre} ${j.apellido}`} className={styles.tableFotoImg} onClick={() => handleOpenImageModal(j.foto)} />
                            ) : (
                              <div className={styles.tableFotoPlaceholder}>Sin foto</div>
                            )}
                          </td>
                          <td>{j.nombre} {j.apellido}</td>
                          <td>{j.numeroCamiseta}</td>
                          <td>{j.demarcacion}</td>
                        </tr>
                      )) : <tr><td colSpan={4} className={styles.modalTableEmpty}>No hay jugadores</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className={styles.modalSection}>
                  <h3>Staff</h3>
                  <table className={styles.modalTable}>
                    <thead><tr><th>Foto</th><th>Nombre</th><th>Cargo</th></tr></thead>
                    <tbody>
                      {selectedEquipo.staff?.length ? selectedEquipo.staff.map(s => (
                        <tr key={s.cod}>
                          <td>
                            {s.foto ? (
                              <img src={s.foto} alt={`${s.nombre} ${s.apellido}`} className={styles.tableFotoImg} onClick={() => handleOpenImageModal(s.foto)} />
                            ) : (
                              <div className={styles.tableFotoPlaceholder}>Sin foto</div>
                            )}
                          </td>
                          <td>{s.nombre} {s.apellido}</td>
                          <td>{s.cargo}</td>
                        </tr>
                      )) : <tr><td colSpan={3} className={styles.modalTableEmpty}>No hay staff</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modales de selección y edición */}
        <SelectPersonModal
          open={openJugadorModal}
          onClose={() => setOpenJugadorModal(false)}
          title="Selecciona jugadores"
          items={jugadoresList.map(j => ({ id: j.cod, nombre: [j.nombre, j.apellido].filter(Boolean).join(' '), foto: j.foto }))}
          existingIds={equipoSeleccionado?.jugadores?.map(j => j.cod) ?? []}
          onSave={async (newIds) => {
            if (equipoSeleccionado) {
                const existingIds = equipoSeleccionado.jugadores?.map(j => j.cod) ?? [];
                const idsToAdd = newIds.filter(id => !existingIds.includes(id));
                const idsToRemove = existingIds.filter(id => !newIds.includes(id));

                if (idsToAdd.length > 0) {
                    await addJugadoresToEquipo(equipoSeleccionado.cod, idsToAdd);
                }
                if (idsToRemove.length > 0) {
                    await removeJugadoresFromEquipo(equipoSeleccionado.cod, idsToRemove);
                }

                const equipoActualizado = await getEquipoById(equipoSeleccionado.cod);
                setEquiposList(prev => prev.map(eq => eq.cod === equipoSeleccionado.cod ? equipoActualizado! : eq));
                setEquipoSeleccionado(equipoActualizado);
                if (selectedEquipo && equipoActualizado) {
                    setSelectedEquipo(equipoActualizado);
                }
            }
          }}
        />

        <SelectPersonModal
          open={openStaffModal}
          onClose={() => setOpenStaffModal(false)}
          title="Selecciona staff"
          items={staffList.map(s => ({ id: s.cod, nombre: [s.nombre, s.apellido].filter(Boolean).join(' '), foto: s.foto }))}
          existingIds={equipoSeleccionado?.staff?.map(s => s.cod) ?? []}
          onSave={async (newIds) => {
            if (equipoSeleccionado) {
                const existingIds = equipoSeleccionado.staff?.map(s => s.cod) ?? [];
                const idsToAdd = newIds.filter(id => !existingIds.includes(id));
                const idsToRemove = existingIds.filter(id => !newIds.includes(id));

                if (idsToAdd.length > 0) {
                    await addStaffToEquipo(equipoSeleccionado.cod, idsToAdd);
                }
                if (idsToRemove.length > 0) {
                    await removeStaffFromEquipo(equipoSeleccionado.cod, idsToRemove);
                }

                const equipoActualizado = await getEquipoById(equipoSeleccionado.cod);
                setEquiposList(prev => prev.map(eq => eq.cod === equipoSeleccionado.cod ? equipoActualizado! : eq));
                setEquipoSeleccionado(equipoActualizado);
                if (selectedEquipo && equipoActualizado) {
                    setSelectedEquipo(equipoActualizado);
                }
            }
          }}
        />

        <EditEquipoModal
          open={openEditModal}
          equipo={equipoToEdit}
          categoriasList={categoriasList}
          onClose={() => setOpenEditModal(false)}
          onSave={async (cod, equipoDto) => {
            await updateEquipo(cod, equipoDto);
            const equipoActualizado = await getEquipoById(cod);
            setEquiposList(prev => prev.map(eq => eq.cod === cod ? equipoActualizado! : eq));
          }}
        />

        <ImageModal
          isOpen={imageModalOpen}
          onClose={handleCloseImageModal}
          imageUrl={selectedImageUrl}
        />
      </div>
    </div>
  );
};

export default EquiposScreen;

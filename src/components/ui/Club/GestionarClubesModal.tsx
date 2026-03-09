import { useEffect, useState } from 'react';
import type { Clubes, Usuario } from '../../../types';
import { getClubes, updateClub } from '../../../api/clubesService';
import { getUsuarios, updateUsuario } from '../../../api/usuarioService';
import styles from './Modal.module.css';
import { MdClose, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import EditClubModal from '../Club/EditClubModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Props {
  open: boolean;
  onClose: () => void;
}

const GestionarClubesModal = ({ open, onClose }: Props) => {
  const [clubes, setClubes] = useState<Clubes[]>([]);
  const [clubToEdit, setClubToEdit] = useState<Clubes | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Clubes | null>(null);

  const fetchClubes = async () => {
    const data = await getClubes();
    setClubes(data);
  };

  useEffect(() => {
    if (open) {
      fetchClubes();
    }
  }, [open]);

  const handleEdit = (club: Clubes) => {
    setClubToEdit(club);
    setIsEditModalOpen(true);
  };

  const handleSave = async (cod: number, updatedClub: Clubes) => {
    await updateClub(cod, updatedClub);
    fetchClubes();
    setIsEditModalOpen(false);
  };

  const handleDelete = async (club: Clubes) => {
    const result = await MySwal.fire({
      title: '¿Desactivar club?',
      text: `¿Estás seguro que deseas desactivar el club "${club.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#1976d2',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      await updateClub(club.cod, { ...club, activo: false });

      // Desasociar usuarios del club
      const todosLosUsuarios = await getUsuarios();
      const usuariosDelClub = todosLosUsuarios.filter(u => u.club?.cod === club.cod);

      for (const usuario of usuariosDelClub) {
        // El backend espera null para desasociar
        await updateUsuario(usuario.id, { ...usuario, club: undefined });
      }

      fetchClubes();
      MySwal.fire('Desactivado', 'El club ha sido desactivado.', 'success');
    }
  };

  if (!open) return null;

  return (
    <>
      <div className={styles.darkOverlay}>
        <div className={styles.darkModal} style={{ minWidth: '800px' }}>
          <button className={styles.closeIcon} onClick={onClose}>
            <MdClose size={28} />
          </button>
          <h3 className={styles.darkTitle}>Gestionar Clubes</h3>
          <div className={styles.tableContainer}>
            <table className={styles.staffTable}>
              <thead>
                <tr>
                  <th>Escudo</th>
                  <th>Nombre</th>
                  <th>Localidad</th>
                  <th>Responsable</th>
                  <th>Activo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clubes.map(club => (
                  <tr key={club.cod}>
                    <td>
                      {club.escudo && <img src={club.escudo} alt={`Escudo de ${club.nombre}`} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />}
                    </td>
                    <td className={styles.staffName}>{club.nombre}</td>
                    <td>{club.localidad}</td>
                    <td>{club.responsable}</td>
                    <td>{club.activo ? 'Sí' : 'No'}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button className={styles.editBtn} title="Editar" onClick={() => handleEdit(club)}>
                          <MdEdit size={20} />
                        </button>
                        {club.activo && (
                          <button className={styles.deleteBtn} title="Desactivar" onClick={() => handleDelete(club)}>
                            <MdDelete size={20} />
                          </button>
                        )}
                        <button className={styles.viewBtn} title="Ver" onClick={() => setSelectedClub(club)}>
                          <MdVisibility size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditClubModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          club={clubToEdit}
          onSave={handleSave}
        />
      )}

      {selectedClub && (
        <div className={styles.darkOverlay} onClick={() => setSelectedClub(null)}>
          <div className={styles.darkModal} onClick={e => e.stopPropagation()} style={{ minWidth: 600 }}>
            <button className={styles.closeIcon} onClick={() => setSelectedClub(null)}>
              <MdClose size={28} />
            </button>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                {selectedClub.escudo && <img src={selectedClub.escudo} alt={`Escudo de ${selectedClub.nombre}`} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />}
                <h3 className={styles.darkTitle}>{selectedClub.nombre}</h3>
            </div>
            <div className={styles.clubDetailsView}>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>País</span>
                <span className={styles.detailItemValue}>{selectedClub.pais}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Localidad</span>
                <span className={styles.detailItemValue}>{selectedClub.localidad}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Responsable</span>
                <span className={styles.detailItemValue}>{selectedClub.responsable || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Email</span>
                <span className={styles.detailItemValue}>{selectedClub.email || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Teléfono Club</span>
                <span className={styles.detailItemValue}>{selectedClub.telefonoClub || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Teléfono Responsable</span>
                <span className={styles.detailItemValue}>{selectedClub.telefonoResponsable || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Fax Club</span>
                <span className={styles.detailItemValue}>{selectedClub.faxClub || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Idioma de Contacto</span>
                <span className={styles.detailItemValue}>{selectedClub.idiomaContacto || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Activo</span>
                <span className={styles.detailItemValue}>{selectedClub.activo ? 'Sí' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GestionarClubesModal;
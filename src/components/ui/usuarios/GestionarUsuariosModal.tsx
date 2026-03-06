import { useEffect, useState } from 'react';
import type { Usuario } from '../../../types';
import { getUsuarios, updateUsuario } from '../../../api/usuarioService';
import styles from './Modal.module.css';
import { MdClose, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import EditUsuarioModal from './EditUsuarioModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Props {
  open: boolean;
  onClose: () => void;
}

const GestionarUsuariosModal = ({ open, onClose }: Props) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    if (open) {
      fetchUsuarios();
    }
  }, [open]);

  const handleEdit = (usuario: Usuario) => {
    setUsuarioToEdit(usuario);
    setIsEditModalOpen(true);
  };

  const handleSave = async (id: number, updatedUsuario: Usuario) => {
    await updateUsuario(id, updatedUsuario);
    fetchUsuarios();
    setIsEditModalOpen(false);
  };

  const handleDelete = async (usuario: Usuario) => {
    const result = await MySwal.fire({
      title: '¿Desactivar usuario?',
      text: `¿Estás seguro que deseas desactivar al usuario "${usuario.username}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#1976d2',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      await updateUsuario(usuario.id, { ...usuario, activo: false });
      fetchUsuarios();
      MySwal.fire('Desactivado', 'El usuario ha sido desactivado.', 'success');
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
          <h3 className={styles.darkTitle}>Gestionar Usuarios</h3>
          <div className={styles.tableContainer}>
            <table className={styles.staffTable}>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Club</th>
                  <th>Activo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td className={styles.staffName}>{usuario.username}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.club?.nombre || 'N/A'}</td>
                    <td>{usuario.activo ? 'Sí' : 'No'}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={styles.editBtn}
                          title="Editar"
                          onClick={() => handleEdit(usuario)}
                        >
                          <MdEdit size={20} />
                        </button>
                        {usuario.activo && (
                          <button
                            className={styles.deleteBtn}
                            title="Desactivar"
                            onClick={() => handleDelete(usuario)}
                          >
                            <MdDelete size={20} />
                          </button>
                        )}
                        <button
                          className={styles.viewBtn}
                          title="Ver"
                          onClick={() => setSelectedUsuario(usuario)}
                        >
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

      {isEditModalOpen && usuarioToEdit && (
        <EditUsuarioModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          usuario={usuarioToEdit}
          onSave={handleSave}
        />
      )}

      {selectedUsuario && (
        <div className={styles.darkOverlay} onClick={() => setSelectedUsuario(null)}>
          <div
            className={styles.darkModal}
            onClick={e => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <button className={styles.closeIcon} onClick={() => setSelectedUsuario(null)}>
              <MdClose size={28} />
            </button>
            <h3 className={styles.darkTitle}>{selectedUsuario.username}</h3>
            <div className={styles.clubDetailsView} style={{ gridTemplateColumns: '1fr' }}>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Rol</span>
                <span className={styles.detailItemValue}>{selectedUsuario.rol}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Club</span>
                <span className={styles.detailItemValue}>
                  {selectedUsuario.club?.nombre || 'Ninguno'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailItemLabel}>Activo</span>
                <span className={styles.detailItemValue}>
                  {selectedUsuario.activo ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GestionarUsuariosModal;

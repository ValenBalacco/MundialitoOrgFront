import { useEffect, useState } from "react";
import type { Jugador } from "../../../types";
import styles from "./Modal.module.css";
import { MdClose, MdPhotoCamera } from "react-icons/md";
import { uploadToCloudinary } from "../../../utils/cloudinary";

interface Props {
  open: boolean;
  jugador: Jugador | null;
  onClose: () => void;
  onSave: (cod: number, jugador: Jugador) => Promise<void>;
}

const EditJugadorModal = ({ open, jugador, onClose, onSave }: Props) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [numeroCamiseta, setNumeroCamiseta] = useState<number>(0);
  const [demarcacion, setDemarcacion] = useState("");
  const [foto, setFoto] = useState("");
  const [goles, setGoles] = useState<number>(0);
  const [amarilla, setAmarilla] = useState<number>(0);
  const [tarjetaRoja, setTarjetaRoja] = useState<number>(0);
  const [activo, setActivo] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (jugador) {
      const [nombrePart, ...apellidoPart] = jugador.nombre.split(" ");
      setNombre(nombrePart ?? "");
      setApellido(apellidoPart.join(" ") ?? "");
      setFechaNacimiento(jugador.fechaNacimiento ?? "");
      setNumeroDocumento(jugador.numeroDocumento ?? "");
      setNumeroCamiseta(jugador.numeroCamiseta ?? 0);
      setDemarcacion(jugador.demarcacion ?? "");
      setFoto(jugador.foto ?? "");
      setGoles(jugador.goles ?? 0);
      setAmarilla(jugador.amarilla ?? 0);
      setTarjetaRoja(jugador.tarjetaRoja ?? 0);
      setActivo(jugador.activo ?? true);
    }
  }, [jugador, open]);

  if (!open || !jugador) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const imageUrl = await uploadToCloudinary(file);
        setFoto(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nombreCompleto = `${nombre} ${apellido}`.trim();
    const clubId = localStorage.getItem('clubId');

    const updatedJugador: Jugador = {
      cod: jugador.cod,
      nombre: nombreCompleto,
      apellido,
      fechaNacimiento,
      numeroDocumento,
      numeroCamiseta: Number(numeroCamiseta) || 0,
      demarcacion,
      foto,
      goles: Number(goles) || 0,
      amarilla: Number(amarilla) || 0,
      tarjetaRoja: Number(tarjetaRoja) || 0,
      activo,
      equipo: jugador.equipo,
      categoria: jugador.categoria,
      club: clubId ? { cod: Number(clubId) } : undefined,
    } as any;

    await onSave(jugador.cod, updatedJugador);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>

        <h3 className={styles.title}>Editar Jugador</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Apellido</label>
              <input
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Número de camiseta</label>
              <input
                type="number"
                min={0}
                value={numeroCamiseta}
                onChange={(e) =>
                  setNumeroCamiseta(Number(e.target.value) || 0)
                }
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Número de documento</label>
              <input
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Demarcación</label>
              <input
                value={demarcacion}
                onChange={(e) => setDemarcacion(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.fotoField}>
            <label htmlFor="fotoInput" className={styles.fotoLabel}>
              <MdPhotoCamera size={28} />
              <span>Cambiar foto</span>
            </label>
            <input
              id="fotoInput"
              type="file"
              onChange={handleFileChange}
              className={styles.fotoInput}
            />
            {uploading && <p>Cargando imagen...</p>}
            {foto && !uploading && (
              <img src={foto} alt="Vista previa" className={styles.fotoPreview} />
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Goles</label>
              <input
                type="number"
                min={0}
                value={goles}
                onChange={(e) => setGoles(Number(e.target.value) || 0)}
              />
            </div>
            <div className={styles.field}>
              <label>Amarillas</label>
              <input
                type="number"
                min={0}
                value={amarilla}
                onChange={(e) => setAmarilla(Number(e.target.value) || 0)}
              />
            </div>
            <div className={styles.field}>
              <label>Rojas</label>
              <input
                type="number"
                min={0}
                value={tarjetaRoja}
                onChange={(e) => setTarjetaRoja(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className={styles.switchField}>
            <label>
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              Activo
            </label>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={uploading}>
              {uploading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJugadorModal;
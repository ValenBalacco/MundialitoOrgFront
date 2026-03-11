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
  const [lugarNacimiento, setLugarNacimiento] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [numeroCamiseta, setNumeroCamiseta] = useState<number>(0);
  const [demarcacion, setDemarcacion] = useState("");
  const [altura, setAltura] = useState<number>(0);
  const [peso, setPeso] = useState<number>(0);
  const [pieDominante, setPieDominante] = useState("");
  const [foto, setFoto] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [goles, setGoles] = useState<number>(0);
  const [amarilla, setAmarilla] = useState<number>(0);
  const [tarjetaRoja, setTarjetaRoja] = useState<number>(0);
  const [activo, setActivo] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (jugador) {
      setNombre(jugador.nombre ?? "");
      setApellido(jugador.apellido ?? "");
      setFechaNacimiento(jugador.fechaNacimiento ?? "");
      setLugarNacimiento(jugador.lugarNacimiento ?? "");
      setNacionalidad(jugador.nacionalidad ?? "");
      setNumeroDocumento(jugador.numeroDocumento ?? "");
      setTelefono(jugador.telefono ?? "");
      setEmail(jugador.email ?? "");
      setNumeroCamiseta(jugador.numeroCamiseta ?? 0);
      setDemarcacion(jugador.demarcacion ?? "");
      setAltura(jugador.altura ?? 0);
      setPeso(jugador.peso ?? 0);
      setPieDominante(jugador.pieDominante ?? "");
      setFoto(jugador.foto ?? "");
      setObservaciones(jugador.observaciones ?? "");
      setGoles(jugador.goles ?? 0);
      setAmarilla(jugador.amarilla ?? 0);
      setTarjetaRoja(jugador.tarjetaRoja ?? 0);
      setActivo(jugador.activo ?? true);
    }
  }, [jugador]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (open) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

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

    const clubId = localStorage.getItem('clubId');

    const updatedJugador: Jugador = {
      cod: jugador.cod,
      nombre,
      apellido,
      fechaNacimiento,
      lugarNacimiento,
      nacionalidad,
      numeroDocumento,
      telefono,
      email,
      numeroCamiseta: Number(numeroCamiseta) || 0,
      demarcacion,
      altura: Number(altura) || 0,
      peso: Number(peso) || 0,
      pieDominante,
      foto,
      observaciones,
      goles: Number(goles) || 0,
      amarilla: Number(amarilla) || 0,
      tarjetaRoja: Number(tarjetaRoja) || 0,
      activo,
      equipo: jugador.equipo,
      categoria: jugador.categoria,
      club: clubId ? { cod: Number(clubId) } : undefined,
    } as any;

    await onSave(jugador.cod, updatedJugador);
  };

  const isFormInvalid =
    !nombre.trim() ||
    !apellido.trim() ||
    !fechaNacimiento.trim() ||
    !numeroDocumento.trim() ||
    !numeroCamiseta ||
    !demarcacion.trim();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>

        <h3 className={styles.title}>Editar Jugador</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre <span className={styles.required}>*</span></label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Apellido <span className={styles.required}>*</span></label>
              <input
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nro de Documento <span className={styles.required}>*</span></label>
              <input
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Fecha de Nacimiento <span className={styles.required}>*</span></label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Lugar de Nacimiento</label>
              <input value={lugarNacimiento} onChange={(e) => setLugarNacimiento(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Nacionalidad</label>
              <input value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Teléfono</label>
              <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Número de camiseta <span className={styles.required}>*</span></label>
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
              <label>Demarcación <span className={styles.required}>*</span></label>
              <input
                value={demarcacion}
                onChange={(e) => setDemarcacion(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Pie Dominante</label>
              <select value={pieDominante} onChange={(e) => setPieDominante(e.target.value)}>
                <option value="">Seleccionar...</option>
                <option value="Derecho">Derecho</option>
                <option value="Izquierdo">Izquierdo</option>
                <option value="Ambidextro">Ambidextro</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Altura (cm)</label>
              <input type="number" value={altura} onChange={(e) => setAltura(Number(e.target.value) || 0)} />
            </div>
            <div className={styles.field}>
              <label>Peso (kg)</label>
              <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(Number(e.target.value) || 0)} />
            </div>
          </div>

          <div className={styles.fotoField}>
            <label htmlFor="fotoInputEdit" className={styles.fotoLabel}>
              <MdPhotoCamera size={28} />
              <span>Cambiar foto</span>
            </label>
            <input
              id="fotoInputEdit"
              type="file"
              onChange={handleFileChange}
              className={styles.fotoInput}
            />
            {uploading && <p>Cargando imagen...</p>}
            {foto && !uploading && (
              <img src={foto} alt="Vista previa" className={styles.fotoPreview} />
            )}
          </div>

          <textarea className={styles.textarea} placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />

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
            <label style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            <button type="submit" className={styles.saveBtn} disabled={uploading || isFormInvalid}>
              {uploading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJugadorModal;
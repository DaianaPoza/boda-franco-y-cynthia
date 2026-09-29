import camara from '../../assets/camara-album.svg';
import './AlbumColaborativo.css';

// Pegá acá el enlace de la carpeta compartida de Google Drive.
const LINK_ALBUM = 'https://drive.google.com/drive/folders/1ajGOEg1WRU3UImZEcj7dSF_j2bFMPe0K?usp=sharing';

function AlbumColaborativo() {
  return (
    <section className="album" aria-labelledby="album-titulo">
      <div className="album__contenido">
        <h2 className="album__titulo" id="album-titulo">Instantáneas de la noche</h2>
        <span className="album__linea" aria-hidden="true" />

        <img className="album__camara" src={camara} alt="" aria-hidden="true" />

        <p className="album__frase">
        ¡Queremos ver la fiesta desde tus ojos! Compartí tus fotos y videos en nuestro álbum colaborativo
        </p>

        {LINK_ALBUM ? (
          <a
            className="album__boton"
            href={LINK_ALBUM}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Subir fotos y videos a la carpeta compartida (abre en otra pestaña)"
          >
            Subir mis fotos
          </a>
        ) : (
          <span className="album__boton album__boton--pendiente" aria-disabled="true">
            Álbum próximamente
          </span>
        )}
      </div>
    </section>
  );
}

export default AlbumColaborativo;
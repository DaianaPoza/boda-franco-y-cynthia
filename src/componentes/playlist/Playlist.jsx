import './Playlist.css';

// Pegá aquí el enlace de invitación a la playlist colaborativa.
const LINK_PLAYLIST = '';

function Playlist() {
  return (
    <section className="playlist" aria-labelledby="playlist-titulo">
      <div className="playlist__contenido">
        <h2 className="playlist__titulo" id="playlist-titulo">Que no falte tu canción</h2>
        <span className="playlist__linea" aria-hidden="true" />

        <svg className="playlist__icono" viewBox="0 0 64 64" role="img" aria-label="Spotify">
          <circle cx="32" cy="32" r="30" fill="currentColor" />
          <path d="M15 24c12-4 26-2 37 5M17 33c11-3 23-1 33 5M20 41c9-2 19-1 27 4" fill="none" stroke="var(--crema)" strokeWidth="3.7" strokeLinecap="round" />
        </svg>

        <p className="playlist__frase">
          ¿Hay una canción que no puede faltar? Sumala a nuestra playlist
          
        </p>

        {LINK_PLAYLIST ? (
          <a
            className="playlist__boton"
            href={LINK_PLAYLIST}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Agregar una canción a la playlist en Spotify (abre en otra pestaña)"
          >
            Agregar canción
          </a>
        ) : (
          <span className="playlist__boton playlist__boton--pendiente" aria-disabled="true">
            Playlist próximamente
          </span>
        )}
      </div>
    </section>
  );
}

export default Playlist;
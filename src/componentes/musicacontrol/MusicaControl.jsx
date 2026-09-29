import './MusicaControl.css';

function MusicaControl({ sonando, onAlternar }) {
  return (
    <button
      className="musica-control"
      type="button"
      onClick={onAlternar}
      aria-label={sonando ? 'Pausar música' : 'Reproducir música'}
      aria-pressed={sonando}
      title={sonando ? 'Pausar música' : 'Reproducir música'}
    >
      <svg
        className="musica-control__icono"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {sonando ? (
          <>
            <path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" />
        )}
      </svg>
    


    
    </button>
  );
}

export default MusicaControl;
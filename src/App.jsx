import { useRef, useState } from 'react';
import Portada from './componentes/portada/Portada';
import Contenido from './componentes/contenido/Contenido';
import MusicaControl from './componentes/musicaControl/MusicaControl';
import cancion from './assets/cancion.mp3';
import './App.css';

function App() {
  // 'portada' → 'saliendo' → 'contenido'
  const [etapa, setEtapa] = useState('portada');
  const [sonando, setSonando] = useState(false);
  const audioRef = useRef(null);

  const handleIngresar = () => {
    if (etapa !== 'portada') return;

    if (audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => setSonando(false));
    }

    setEtapa('saliendo');
    window.setTimeout(() => {
      setEtapa('contenido');
      window.scrollTo(0, 0);
    }, 900);
  };

  const handleAlternarMusica = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => setSonando(false));
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={cancion}
        loop
        preload="auto"
        onPlay={() => setSonando(true)}
        onPause={() => setSonando(false)}
      />

      {etapa !== 'contenido' && (
        <Portada onIngresar={handleIngresar} saliendo={etapa === 'saliendo'} />
      )}

      {etapa === 'contenido' && (
        <>
          <Contenido />
          <MusicaControl sonando={sonando} onAlternar={handleAlternarMusica} />
        </>
      )}
    </>
  );
}

export default App;
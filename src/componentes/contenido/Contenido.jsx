import Hero from '../hero/Hero';
import './Contenido.css';
import CuentaRegresiva from '../cuentaRegresiva/CuentaRegresiva';
import Ubicacion from '../ubicacion/Ubicacion';
import DressCode from '../dresscode/DressCode';
import Regalos from '../regalos/Regalos';
import Playlist from '../playlist/Playlist';
import AlbumColaborativo from '../albumcolaborativo/AlbumColaborativo';
import Confirmacion from '../confirmacion/Confirmacion';
import Footer from '../footer/Footer';
import './AparicionSecciones.css';
import useAparicionSecciones from './useAparicionSecciones';

function Contenido() {
 const contenidoRef = useAparicionSecciones();


  return (
    <main className="contenido" ref={contenidoRef}>
    <Hero />
    <CuentaRegresiva />
    <Ubicacion />
    <DressCode/>
    <Regalos/>
    <Playlist/>
    <AlbumColaborativo/>
    <Confirmacion/>
    <Footer/>


    </main>
  );
}

export default Contenido;
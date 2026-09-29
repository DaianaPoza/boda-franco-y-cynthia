import fotoPortada from '../../assets/foto-portada.jpg';
import './Portada.css';

function Portada({ onIngresar, saliendo }) {
  return (
    <section className={`portada ${saliendo ? 'portada--saliendo' : ''}`}>
      <img className="portada__fondo" src={fotoPortada} alt="" aria-hidden="true" />

      <div className="portada__tarjeta">
        <div className="portada__marco">
          <img
            className="portada__foto"
            src={fotoPortada}
            alt="Cynthia y Franco en Venecia"
          />
        </div>

        <div className="portada__contenido">
          <h1 className="portada__nombres">Cynthia y Franco</h1>
          <div className="portada__linea" aria-hidden="true" />
          <p className="portada__subtitulo">¡Te invitamos a celebrar!</p>

          <button
            className="portada__boton"
            type="button"
            onClick={onIngresar}
            disabled={saliendo}
          >
            Abrir invitación
          </button>
        </div>
      </div>
    </section>
  );
}

export default Portada;
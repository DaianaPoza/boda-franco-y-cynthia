import { useState } from 'react';
import './Regalos.css';

// Completá estos valores cuando Cynthia y Franco te pasen sus datos.
const DATOS_BANCARIOS = {
  alias: 'Boda.cyn.fran',
  cbu: '0140460303620753332961',
};

function Regalos() {
  const [mostrarDatos, setMostrarDatos] = useState(false);
  const [copiado, setCopiado] = useState('');
  const datosDisponibles = Boolean(DATOS_BANCARIOS.alias || DATOS_BANCARIOS.cbu);

  const copiarDato = async (tipo, valor) => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(tipo);
      window.setTimeout(() => setCopiado(''), 2500);
    } catch {
      setCopiado('error');
    }
  };

  return (
    <section className="regalos" aria-labelledby="regalos-titulo">
      <div className="regalos__contenido">
        <h2 className="regalos__titulo" id="regalos-titulo">
          Nuestra próxima aventura
        </h2>
        <span className="regalos__linea" aria-hidden="true" />

        <svg className="regalos__icono" viewBox="0 0 80 74" fill="none" aria-hidden="true">
          <path d="M9 31h62v37H9V31ZM5 22h70v11H5V22ZM40 22v46" />
          <path d="M40 21C29 20 19 17 19 9c0-6 6-8 11-5 6 4 8 10 10 17ZM40 21c11-1 21-4 21-12 0-6-6-8-11-5-6 4-8 10-10 17Z" />
        </svg>

        <p className="regalos__frase">
          Si querés, podes ayudarnos <br /> a sumar unos kilómetros <br />para nuestra luna de miel...
        </p>

        <button
          className="regalos__boton"
          type="button"
          onClick={() => setMostrarDatos((anterior) => !anterior)}
          aria-expanded={mostrarDatos}
          aria-controls="regalos-datos"
        >
          {mostrarDatos ? 'Ocultar datos' : 'Ver datos'}
        </button>

        {mostrarDatos && (
          <div className="regalos__datos" id="regalos-datos">
            {datosDisponibles ? (
              Object.entries(DATOS_BANCARIOS)
                .filter(([, valor]) => valor)
                .map(([tipo, valor]) => (
                  <div className="regalos__dato" key={tipo}>
                    <span className="regalos__dato-tipo">{tipo.toUpperCase()}</span>
                    <span className="regalos__dato-valor">{valor}</span>
                    <button
                      type="button"
                      className="regalos__copiar"
                      onClick={() => copiarDato(tipo, valor)}
                      aria-label={`Copiar ${tipo}`}
                    >
                      {copiado === tipo ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                ))
            ) : (
              <p>Los datos para colaborar estarán disponibles pronto.</p>
            )}
            {copiado === 'error' && <p>No se pudo copiar. Podés seleccionar el dato manualmente.</p>}
          </div>
        )}
      </div>
    </section>
  );
}

export default Regalos;
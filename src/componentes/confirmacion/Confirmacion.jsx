import { useState } from 'react';
import './Confirmacion.css';

// En Google Forms: Más (⋮) → Insertar HTML → copiá solamente el src del iframe.
// Ejemplo: https://docs.google.com/forms/d/e/ID_DEL_FORMULARIO/viewform?embedded=true
const URL_FORMULARIO = 'https://docs.google.com/forms/d/e/1FAIpQLSdLDQoQ-nAkxn8WxYEipVF0v4tZQgu6M0jWOac9BJNgcGboPg/viewform?embedded=true';
const URL_FORMULARIO_PUBLICO = URL_FORMULARIO.replace('?embedded=true', '');

function Confirmacion() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <section className="confirmacion" aria-labelledby="confirmacion-titulo">
      <div className="confirmacion__contenido">
        <h2 className="confirmacion__titulo" id="confirmacion-titulo">
          ¿Nos acompañás?
        </h2>
        <span className="confirmacion__linea" aria-hidden="true" />

        <svg className="confirmacion__icono" viewBox="0 0 90 86" fill="none" aria-hidden="true">
          <path d="M19 17h52c5 0 9 4 9 9v46c0 5-4 9-9 9H19c-5 0-9-4-9-9V26c0-5 4-9 9-9Z" />
          <path d="M27 8v18M63 8v18M10 35h70" />
          <path d="m30 57 11 10 21-23" />
        </svg>

        <p className="confirmacion__frase">
          Nos haría muy felices compartir este día con vos.
          Confirmá tu asistencia para que podamos prepararlo todo.
        </p>

        {URL_FORMULARIO ? (
          <button
            className="confirmacion__boton"
            type="button"
            aria-expanded={mostrarFormulario}
            aria-controls="confirmacion-formulario"
            onClick={() => setMostrarFormulario((abierto) => !abierto)}
          >
            {mostrarFormulario ? 'Cerrar formulario' : 'Confirmar asistencia'}
          </button>
        ) : (
          <span className="confirmacion__boton confirmacion__boton--pendiente" aria-disabled="true">
            Confirmación próximamente
          </span>
        )}

        <div id="confirmacion-formulario" hidden={!mostrarFormulario}>
          {mostrarFormulario && (
            <div className="confirmacion__marco">
              <p className="confirmacion__ayuda">
                Si preferís completar el formulario en pantalla completa,
                {' '}
                <a href={URL_FORMULARIO_PUBLICO} target="_blank" rel="noopener noreferrer">
                  abrilo acá
                </a>.
              </p>
              <iframe
                className="confirmacion__iframe"
                src={URL_FORMULARIO}
                title="Formulario para confirmar asistencia"
                loading="lazy"
              >
                Cargando formulario de confirmación…
              </iframe>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Confirmacion;
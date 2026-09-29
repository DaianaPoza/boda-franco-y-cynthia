import './Ubicacion.css';

const lugares = [
  {
    tipo: 'Ceremonia religiosa',
    hora: '18:00 hs',
    nombre: 'Iglesia Nuestra Señora de Luján',
    ciudad: 'Bahía Blanca',
    icono: 'anillos',
    busqueda: 'Iglesia Nuestra Señora de Luján, Bahía Blanca, Argentina',
  },
  {
    tipo: 'Celebración',
    hora: '18:45 hs',
    nombre: 'Fuzyon Eventos',
    ciudad: 'Bahía Blanca',
    icono: 'copas',
    busqueda: 'Fuzyon Eventos, Bahía Blanca, Argentina',
  },
];

function Icono({ tipo }) {
  if (tipo === 'anillos') {
    return (
      <svg viewBox="0 0 64 48" fill="none" aria-hidden="true">
        <circle cx="25" cy="22" r="16" />
        <circle cx="40" cy="27" r="16" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 48" fill="none" aria-hidden="true">
      <path d="M9 5h18l-3 20a8 8 0 0 1-7 7 8 8 0 0 1-7-7L9 5ZM17 32v10m-7 0h14" />
      <path d="M37 5h18l-3 20a8 8 0 0 1-7 7 8 8 0 0 1-7-7L37 5ZM45 32v10m-7 0h14" />
    </svg>
  );
}

function Ubicacion() {
  return (
    <section className="ubicacion" aria-labelledby="ubicacion-titulo">
      <div className="ubicacion__contenido">
        <h2 className="ubicacion__titulo" id="ubicacion-titulo">¡El gran día!</h2>
        <span className="ubicacion__linea" aria-hidden="true" />

        <div className="ubicacion__lugares">
          {lugares.map((lugar) => (
            <article className="ubicacion__lugar" key={lugar.tipo}>
              <span className="ubicacion__icono"><Icono tipo={lugar.icono} /></span>
              <h3 className="ubicacion__tipo">{lugar.tipo}</h3>
              <p className="ubicacion__hora">{lugar.hora}</p>
              <p className="ubicacion__nombre">{lugar.nombre}</p>
              <p className="ubicacion__ciudad">{lugar.ciudad}</p>

              <a
                className="ubicacion__boton"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar.busqueda)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Cómo llegar a ${lugar.nombre}, ${lugar.ciudad}`}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
                Cómo llegar
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Ubicacion;
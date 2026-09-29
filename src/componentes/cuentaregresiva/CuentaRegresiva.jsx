import { useEffect, useState } from 'react';
import { evento } from '../../data/evento'; // Ajustá la ruta si evento está en otro lugar.
import './CuentaRegresiva.css';

const fechaEvento = new Date(evento.fecha).getTime();

function calcularTiempoRestante() {
  const diferencia = Math.max(0, fechaEvento - Date.now());

  return {
    dias: Math.floor(diferencia / 86_400_000),
    horas: Math.floor((diferencia / 3_600_000) % 24),
    minutos: Math.floor((diferencia / 60_000) % 60),
    segundos: Math.floor((diferencia / 1_000) % 60),
    termino: diferencia === 0,
  };
}

function CuentaRegresiva() {
  const [tiempo, setTiempo] = useState(calcularTiempoRestante);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setTiempo(calcularTiempoRestante());
    }, 1_000);

    return () => window.clearInterval(intervalo);
  }, []);

  const unidades = [
    { etiqueta: 'Días', valor: tiempo.dias },
    { etiqueta: 'Horas', valor: tiempo.horas },
    { etiqueta: 'Minutos', valor: tiempo.minutos },
    { etiqueta: 'Segundos', valor: tiempo.segundos },
  ];

  return (
    <section className="cuenta-regresiva" aria-labelledby="cuenta-regresiva-titulo">
      <div className="cuenta-regresiva__contenido">
        <h2 className="cuenta-regresiva__titulo" id="cuenta-regresiva-titulo">
          Cuenta regresiva
        </h2>
        <span className="cuenta-regresiva__linea" aria-hidden="true" />

        <div className="cuenta-regresiva__grid" role="timer" aria-live="off">
          {unidades.map(({ etiqueta, valor }) => (
            <div className="cuenta-regresiva__tarjeta" key={etiqueta}>
              <span className="cuenta-regresiva__numero">
                {etiqueta === 'Días' ? valor : String(valor).padStart(2, '0')}
              </span>
              <span className="cuenta-regresiva__etiqueta">{etiqueta}</span>
            </div>
          ))}
        </div>

        {tiempo.termino && (
          <p className="cuenta-regresiva__mensaje">¡Llegó el gran día!</p>
        )}
      </div>
    </section>
  );
}

export default CuentaRegresiva;
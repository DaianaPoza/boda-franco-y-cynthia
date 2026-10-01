import { useRef, useState } from 'react';
import './Confirmacion.css';

// ⬇️ Pegá entre las comillas la URL de la aplicación web de Apps Script (termina en /exec).
const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbwQuZ_JOgaUdG3aZ1rzO3tlL95wy2t5I6MuGE_o3DrZJ8C5rrX3ggRpHe0sJA4hcGU/exec';

const MAX_PERSONAS = 8;
const TIEMPO_MAXIMO_MS = 25000;

const OPCIONES_MENU = [
  { valor: 'sin_gluten', texto: 'Sin gluten' },
  { valor: 'vegetariano', texto: 'Vegetariano' },
  { valor: 'vegano', texto: 'Vegano' },
  { valor: 'alergias', texto: 'Alergias' },
  { valor: 'otra', texto: 'Otra' },
];

const ERROR_GENERICO =
  'No pudimos confirmar que tu respuesta se haya guardado. Revisá tu conexión e intentá de nuevo. Si el problema sigue, avisales a los novios.';

const asistenteVacio = () => ({ nombre: '', restriccion: '', opciones: [], detalle: '' });

const crearAsistentes = () => Array.from({ length: MAX_PERSONAS }, asistenteVacio);

const necesitaDetalle = (opciones) => opciones.includes('alergias') || opciones.includes('otra');

// Genera un identificador corto y único para cada confirmación (por ejemplo: MG7K2L-1X9QF3).
function crearId() {
  const numero = new Uint32Array(1);
  crypto.getRandomValues(numero);
  return `${Date.now().toString(36)}-${numero[0].toString(36)}`.toUpperCase();
}

function MensajeError({ id, texto }) {
  if (!texto) return null;
  return (
    <p className="confirmacion__error" id={id}>
      {texto}
    </p>
  );
}

// Grupo de botones tipo "píldora" para elegir una sola opción (Sí / No).
function OpcionUnica({ nombre, leyenda, opciones, valor, onCambiar, error, idError }) {
  return (
    <fieldset className="confirmacion__grupo">
      <legend className="confirmacion__etiqueta">{leyenda}</legend>
      <div className="confirmacion__pildoras">
        {opciones.map((opcion) => (
          <label key={opcion.valor} className="confirmacion__pildora">
            <input
              type="radio"
              name={nombre}
              value={opcion.valor}
              checked={valor === opcion.valor}
              onChange={() => onCambiar(opcion.valor)}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? idError : undefined}
            />
            <span>{opcion.texto}</span>
          </label>
        ))}
      </div>
      <MensajeError id={idError} texto={error} />
    </fieldset>
  );
}

function Confirmacion() {
  const [nombre, setNombre] = useState('');
  const [asiste, setAsiste] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [asistentes, setAsistentes] = useState(crearAsistentes);
  const [mensaje, setMensaje] = useState('');
  const [trampa, setTrampa] = useState('');
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState('inicial'); // inicial | enviando | exito | error
  const [aviso, setAviso] = useState('');

  const seccionRef = useRef(null);
  const formRef = useRef(null);
  const envioRef = useRef({ id: '', clave: '' });

  const enviando = estado === 'enviando';
  const cantidadNumero = Number(cantidad) || 0;
  const asistentesVisibles = asistentes.slice(0, cantidadNumero);

  const limpiarError = (clave) => {
    setErrores((previos) => {
      if (!previos[clave]) return previos;
      const nuevos = { ...previos };
      delete nuevos[clave];
      return nuevos;
    });
  };

  const actualizarAsistente = (indice, cambios) => {
    setAsistentes((previos) =>
      previos.map((asistente, i) => (i === indice ? { ...asistente, ...cambios } : asistente)),
    );
  };

  const alternarOpcion = (indice, valor) => {
    const actuales = asistentes[indice].opciones;
    const opciones = actuales.includes(valor)
      ? actuales.filter((opcion) => opcion !== valor)
      : [...actuales, valor];
    actualizarAsistente(indice, { opciones });
    limpiarError(`a${indice}-opciones`);
    if (!necesitaDetalle(opciones)) limpiarError(`a${indice}-detalle`);
  };

  const cambiarAsistencia = (valor) => {
    setAsiste(valor);
    setErrores((previos) => (previos.nombre ? { nombre: previos.nombre } : {}));
    setAviso('');
  };

  const validar = () => {
    const nuevos = {};
    if (nombre.trim().length < 2) nuevos.nombre = 'Escribí tu nombre y apellido.';
    if (!asiste) nuevos.asiste = 'Elegí si vas a asistir.';

    if (asiste === 'si') {
      if (!cantidadNumero) nuevos.cantidad = 'Elegí cuántas personas asistirán.';

      asistentesVisibles.forEach((asistente, i) => {
        if (i > 0 && asistente.nombre.trim().length < 2) {
          nuevos[`a${i}-nombre`] = 'Escribí el nombre y apellido del acompañante.';
        }
        if (!asistente.restriccion) {
          nuevos[`a${i}-restriccion`] = 'Indicá si tiene restricciones alimentarias.';
        }
        if (asistente.restriccion === 'si') {
          if (asistente.opciones.length === 0) {
            nuevos[`a${i}-opciones`] = 'Elegí al menos una opción.';
          }
          if (necesitaDetalle(asistente.opciones) && asistente.detalle.trim().length < 2) {
            nuevos[`a${i}-detalle`] = 'Contanos el detalle de la alergia o restricción.';
          }
        }
      });
    }
    return nuevos;
  };

  const armarDatos = () => {
    const base = {
      nombre: nombre.trim(),
      asiste,
      mensaje: mensaje.trim(),
      sitio_web: trampa,
    };

    if (asiste === 'no') return { ...base, cantidad: 0, asistentes: [] };

    return {
      ...base,
      cantidad: cantidadNumero,
      asistentes: asistentesVisibles.map((asistente, i) => {
        const tieneRestriccion = asistente.restriccion === 'si';
        return {
          nombre: i === 0 ? nombre.trim() : asistente.nombre.trim(),
          restriccion: asistente.restriccion,
          opciones: tieneRestriccion ? asistente.opciones : [],
          detalle:
            tieneRestriccion && necesitaDetalle(asistente.opciones) ? asistente.detalle.trim() : '',
        };
      }),
    };
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    if (enviando) return;

    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setEstado('inicial');
      setAviso('Revisá los campos marcados antes de enviar.');
      requestAnimationFrame(() => {
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    if (!URL_APPS_SCRIPT) {
      setEstado('error');
      setAviso('El formulario todavía no está conectado a la planilla (falta la URL de Apps Script).');
      return;
    }

    const datos = armarDatos();

    // Si se reintenta con los mismos datos, se reutiliza el mismo ID.
    // Así, si el primer intento sí se guardó, la planilla no lo duplica.
    const clave = JSON.stringify(datos);
    if (envioRef.current.clave !== clave) {
      envioRef.current = { id: crearId(), clave };
    }

    setEstado('enviando');
    setAviso('');

    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);

    try {
      const respuesta = await fetch(URL_APPS_SCRIPT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...datos, id: envioRef.current.id }),
        signal: controlador.signal,
      });

      let resultado = null;
      try {
        resultado = await respuesta.json();
      } catch {
        resultado = null;
      }

      if (respuesta.ok && resultado?.ok === true) {
        setEstado('exito');
        requestAnimationFrame(() => {
          seccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }

      setEstado('error');
      setAviso(resultado?.error || ERROR_GENERICO);
    } catch (error) {
      setEstado('error');
      setAviso(
        error.name === 'AbortError'
          ? 'La conexión tardó demasiado y no pudimos confirmar el envío. Intentá de nuevo.'
          : ERROR_GENERICO,
      );
    } finally {
      clearTimeout(temporizador);
    }
  };

  const reiniciar = () => {
    setNombre('');
    setAsiste('');
    setCantidad('');
    setAsistentes(crearAsistentes());
    setMensaje('');
    setTrampa('');
    setErrores({});
    setAviso('');
    setEstado('inicial');
    envioRef.current = { id: '', clave: '' };
  };

  const primerNombre = nombre.trim().split(' ')[0];

  return (
    <section
      className="confirmacion"
      id="confirmacion"
      aria-labelledby="confirmacion-titulo"
      ref={seccionRef}
    >
      <div className="confirmacion__contenido">
        <h2 className="confirmacion__titulo" id="confirmacion-titulo">
          Confirmá tu asistencia
        </h2>
        <span className="confirmacion__linea" aria-hidden="true" />

        <svg className="confirmacion__icono" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="25" cy="36" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="39" cy="36" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M34 14l5-6 5 6-5 5z" fill="none" stroke="var(--dorado)" strokeWidth="2" strokeLinejoin="round" />
        </svg>

        {estado === 'exito' ? (
          <div className="confirmacion__gracias" role="status">
            <p className="confirmacion__gracias-titulo">¡Gracias!</p>
            <p className="confirmacion__frase">
              {asiste === 'si'
                ? `${primerNombre}, recibimos tu confirmación para ${cantidadNumero} ${
                    cantidadNumero === 1 ? 'persona' : 'personas'
                  }. ¡Nos vemos en la fiesta!`
                : `${primerNombre}, gracias por avisarnos. Te vamos a extrañar.`}
            </p>
            <button
              type="button"
              className="confirmacion__boton confirmacion__boton--secundario"
              onClick={reiniciar}
            >
              Enviar otra confirmación
            </button>
          </div>
        ) : (
          <>
            <p className="confirmacion__frase">
              Nos encantaría que seas parte de este día. Contanos si podés acompañarnos.
            </p>

            <form className="confirmacion__formulario" onSubmit={handleSubmit} noValidate ref={formRef}>
              <fieldset className="confirmacion__campos" disabled={enviando}>
                {/* Nombre de quien completa el formulario */}
                <div className="confirmacion__campo">
                  <label className="confirmacion__etiqueta" htmlFor="conf-nombre">
                    Tu nombre y apellido
                  </label>
                  <input
                    id="conf-nombre"
                    className="confirmacion__input"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    placeholder="Ej.: Laura Gómez"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      limpiarError('nombre');
                    }}
                    aria-invalid={errores.nombre ? 'true' : undefined}
                    aria-describedby={errores.nombre ? 'conf-nombre-error' : undefined}
                  />
                  <MensajeError id="conf-nombre-error" texto={errores.nombre} />
                </div>

                {/* ¿Asiste? */}
                <OpcionUnica
                  nombre="asiste"
                  leyenda="¿Vas a asistir?"
                  opciones={[
                    { valor: 'si', texto: 'Sí, asistiré' },
                    { valor: 'no', texto: 'No podré asistir' },
                  ]}
                  valor={asiste}
                  onCambiar={cambiarAsistencia}
                  error={errores.asiste}
                  idError="conf-asiste-error"
                />

                {asiste === 'si' && (
                  <>
                    {/* Cantidad de personas */}
                    <div className="confirmacion__campo">
                      <label className="confirmacion__etiqueta" htmlFor="conf-cantidad">
                        ¿Cuántas personas asistirán en total?
                        <span className="confirmacion__ayuda">Incluyéndote a vos</span>
                      </label>
                      <select
                        id="conf-cantidad"
                        className="confirmacion__select"
                        value={cantidad}
                        onChange={(e) => {
                          setCantidad(e.target.value);
                          limpiarError('cantidad');
                        }}
                        aria-invalid={errores.cantidad ? 'true' : undefined}
                        aria-describedby={errores.cantidad ? 'conf-cantidad-error' : undefined}
                      >
                        <option value="">Elegí una opción</option>
                        {Array.from({ length: MAX_PERSONAS }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n === 1
                              ? '1 persona (solo yo)'
                              : `${n} personas (yo + ${n - 1} ${n - 1 === 1 ? 'acompañante' : 'acompañantes'})`}
                          </option>
                        ))}
                      </select>
                      <MensajeError id="conf-cantidad-error" texto={errores.cantidad} />
                    </div>

                    {/* Un bloque por cada asistente */}
                    {cantidadNumero > 0 && (
                      <div className="confirmacion__asistentes">
                        {asistentesVisibles.map((asistente, i) => {
                          const tieneRestriccion = asistente.restriccion === 'si';
                          const errorOpciones = errores[`a${i}-opciones`];
                          const errorDetalle = errores[`a${i}-detalle`];
                          const errorNombre = errores[`a${i}-nombre`];

                          return (
                            <div className="confirmacion__asistente" key={i}>
                              <p className="confirmacion__asistente-titulo">
                                {i === 0 ? 'Tus datos' : `Acompañante ${i}`}
                              </p>

                              {i === 0 ? (
                                <div className="confirmacion__campo">
                                  <span className="confirmacion__etiqueta">Nombre y apellido</span>
                                  <p className="confirmacion__nombre-fijo">
                                    {nombre.trim() || 'Completá tu nombre arriba'}
                                    <span className="confirmacion__ayuda">Ya lo escribiste arriba, no hace falta repetirlo</span>
                                  </p>
                                </div>
                              ) : (
                                <div className="confirmacion__campo">
                                  <label className="confirmacion__etiqueta" htmlFor={`conf-a${i}-nombre`}>
                                    Nombre y apellido
                                  </label>
                                  <input
                                    id={`conf-a${i}-nombre`}
                                    className="confirmacion__input"
                                    type="text"
                                    maxLength={80}
                                    placeholder="Nombre y apellido"
                                    value={asistente.nombre}
                                    onChange={(e) => {
                                      actualizarAsistente(i, { nombre: e.target.value });
                                      limpiarError(`a${i}-nombre`);
                                    }}
                                    aria-invalid={errorNombre ? 'true' : undefined}
                                    aria-describedby={errorNombre ? `conf-a${i}-nombre-error` : undefined}
                                  />
                                  <MensajeError id={`conf-a${i}-nombre-error`} texto={errorNombre} />
                                </div>
                              )}

                              <OpcionUnica
                                nombre={`restriccion-${i}`}
                                leyenda="¿Tiene restricciones alimentarias?"
                                opciones={[
                                  { valor: 'si', texto: 'Sí' },
                                  { valor: 'no', texto: 'No' },
                                ]}
                                valor={asistente.restriccion}
                                onCambiar={(valor) => {
                                  actualizarAsistente(i, { restriccion: valor });
                                  limpiarError(`a${i}-restriccion`);
                                  limpiarError(`a${i}-opciones`);
                                  limpiarError(`a${i}-detalle`);
                                }}
                                error={errores[`a${i}-restriccion`]}
                                idError={`conf-a${i}-restriccion-error`}
                              />

                              {tieneRestriccion && (
                                <fieldset className="confirmacion__grupo">
                                  <legend className="confirmacion__etiqueta">
                                    Elegí una o varias opciones
                                  </legend>
                                  <div className="confirmacion__pildoras">
                                    {OPCIONES_MENU.map((opcion) => (
                                      <label key={opcion.valor} className="confirmacion__pildora confirmacion__pildora--multiple">
                                        <input
                                          type="checkbox"
                                          checked={asistente.opciones.includes(opcion.valor)}
                                          onChange={() => alternarOpcion(i, opcion.valor)}
                                          aria-invalid={errorOpciones ? 'true' : undefined}
                                          aria-describedby={errorOpciones ? `conf-a${i}-opciones-error` : undefined}
                                        />
                                        <span>{opcion.texto}</span>
                                      </label>
                                    ))}
                                  </div>
                                  <MensajeError id={`conf-a${i}-opciones-error`} texto={errorOpciones} />
                                </fieldset>
                              )}

                              {tieneRestriccion && necesitaDetalle(asistente.opciones) && (
                                <div className="confirmacion__campo">
                                  <label className="confirmacion__etiqueta" htmlFor={`conf-a${i}-detalle`}>
                                    Detalle de alergias u otras restricciones
                                  </label>
                                  <input
                                    id={`conf-a${i}-detalle`}
                                    className="confirmacion__input"
                                    type="text"
                                    maxLength={200}
                                    placeholder="Ej.: alergia al maní, sin lactosa"
                                    value={asistente.detalle}
                                    onChange={(e) => {
                                      actualizarAsistente(i, { detalle: e.target.value });
                                      limpiarError(`a${i}-detalle`);
                                    }}
                                    aria-invalid={errorDetalle ? 'true' : undefined}
                                    aria-describedby={errorDetalle ? `conf-a${i}-detalle-error` : undefined}
                                  />
                                  <MensajeError id={`conf-a${i}-detalle-error`} texto={errorDetalle} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* Mensaje opcional */}
                <div className="confirmacion__campo">
                  <label className="confirmacion__etiqueta" htmlFor="conf-mensaje">
                    Mensaje para los novios
                    <span className="confirmacion__ayuda">Opcional</span>
                  </label>
                  <textarea
                    id="conf-mensaje"
                    className="confirmacion__textarea"
                    maxLength={500}
                    rows={4}
                    placeholder="Escribí unas palabras si querés"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                  />
                </div>

                {/* Campo trampa anti-spam: las personas no lo ven, los robots suelen completarlo */}
                <div className="confirmacion__trampa" aria-hidden="true">
                  <label>
                    No completar este campo
                    <input
                      type="text"
                      name="sitio_web"
                      tabIndex={-1}
                      autoComplete="off"
                      value={trampa}
                      onChange={(e) => setTrampa(e.target.value)}
                    />
                  </label>
                </div>
              </fieldset>

              <div className="confirmacion__acciones">
                {aviso && (
                  <p className="confirmacion__aviso" role="alert">
                    {aviso}
                  </p>
                )}

                <button type="submit" className="confirmacion__boton" disabled={enviando}>
                  {enviando && <span className="confirmacion__spinner" aria-hidden="true" />}
                  {enviando ? 'Enviando…' : 'Enviar confirmación'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default Confirmacion;
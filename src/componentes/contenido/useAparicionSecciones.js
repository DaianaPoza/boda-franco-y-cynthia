import { useEffect, useRef } from 'react';

function useAparicionSecciones() {
  const contenidoRef = useRef(null);

  useEffect(() => {
    const contenedor = contenidoRef.current;

    if (
      !contenedor ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const secciones = Array.from(contenedor.children);

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('aparicion-seccion--visible');
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -24px 0px' },
    );

    secciones.forEach((seccion) => {
      seccion.classList.add('aparicion-seccion');
      observador.observe(seccion);
    });

    return () => {
      observador.disconnect();
      secciones.forEach((seccion) => {
        seccion.classList.remove(
          'aparicion-seccion',
          'aparicion-seccion--visible',
        );
      });
    };
  }, []);

  return contenidoRef;
}

export default useAparicionSecciones;
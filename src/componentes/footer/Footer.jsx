import { useEffect, useRef, useState } from 'react';
import { evento } from '../../data/evento';
import fotoFooter from '../../assets/image-footer3.jpg';
import './Footer.css';

function Footer() {
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = footerRef.current;
    if (!elemento || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`footer-boda${visible ? ' footer-boda--visible' : ''}`}
      aria-labelledby="footer-boda-titulo"
    >
      <div className="footer-boda__foto-contenedor">
        <img
          className="footer-boda__foto"
          src={fotoFooter}
          alt="Cynthia y Franco junto a su hijo, en un paisaje de sierras"
          width="1200"
          height="1600"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="footer-boda__texto">
        <p className="footer-boda__antetitulo">¡Nuestra aventura continúa!</p>
        <span className="footer-boda__linea" aria-hidden="true" />
        <h2 className="footer-boda__titulo" id="footer-boda-titulo">
          <span>Lo que viene...</span> <span>
         es más lindo con ustedes </span>
        </h2>
        <p className="footer-boda__nombres">{evento.nombres}</p>
      </div>
    </footer>
  );
}

export default Footer;
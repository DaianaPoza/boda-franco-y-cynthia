import { useEffect, useRef, useState } from 'react';
import { evento } from '../../data/evento';
import ilustracionFooter from '../../assets/imagen-footer.png';
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
    >
      <div className="footer-boda__texto">
        <p className="footer-boda__antetitulo">Nuestra aventura continúa</p>
        <span className="footer-boda__linea" aria-hidden="true" />
        <h2 className="footer-boda__titulo">Gracias por acompañarnos</h2>
        <p className="footer-boda__nombres">{evento.nombres}</p>
      </div>

      <div className="footer-boda__ilustracion-contenedor">
        <img
          className="footer-boda__ilustracion"
          src={ilustracionFooter}
          alt="La pareja y su hijo caminando juntos hacia el mar"
          loading="lazy"
        />
      </div>
    </footer>
  );
}

export default Footer;
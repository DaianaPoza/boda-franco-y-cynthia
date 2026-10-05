import { evento } from '../../data/evento';
import fotoHero from '../../assets/image-hero2.png';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-nombres">
      <div className="hero__foto-contenedor" aria-hidden="true">
        <img
          className="hero__foto"
          src={fotoHero}
          alt=""
          width="1200"
          height="1600"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="hero__texto">
        <p className="hero__antetitulo">Nos casamos</p>
        <span className="hero__linea" aria-hidden="true" />
        <h1 className="hero__nombres" id="hero-nombres">
          {evento.nombres}
        </h1>
        <p className="hero__fecha">{evento.fechaCorta}</p>
      </div>
    </section>
  );
}

export default Hero;

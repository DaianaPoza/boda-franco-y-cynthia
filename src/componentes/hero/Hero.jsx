import { evento } from '../../data/evento'; // Ajustá esta ruta si guardaste evento en otra carpeta.
import ilustracionHero from '../../assets/imagen-hero.png';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-nombres">
      <div className="hero__texto">
        <p className="hero__antetitulo">Nos casamos</p>
        <span className="hero__linea" aria-hidden="true" />

        <h1 className="hero__nombres" id="hero-nombres">
          {evento.nombres}
        </h1>

        <p className="hero__fecha">{evento.fechaCorta}</p>
      </div>

      <div className="hero__ilustracion-contenedor" aria-hidden="true">
        <img className="hero__ilustracion" src={ilustracionHero} alt="" />
      </div>
    </section>
  );
}

export default Hero;

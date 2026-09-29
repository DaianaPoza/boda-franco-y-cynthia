import vestido from '../../assets/vestido-dresscode-v2.png';
import traje from '../../assets/traje-dresscode-v2.png';
import './DressCode.css';

function DressCode() {
  return (
    <section className="dress-code" aria-labelledby="dress-code-titulo">
      <div className="dress-code__contenido">
        <h2 className="dress-code__titulo" id="dress-code-titulo">Dress code</h2>
        <span className="dress-code__linea" aria-hidden="true" />
        <p className="dress-code__detalle">Elegante Sport</p>

        <div className="dress-code__ilustraciones" aria-hidden="true">
          <img className="dress-code__vestido" src={vestido} alt="" />
          <img className="dress-code__traje" src={traje} alt="" />
        </div>
      </div>
    </section>
  );
}

export default DressCode;
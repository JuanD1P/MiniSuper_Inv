import React from 'react';
import './Inicio.css'; // Importa el archivo CSS
import logo from './Recursos/LOGUITO.png'; // Asegúrate de que la ruta sea correcta


const Inicio = () => {
  return (
    <div className="contenedor">
      {/* Logo */}
      <img src={logo} alt="Logo Mini Super" className="logo" />

      {/* Título */}
      <h1 className="titulo">
        <span>MINI</span> <span className="negrita">SUPER</span>
      </h1>

      {/* Botones */}
      <div className="botones">
        <a href="/Registro" className="boton">Registro</a>
      </div>
    </div>
  );
};

export default Inicio;

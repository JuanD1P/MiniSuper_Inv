import React from 'react';
import './Inicio.css'; // Importa el archivo CSS
import logo from './Recursos/LOGUITO.png'; 


const Inicio = () => {
  return (
    <div className="contenedor">
      {/* Logo */}
      <img src={logo} alt="Logo Mini Super" className="logo" />

      {/* Botones */}
      <div className="botones">
  <a href="/Registro" className="botonregistro">REGISTRO</a>
  <a href="/Venta" className="botonventa">VENDER</a>
  <a href="/Reporte" className="botonreporte">REPORTE</a>

</div>


    </div>
  );
};

export default Inicio;

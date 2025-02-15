import React from 'react';
import './Inicio.css'; // Importa el archivo CSS
import logo from './Recursos/LOGUITO.png'; // Asegúrate de que la ruta sea correcta


const Inicio = () => {
  return (
    <div className="contenedor">
      {/* Logo */}
      <img src={logo} alt="Logo Mini Super" className="logo" />

      {/* Botones */}
      <div className="botones">
   <a href="/Registro" className="boton">REGISTRO</a>
   <a href="/Venta" className="boton">VENDER</a>
   <a href="/Reporte" className="boton">REPORTE</a>
</div>

    </div>
  );
};

export default Inicio;

import React, { useEffect, useState } from 'react';
import "./Reporte.css"; // Importamos los estilos

const Reporte = () => {
  const [fechaHora, setFechaHora] = useState("");

  useEffect(() => {
    const actualizarFechaHora = () => {
      const opciones = { 
        timeZone: "America/Bogota",
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true
      };
      const fecha = new Date().toLocaleString("es-CO", opciones);
      setFechaHora(fecha);
    };

    actualizarFechaHora();
    const intervalo = setInterval(actualizarFechaHora, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="reporte-container">
      {/* Fecha y hora en la parte superior derecha */}
      <div className="fecha-hora">{fechaHora}</div>

      {/* Contenedor del logo y título */}
      <div className="logo-container">
        <img src="/ruta-del-logo.png" alt="Logo" className="logo" />
        <p className="titulo">Reportes</p>
      </div>
    </div>
  );
};

export default Reporte;

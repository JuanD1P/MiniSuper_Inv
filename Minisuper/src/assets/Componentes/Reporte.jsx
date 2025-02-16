import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Reporte.css"; 
import logo from './Recursos/LOGUITO.png';

const Reporte = () => {
  const [fechaHora, setFechaHora] = useState("");
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [stocks, setStocks] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await axios.get("http://localhost:5000/api/productos");
        setProductos(productosResponse.data);

        const lotesResponse = await axios.get("http://localhost:5000/api/lotes");
        setLotes(lotesResponse.data);

        const stocksResponse = await axios.get("http://localhost:5000/api/lotes/stocks");
        setStocks(stocksResponse.data);
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="reporte-container">
      <div className="fecha-hora">{fechaHora}</div>

      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="titulo-container">
        <h1 className="titulo">📋 Reporte de Productos y Lotes</h1>
      </div>

      <div className="tabla-container">
        {/* Tabla de Productos */}
        <h2 className="subtitulo">📦 Productos Registrados</h2>
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock Mínimo</th>
              <th>Distribuidor</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre_Producto}</td>
                <td>{producto.Descripcion}</td>
                <td>${producto.precio}</td>
                <td>{producto.stock_min}</td>
                <td>{producto.distribuidor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tabla de Lotes */}
        <h2 className="subtitulo">📊 Información de Lotes</h2>
        <table className="tabla">
          <thead>
            <tr>
              <th>ID Lote</th>
              <th>Producto</th>
              <th>Stock</th>
              <th>Fecha de Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {lotes.map((lote) => (
              <tr key={lote.id_lote}>
                <td>{lote.id_lote}</td>
                <td>{lote.nombre_Producto}</td>
                <td>{lote.stock}</td>
                <td>{lote.fecha_vencimiento}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tabla de Stocks Totales */}
        <h2 className="subtitulo">📊 Stock Total por Producto</h2>
        <table className="tabla">
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Stock Total</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id_producto}>
                <td>{stock.id_producto}</td>
                <td>{stock.total_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reporte;

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
        const lotesResponse = await axios.get("http://localhost:5000/api/lotes");
        const stocksResponse = await axios.get("http://localhost:5000/api/lotes/stocks");

        const productosConStock = productosResponse.data.map(producto => {
          const stockTotal = stocksResponse.data.find(stock => stock.id_producto === producto.id_producto)?.total_stock || 0;
          return { ...producto, stockTotal };
        });

        setProductos(productosConStock);
        setLotes(lotesResponse.data);
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
        {/* Tabla de Productos con Stock Bajo */}
        <h2 className="subtitulo">⚠️ Productos con Stock Bajo</h2>
        <table className="tabla" style={{ width: 'auto', minWidth: '50%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Stock Mínimo</th>
              <th>Stock Total</th>
              <th>Distribuidor</th>
            </tr>
          </thead>
          <tbody>
            {productos.filter(producto => producto.stockTotal <= producto.stock_min).map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre_Producto}</td>
                <td>{producto.stock_min}</td>
                <td>{producto.stockTotal}</td>
                <td>{producto.distribuidor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tabla de Lotes */}
        <h2 className="subtitulo">📊 Información de Lotes</h2>
        <table className="tabla" style={{ width: 'auto', minWidth: '50%' }}>
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
      </div>
    </div>
  );
};

export default Reporte;

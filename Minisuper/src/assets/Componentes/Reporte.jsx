import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Reporte.css"; 
import logo from './Recursos/LOGUITO.png';

const Reporte = () => {
  const navigate = useNavigate();
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

  // Calcular la fecha actual + 10 días
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + 10);

  // Filtrar lotes que vencen en los próximos 10 días
  const lotesProximosAVencer = lotes.filter((lote) => {
    const fechaVencimiento = new Date(lote.fecha_vencimiento);
    return fechaVencimiento <= fechaLimite;
  }).map(lote => {
    const fechaVencimiento = new Date(lote.fecha_vencimiento);
    const diasRestantes = Math.ceil((fechaVencimiento - new Date()) / (1000 * 60 * 60 * 24));
    return { ...lote, diasRestantes };
  });

  return (
    <div className="reporte-container">
      <div className="fecha-hora">{fechaHora}</div>

      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="titulo-container">
        <h1 className="titulo">
          📋 Reporte de Productos y Lotes
        </h1>
        <button className="boton-inicio" onClick={() => navigate("/")}>
          ⬅
        </button>
      </div>

      <div className="tablas-contenedor">
        <div className="tabla-box">
          <h2 className="subtitulo">⚠️ Productos con Stock Bajo</h2>
          <table className="tabla">
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
        </div>

        <div className="tabla-box">
          <h2 className="subtitulo">⏳ Lotes Próximos a Vencer (Menos de 10 días)</h2>
          <table className="tabla">
            <thead>
              <tr>
                <th>ID Lote</th>
                <th>Producto</th>
                <th>Días para Vencer</th>
              </tr>
            </thead>
            <tbody>
              {lotesProximosAVencer.length > 0 ? (
                lotesProximosAVencer.map((lote) => (
                  <tr key={lote.id_lote}>
                    <td>{lote.id_lote}</td>
                    <td>{lote.nombre_Producto}</td>
                    <td>{lote.diasRestantes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">✅ No hay lotes próximos a vencer</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reporte;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inicio.css';
import logo from './Recursos/LOGUITO.png';

const Inicio = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/productos");
        setProductos(response.data);
      } catch (error) {
        console.error("❌ Error al obtener los productos:", error);
      }
    };

    fetchProductos();
    const interval = setInterval(fetchProductos, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="contenedor">
      {/* Logo en la parte superior */}
      <img src={logo} alt="Logo Mini Super" className="logo" />

      {/* Botones en columna */}
      <div className="botones">
        <a href="/Registro" className="botonregistro">REGISTRO</a>
        <a href="/Venta" className="botonventa">VENDER</a>
        <a href="/Reporte" className="botonreporte">REPORTE</a>
      </div>

      {/* Sección de productos */}
      <div className="productos-container">
        <h2>Productos Registrados</h2>

        {/* Productos Importantes */}
        <h3 className="importante">🟢 Productos Perecederos</h3>
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock Mínimo</th>
              <th>Distribuidor</th>
            </tr>
          </thead>
          <tbody>
            {productos.filter(p => p.categoria === 1).map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre_Producto}</td>
                <td>{producto.Descripcion}</td>
                <td>${producto.precio}</td>
                <td>{producto.stock_min}</td>
                <td>{producto.distribuidor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Productos No Importantes */}
        <h3 className="no-importante">🔴 Productos No Perecederos</h3>
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock Mínimo</th>
              <th>Distribuidor</th>
            </tr>
          </thead>
          <tbody>
            {productos.filter(p => p.categoria === 0).map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre_Producto}</td>
                <td>{producto.Descripcion}</td>
                <td>${producto.precio}</td>
                <td>{producto.stock_min}</td>
                <td>{producto.distribuidor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inicio;

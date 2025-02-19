import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inicio.css';
import logo from './Recursos/LOGUITO.png';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const [productos, setProductos] = useState([]);
  const [stocks, setStocks] = useState({}); 
  const [opcionesVisibles, setOpcionesVisibles] = useState(null); 
  const [busqueda, setBusqueda] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    // Funcion para obtener los productos desde el servidor
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/productos");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    // Funcion para obtener los stocks de los lotes
    const fetchStocks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/lotes/stocks");
        const stocksData = response.data;
        const stockTotal = stocksData.reduce((acc, item) => {
          acc[item.id_producto] = item.total_stock;
          return acc;
        }, {});
        setStocks(stockTotal);
      } catch (error) {
        console.error("Error al obtener los stocks:", error);
      }
    };

    // Llamar a las funciones al montar el componente
    fetchProductos();
    fetchStocks();

    // Actualizar datos cada 5 segundos
    const interval = setInterval(() => {
      fetchProductos();
      fetchStocks();
    }, 5000);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, []);

  // Funcion para eliminar un producto
  const eliminarProducto = async (id_producto) => {
    if (window.confirm("Seguro que quiere eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:5000/api/productos/${id_producto}`);
        setProductos(productos.filter(p => p.id_producto !== id_producto));
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  // Filtrar productos segun el termino de busqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre_Producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="contenedor">
      <img src={logo} alt="Logo Mini Super" className="logo" />

      {/* Navegacion entre secciones */}
      <div className="botones">
        <a href="/Registro" className="botonregistro">REGISTRO</a>
        <a href="/Venta" className="botonventa">VENDER</a>
        <a href="/Reporte" className="botonreporte">REPORTE</a>
      </div>

      {/* Barra de busqueda */}
      <div className="barra-busqueda-container">
        <input 
          type="text" 
          placeholder="Buscar producto..." 
          className="barra-busqueda"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Seccion de productos */}
      <div className="productos-container">
        <h2>Productos Registrados</h2>
        
        {[{ titulo: "Productos Perecederos", categoria: 1 }, { titulo: "Productos No Perecederos", categoria: 0 }].map(({ titulo, categoria }) => (
          <div key={categoria}>
            <h3 className={categoria === 1 ? "importante" : "no-importante"}>{titulo}</h3>
            <table className="tabla-productos">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripcion</th>
                  <th>Precio</th>
                  <th>Stock Minimo</th>
                  <th>Stock Disponible</th>
                  <th>Distribuidor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.filter(p => p.categoria === categoria).map((producto) => (
                  <tr key={producto.id_producto}>
                    <td>{producto.nombre_Producto}</td>
                    <td>{producto.Descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>{`${producto.stock_min} ${producto.unidad_de_medida || ''}`}</td>
                    <td>{`${stocks[producto.id_producto] || 0} ${producto.unidad_de_medida || ''}`}</td>
                    <td>{producto.distribuidor}</td>
                    <td>
                      <button onClick={() => setOpcionesVisibles(opcionesVisibles === producto.id_producto ? null : producto.id_producto)}>
                        Opciones
                      </button>
                      {opcionesVisibles === producto.id_producto && (
                        <div className="opciones">
                          <button onClick={() => navigate(`/editar/${producto.id_producto}`)}>Editar</button>
                          <button onClick={() => eliminarProducto(producto.id_producto)}>Eliminar</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inicio;

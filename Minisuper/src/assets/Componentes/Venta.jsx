import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Venta.css";
import logo from './Recursos/LOGUITO.png';  // Logo
// Estados para almacenar datos y gestionar la interaccion
const Venta = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [errorCantidad, setErrorCantidad] = useState("");
  const [errorVenta, setErrorVenta] = useState(""); 
// useEffect para cargar la lista de productos al montar el componente
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
  }, []);
// Maneja el cambio de seleccion del producto
  const handleProductoChange = async (event) => {
    const productoId = parseInt(event.target.value);
    console.log(`🛒 Producto ID seleccionado: ${productoId}`);

    const producto = productos.find((p) => p.id_producto === productoId);

    if (!producto) {
      console.warn(`⚠️ No se encontró un producto con ID: ${productoId}`);
      setProductoSeleccionado(null);
      setLotes([]);
      return;
    }

    console.log(`✅ Producto encontrado: ${producto.nombre_Producto}`);
    setProductoSeleccionado(producto);
    setLoteSeleccionado(null);
    setCantidad(0); 
    setErrorCantidad(""); 

    try {
      const response = await axios.get(`http://localhost:5000/api/lotes`);
      const lotesFiltrados = response.data.filter(
        (lote) => lote.nombre_Producto?.trim().toLowerCase() === producto.nombre_Producto?.trim().toLowerCase()
      );

      if (lotesFiltrados.length === 0) {
        console.warn("⚠️ No se encontraron lotes para este producto.");
      }

      setLotes(lotesFiltrados);
    } catch (error) {
      console.error("❌ Error al obtener los lotes:", error);
      setLotes([]);
    }
  };
// Maneja la seleccion de un lote
  const handleLoteChange = (event) => {
    const loteId = parseInt(event.target.value);
    const lote = lotes.find((l) => l.id_lote === loteId);
    setLoteSeleccionado(lote);
    setCantidad(0); 
    setErrorCantidad(""); 
  };
// Maneja la entrada de la cantidad
  const handleCantidadChange = (event) => {
    const value = parseInt(event.target.value, 10);

    if (!isNaN(value)) {
      setCantidad(value);

      if (loteSeleccionado && value > loteSeleccionado.stock) {
        setErrorCantidad(`❌ La cantidad no puede ser mayor al stock disponible (${loteSeleccionado.stock}).`);
      } else {
        setErrorCantidad("");
      }
    } else {
      setCantidad(0);
      setErrorCantidad("❌ Ingresa un número válido.");
    }
  };

  // Actualizar el stock en la base de datos
  const actualizarStockLote = async (loteId, cantidadVendida) => {
    try {
      const nuevoStock = loteSeleccionado.stock - cantidadVendida;

      if (nuevoStock < 0) {
        alert("❌ No hay suficiente stock en el lote.");
        return;
      }

      // Actualizar el stock en la base de datos
      const response = await axios.put(`http://localhost:5000/api/lotes/${loteId}`, {
        stock: nuevoStock,
      });

      console.log(`✅ Stock actualizado: ${response.data}`);
    } catch (error) {
      console.error("❌ Error al actualizar el stock:", error);
      setErrorVenta("❌ Error al realizar la venta. Intenta nuevamente.");
      if (error.response) {
        alert(`❌ Error: ${error.response.data.error}`);
      }
    }
  };
// Maneja la logica para realizar una venta
  const handleRealizarVenta = async () => {
    if (loteSeleccionado && cantidad > 0 && cantidad <= loteSeleccionado.stock) {
      if (!productoSeleccionado) {
        console.error("❌ Producto no seleccionado.");
        return; 
      }
      console.log(`Venta realizada: ${cantidad} unidades del producto ${productoSeleccionado.nombre_Producto} (Lote ID: ${loteSeleccionado.id_lote})`);
  // Actualizar el stock del lote en la base de datos
      await actualizarStockLote(loteSeleccionado.id_lote, cantidad);
 // Limpiar el formulario despues de realizar la venta
      setCantidad(0); // Resetear cantidad
      setErrorCantidad(""); 
      setProductoSeleccionado(null); 
      setLoteSeleccionado(null); 
      setLotes([]); 
    } else {
      setErrorCantidad("❌ Por favor, ingrese una cantidad válida para la venta.");
    }
  };

  return (
    <div className="venta-container">
      <img src={logo} alt="Logo Mini Super" className="logo" />
      <h1 className="titulo">🛒 Realizar Venta</h1>

      <div className="venta-form">
        <label htmlFor="producto">Seleccionar Producto:</label>
        <select id="producto" onChange={handleProductoChange}>
          <option value="">-- Seleccione un producto --</option>
          {productos.map((producto) => (
            <option key={producto.id_producto} value={producto.id_producto}>
              {producto.nombre_Producto}
            </option>
          ))}
        </select>
      </div>

      {productoSeleccionado && (
        <div className="producto-detalle">
          <h2>Detalles del Producto</h2>
          <p><strong>ID Producto:</strong> {productoSeleccionado.id_producto}</p>
          <p><strong>Nombre:</strong> {productoSeleccionado.nombre_Producto}</p>
          <p><strong>Precio:</strong> ${productoSeleccionado.precio}</p>
          <p><strong>Unidad de Medida:</strong> {productoSeleccionado.unidad_de_medida}</p>
        </div>
      )}

      {lotes.length > 0 && (
        <div className="lote-seleccion">
          <h2>Seleccionar Lote</h2>
          <select id="lote" onChange={handleLoteChange}>
            <option value="">-- Seleccione un lote --</option>
            {lotes.map((lote) => (
              <option key={lote.id_lote} value={lote.id_lote}>
                {lote.id_lote}
              </option>
            ))}
          </select>
        </div>
      )}

      {loteSeleccionado && (
        <div className="lote-detalle">
          <h2>Detalles del Lote</h2>
          <p><strong>Fecha de Vencimiento:</strong> {loteSeleccionado.fecha_vencimiento}</p>
          <p><strong>Stock Total:</strong> {loteSeleccionado.stock}</p>

          <div className="cantidad-seleccion">
            <label htmlFor="cantidad">Cantidad a Vender:</label>
            <input
              type="number"
              id="cantidad"
              value={cantidad}
              onChange={handleCantidadChange}
              min="1"
              max={loteSeleccionado.stock}
            />
            {errorCantidad && <p className="error">{errorCantidad}</p>}
          </div>

          <button onClick={handleRealizarVenta}>Realizar Venta</button>
          {errorVenta && <p className="error">{errorVenta}</p>} {/* Muestra el error de venta */}
        </div>
      )}
    </div>
  );
};

export default Venta;

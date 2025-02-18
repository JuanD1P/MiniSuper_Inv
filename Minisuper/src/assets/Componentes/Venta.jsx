import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Venta.css";

const Venta = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);

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

  const handleProductoChange = async (event) => {
    const productoId = parseInt(event.target.value);
    console.log(`🛒 Producto ID seleccionado: ${productoId}`);
  
    // 🔍 Verifica si el producto está en la lista
    console.log("📋 Lista de productos:", productos);
  
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
  
    try {
      console.log(`🔎 Buscando lotes para el producto: ${producto.nombre_Producto}`);
  
      const response = await axios.get(`http://localhost:5000/api/lotes`);
      console.log("📦 Lotes obtenidos:", response.data);
  
      const productoNombre = producto?.nombre_Producto?.trim().toLowerCase() || "";
      console.log(`🔍 Nombre del producto seleccionado: '${productoNombre}'`);
  
      const lotesFiltrados = response.data.filter(
        (lote) => lote.nombre_Producto?.trim().toLowerCase() === productoNombre
      );
  
      if (lotesFiltrados.length === 0) {
        console.warn("⚠️ No se encontraron lotes para este producto.");
      } else {
        console.log("✅ Lotes encontrados:", lotesFiltrados);
      }
  
      setLotes(lotesFiltrados);
    } catch (error) {
      console.error("❌ Error al obtener los lotes:", error);
      setLotes([]);
    }
  };
   
  const handleLoteChange = (event) => {
    const loteId = parseInt(event.target.value);
    console.log(`🔢 Lote seleccionado: ${loteId}`);
    const lote = lotes.find((l) => l.id_lote === loteId);
    setLoteSeleccionado(lote);
  };

  return (
    <div className="venta-container">
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
        </div>
      )}
    </div>
  );
};

export default Venta;

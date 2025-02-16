import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Venta.css";

const Venta = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [stockTotal, setStockTotal] = useState(null);

  // Obtener datos de productos y lotes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await axios.get("http://localhost:5000/api/productos");
        const lotesResponse = await axios.get("http://localhost:5000/api/lotes");
        const stocksResponse = await axios.get("http://localhost:5000/api/lotes/stocks");

        // Asociar el stock total a cada producto
        const productosConStock = productosResponse.data.map(producto => {
          const stockTotal = stocksResponse.data.find(stock => stock.id_producto === producto.id_producto)?.total_stock || 0;
          return { ...producto, stockTotal };
        });

        setProductos(productosConStock);
        setLotes(lotesResponse.data);
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  // Manejar selección de producto
  const handleProductoChange = (e) => {
    const idProducto = parseInt(e.target.value);
    const producto = productos.find((p) => p.id_producto === idProducto);
    setProductoSeleccionado(producto);

    // Filtrar lotes del producto seleccionado
    const lotesDelProducto = lotes.filter((lote) => lote.id_producto === idProducto);
    setLotes(lotesDelProducto);
    setLoteSeleccionado(null);
    setStockTotal(producto.stockTotal); // Mostrar el stock total del producto seleccionado
  };

  // Manejar selección de lote
  const handleLoteChange = (e) => {
    const idLote = parseInt(e.target.value);
    const lote = lotes.find((l) => l.id_lote === idLote);
    setLoteSeleccionado(lote);
  };

  return (
    <div className="venta-container">
      <h1>🛒 Realizar Venta</h1>

      {/* Seleccionar Producto */}
      <label>Seleccionar Producto:</label>
      <select onChange={handleProductoChange} value={productoSeleccionado?.id_producto || ""}>
        <option value="">-- Selecciona un Producto --</option>
        {productos.map((producto) => (
          <option key={producto.id_producto} value={producto.id_producto}>
            {producto.nombre_Producto}
          </option>
        ))}
      </select>

      {/* Mostrar detalles del producto */}
      {productoSeleccionado && (
        <div className="producto-detalles">
          <h2>Detalles del Producto</h2>
          <p><strong>ID Producto:</strong> {productoSeleccionado.id_producto}</p>
          <p><strong>Nombre:</strong> {productoSeleccionado.nombre_Producto}</p>
          <p><strong>Precio:</strong> ${productoSeleccionado.precio}</p>
          <p><strong>Unidad de Medida:</strong> {productoSeleccionado.unidad_de_medida}</p>
        </div>
      )}

      {/* Seleccionar Lote (solo si hay lotes disponibles para el producto seleccionado) */}
      {productoSeleccionado && lotes.length > 0 && (
        <>
          <label>Seleccionar Lote:</label>
          <select onChange={handleLoteChange} value={loteSeleccionado?.id_lote || ""}>
            <option value="">-- Selecciona un Lote --</option>
            {lotes.map((lote) => (
              <option key={lote.id_lote} value={lote.id_lote}>
                {lote.id_lote}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Mostrar detalles del lote seleccionado */}
      {loteSeleccionado && (
        <div className="lote-detalles">
          <h2>Detalles del Lote</h2>
          <p>
            <strong>Fecha de Vencimiento:</strong> {new Date(loteSeleccionado.fecha_vencimiento).toISOString().split("T")[0]}
          </p>
          <p><strong>Stock Total:</strong> {stockTotal ?? "No disponible"}</p>
        </div>
      )}
    </div>
  );
};

export default Venta;

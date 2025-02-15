import React, { useState, useEffect } from "react";
import axios from "axios";

const Registro = () => {
  // Estado para el producto
  const [producto, setProducto] = useState({ 
    nombre_Producto: "", 
    Distribuidor: "", 
    Descripcion: ""  
  });

  // Estado para el lote
  const [productos, setProductos] = useState([]); // Lista de productos
  const [lote, setLote] = useState({
    id_producto: "",
    numero_lote: "",
    fecha_vencimiento: "",
  });

  // Obtener los productos existentes al cargar la página
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

  // Manejar cambios en los inputs del producto
  const handleChangeProducto = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  // Manejar cambios en los inputs del lote
  const handleChangeLote = (e) => {
    setLote({ ...lote, [e.target.name]: e.target.value });
  };

  // Enviar datos del producto
  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/productos", producto);
      alert("✅ Producto registrado con éxito!");
      setProducto({ nombre_Producto: "", Distribuidor: "", Descripcion: "" });

      // Actualizar la lista de productos después de agregar uno nuevo
      const response = await axios.get("http://localhost:5000/api/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("❌ Error al registrar el producto:", error);
    }
  };

  // Enviar datos del lote
  const handleSubmitLote = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/lotes", lote);
      alert("✅ Lote registrado con éxito!");
      setLote({ id_producto: "", numero_lote: "", fecha_vencimiento: "" });
    } catch (error) {
      console.error("❌ Error al registrar el lote:", error);
    }
  };

  return (
    <div>
      {/* Formulario de Productos */}
      <h2>waooooo</h2>
      <form onSubmit={handleSubmitProducto}>
        <input
          type="text"
          name="nombre_Producto"
          placeholder="Nombre del producto"
          value={producto.nombre_Producto}
          onChange={handleChangeProducto}
          required
        />
        <input
          type="text"
          name="Distribuidor"
          placeholder="Distribuidor"
          value={producto.Distribuidor}
          onChange={handleChangeProducto}
          required
        />
        <textarea
          name="Descripcion"
          placeholder="Descripción del producto"
          value={producto.Descripcion}
          onChange={handleChangeProducto}
          required
        />
        <button type="submit">Registrar Producto</button>
      </form>

      <hr />

      {/* Formulario de Lotes */}
      <h2>Registro de Lote</h2>
      <form onSubmit={handleSubmitLote}>
        <select
          name="id_producto"
          value={lote.id_producto}
          onChange={handleChangeLote}
          required
        >
          <option value="">Seleccione un producto</option>
          {productos.map((producto) => (
            <option key={producto.id_producto} value={producto.id_producto}>
              {producto.nombre_Producto}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="numero_lote"
          placeholder="Número de lote"
          value={lote.numero_lote}
          onChange={handleChangeLote}
          required
        />
        <input
          type="date"
          name="fecha_vencimiento"
          value={lote.fecha_vencimiento}
          onChange={handleChangeLote}
          required
        />
        <button type="submit">Registrar Lote</button>
      </form>
    </div>
  );
};

export default Registro;

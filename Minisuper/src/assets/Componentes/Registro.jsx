import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Registro.css";

const Registro = () => {
  const [producto, setProducto] = useState({
    nombre_Producto: "",
    Descripcion: "",
    precio: "",
    unidad_de_medida: "",
    categoria: "1",
    distribuidor: "",
    stock_min: "",
  });

  const [productos, setProductos] = useState([]);
  const [lote, setLote] = useState({
    id_producto: "",
    numero_lote: "",
    stock: "",
    fecha_vencimiento: "",
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/productos");
      console.log("📥 Productos obtenidos:", response.data);
      setProductos(response.data);
    } catch (error) {
      console.error("❌ Error al obtener los productos:", error);
      alert("Error al cargar los productos.");
    }
  };

  const handleChangeProducto = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: ["precio", "stock_min"].includes(name) ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleChangeLote = (e) => {
    setLote({ ...lote, [e.target.name]: e.target.value });
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    if (!producto.nombre_Producto || !producto.Descripcion || !producto.precio || !producto.unidad_de_medida || !producto.distribuidor || !producto.stock_min) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const productoAEnviar = { ...producto, categoria: Number(producto.categoria) };
      console.log("📤 Enviando producto:", productoAEnviar);

      const response = await axios.post("http://localhost:5000/api/productos", productoAEnviar, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Respuesta del servidor:", response.data);
      alert("Producto registrado con éxito!");

      setProducto({
        nombre_Producto: "",
        Descripcion: "",
        precio: "",
        unidad_de_medida: "",
        categoria: "1",
        distribuidor: "",
        stock_min: "",
      });

      fetchProductos();
    } catch (error) {
      console.error("❌ Error al registrar el producto:", error.response?.data || error);
      alert("Error al registrar el producto.");
    }
  };

  const handleSubmitLote = async (e) => {
    e.preventDefault();
    if (!lote.id_producto || !lote.numero_lote || !lote.stock || !lote.fecha_vencimiento) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      console.log("📤 Enviando lote:", lote);
      const response = await axios.post("http://localhost:5000/api/lotes", lote);
      console.log("✅ Respuesta del servidor:", response.data);
      alert("Lote registrado con éxito!");

      setLote({ id_producto: "", numero_lote: "", stock: "", fecha_vencimiento: "" });
    } catch (error) {
      console.error("❌ Error al registrar el lote:", error.response?.data || error);
      alert("Error al registrar el lote.");
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Producto</h2>
      <form onSubmit={handleSubmitProducto} className="form-container">
        <label>Nombre del producto:</label>
        <input type="text" name="nombre_Producto" value={producto.nombre_Producto} onChange={handleChangeProducto} required />

        <label>Descripción:</label>
        <textarea name="Descripcion" value={producto.Descripcion} onChange={handleChangeProducto} required />

        <label>Precio:</label>
        <input type="number" name="precio" value={producto.precio} onChange={handleChangeProducto} step="any" required />

        <label>Unidad de medida:</label>
        <input type="text" name="unidad_de_medida" value={producto.unidad_de_medida} onChange={handleChangeProducto} required />

        <label>Categoría:</label>
        <select name="categoria" value={producto.categoria} onChange={handleChangeProducto} required>
          <option value="1">Perecedero</option>
          <option value="0">No Perecedero</option>
        </select>

        <label>Distribuidor:</label>
        <input type="text" name="distribuidor" value={producto.distribuidor} onChange={handleChangeProducto} required />

        <label>Stock mínimo:</label>
        <input type="number" name="stock_min" value={producto.stock_min} onChange={handleChangeProducto} required />

        <button type="submit">Registrar Producto</button>
      </form>

      <hr />

      <h2>Registro de Lote</h2>
      <form onSubmit={handleSubmitLote} className="form-container">
        <label>Producto:</label>
        <select name="id_producto" value={lote.id_producto} onChange={handleChangeLote} required>
          <option value="">Seleccione un producto</option>
          {productos.map((producto) => (
            <option key={producto.id_producto} value={producto.id_producto}>
              {producto.nombre_Producto}
            </option>
          ))}
        </select>

        <label>Número de lote:</label>
        <input type="text" name="numero_lote" value={lote.numero_lote} onChange={handleChangeLote} required />

        <label>Stock:</label>
        <input type="number" name="stock" value={lote.stock} onChange={handleChangeLote} required />

        <label>Fecha de vencimiento:</label>
        <input type="date" name="fecha_vencimiento" value={lote.fecha_vencimiento} onChange={handleChangeLote} required />

        <button type="submit">Registrar Lote</button>
      </form>
    </div>
  );
};

export default Registro;

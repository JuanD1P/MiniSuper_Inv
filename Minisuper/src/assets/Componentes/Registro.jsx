import React, { useState, useEffect } from "react";
import axios from "axios";

const Registro = () => {
  const [producto, setProducto] = useState({ 
    nombre_Producto: "", 
    Descripcion: "",
    precio: "",
    stock_total: "",
    categoria: "",
    distribuidor: "",
    stock_min: ""
  });

  const [productos, setProductos] = useState([]);
  const [lote, setLote] = useState({
    id_producto: "",
    numero_lote: "",
    stock: "",
    fecha_vencimiento: "",
  });

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

  const handleChangeProducto = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleChangeLote = (e) => {
    setLote({ ...lote, [e.target.name]: e.target.value });
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/productos", producto);
      alert("✅ Producto registrado con éxito!");
      setProducto({ 
        nombre_Producto: "", 
        Descripcion: "",
        precio: "",
        stock_total: "",
        categoria: "",
        distribuidor: "",
        stock_min: ""
      });

      const response = await axios.get("http://localhost:5000/api/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("❌ Error al registrar el producto:", error);
    }
  };

  const handleSubmitLote = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/lotes", lote);
      alert("✅ Lote registrado con éxito!");
      setLote({ id_producto: "", numero_lote: "", stock: "", fecha_vencimiento: "" });
    } catch (error) {
      console.error("❌ Error al registrar el lote:", error);
    }
  };

  return (
    <div>
      <h2>Registro de Producto</h2>
      <form onSubmit={handleSubmitProducto}>
        <input
          type="text"
          name="nombre_Producto"
          placeholder="Nombre del producto"
          value={producto.nombre_Producto}
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
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={producto.precio}
          onChange={handleChangeProducto}
          required
        />
        <input
          type="number"
          name="stock_total"
          placeholder="Stock total"
          value={producto.stock_total}
          onChange={handleChangeProducto}
          required
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          value={producto.categoria}
          onChange={handleChangeProducto}
          required
        />
        <input
          type="text"
          name="distribuidor"
          placeholder="Distribuidor"
          value={producto.distribuidor}
          onChange={handleChangeProducto}
          required
        />
        <input
          type="number"
          name="stock_min"
          placeholder="Stock mínimo"
          value={producto.stock_min}
          onChange={handleChangeProducto}
          required
        />
        <button type="submit">Registrar Producto</button>
      </form>

      <hr />

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
          type="number"
          name="stock"
          placeholder="Stock"
          value={lote.stock}
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
        <button type="submit">RegistrarLote</button>
      </form>
    </div>
  );
};

export default Registro;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Registro.css";

const Registro = () => {
  const [producto, setProducto] = useState({
    nombre_Producto: "",
    Descripcion: "",
    precio: "",
    unidad_de_medida: "",
    categoria: "1", // Se mantiene como string, se convierte a número al enviar
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
      console.log("📦 Productos obtenidos:", response.data);
      setProductos(response.data);
    } catch (error) {
      console.error("❌ Error al obtener los productos:", error);
      alert("Error al cargar los productos. Verifique la conexión con el servidor.");
    }
  };

  const handleChangeProducto = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]:
        name === "categoria"
          ? value // Se mantiene como string hasta que se envíe
          : ["precio", "stock_min"].includes(name)
          ? value === "" ? "" : Number(value) // Evitar NaN
          : value,
    }));
  };

  const handleChangeLote = (e) => {
    setLote({ ...lote, [e.target.name]: e.target.value });
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    try {
      const productoAEnviar = {
        ...producto,
        categoria: Number(producto.categoria), // Convertir categoría a número
      };
      console.log("📤 Enviando producto:", productoAEnviar);

      await axios.post("http://localhost:5000/api/productos", productoAEnviar, {
        headers: { "Content-Type": "application/json" },
      });

      alert("✅ Producto registrado con éxito!");
      setProducto({
        nombre_Producto: "",
        Descripcion: "",
        precio: "",
        unidad_de_medida: "",
        categoria: "1",
        distribuidor: "",
        stock_min: "",
      });

      fetchProductos(); // Recargar la lista de productos
    } catch (error) {
      console.error("❌ Error al registrar el producto:", error);
      alert("Error al registrar el producto. Verifique los datos.");
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
      alert("Error al registrar el lote.");
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Producto</h2>
      <form onSubmit={handleSubmitProducto} className="form-container">
        <label>Nombre del producto:</label>
        <input
          type="text"
          name="nombre_Producto"
          placeholder="Nombre del producto"
          value={producto.nombre_Producto}
          onChange={handleChangeProducto}
          required
        />

        <label>Descripción:</label>
        <textarea
          name="Descripcion"
          placeholder="Descripción del producto"
          value={producto.Descripcion}
          onChange={handleChangeProducto}
          required
        />

        <label>Precio:</label>
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={producto.precio}
          onChange={handleChangeProducto}
          step="any"
          required
        />

        <label>Unidad de medida:</label>
        <input
          type="text"
          name="unidad_de_medida"
          placeholder="Unidad de medida"
          value={producto.unidad_de_medida}
          onChange={handleChangeProducto}
          required
        />

        <label>Categoría:</label>
        <select name="categoria" value={producto.categoria} onChange={handleChangeProducto} required>
          <option value="1">Perecedero</option>
          <option value="0">No Perecedero</option>
        </select>

        <label>Distribuidor:</label>
        <input
          type="text"
          name="distribuidor"
          placeholder="Distribuidor"
          value={producto.distribuidor}
          onChange={handleChangeProducto}
          required
        />

        <label>Stock mínimo:</label>
        <input
          type="number"
          name="stock_min"
          placeholder="Stock mínimo"
          value={producto.stock_min}
          onChange={handleChangeProducto}
          required
        />

        <button type="submit" className="submit-button">Registrar Producto</button>
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
        <input
          type="text"
          name="numero_lote"
          placeholder="Número de lote"
          value={lote.numero_lote}
          onChange={handleChangeLote}
          required
        />

        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={lote.stock}
          onChange={handleChangeLote}
          required
        />

        <label>Fecha de vencimiento:</label>
        <input
          type="date"
          name="fecha_vencimiento"
          value={lote.fecha_vencimiento}
          onChange={handleChangeLote}
          required
        />

        <button type="submit" className="submit-button">Registrar Lote</button>
      </form>
    </div>
  );
};

export default Registro;

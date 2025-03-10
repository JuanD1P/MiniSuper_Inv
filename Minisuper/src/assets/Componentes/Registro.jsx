import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registro.css";
import logo from "./Recursos/LOGUITO.png";

const Registro = () => {
  const navigate = useNavigate();

  // Estado para almacenar los datos del producto a registrar
  const [producto, setProducto] = useState({
    nombre_Producto: "",
    Descripcion: "",
    precio: "",
    unidad_de_medida: "",
    categoria: "1", 
    distribuidor: "",
    stock_min: "",
  });

  // Estado para almacenar la lista de productos obtenidos del servidor
  const [productos, setProductos] = useState([]);
  
  // Estado para almacenar los datos del lote a registrar
  const [lote, setLote] = useState({
    id_producto: "",
    numero_lote: "",
    stock: "",
    fecha_vencimiento: "",
  });

  // Estado para alternar entre los formularios de producto y lote
  const [mostrarProducto, setMostrarProducto] = useState(true);

  // Funcion para obtener la lista de productos desde el backend
  const fetchProductos = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      alert("Error al cargar los productos.");
    }
  }, []);

  // Obtener productos al cargar el componente
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Manejar cambios en los inputs
  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    let newValue = value.trim();

    // Validar que ciertos campos numericos no tengan valores negativos
    if (["precio", "stock_min", "stock"].includes(name)) {
      const numericValue = Number(value);
      newValue = numericValue >= 0 ? numericValue : "";
    }

    // Validar que la fecha de vencimiento sea futura
    if (name === "fecha_vencimiento") {
      const currentDate = new Date().toISOString().split("T")[0];
      if (value <= currentDate) {
        alert("La fecha de vencimiento debe ser mayor a la fecha actual.");
        return;
      }
    }

    setter((prev) => ({ ...prev, [name]: newValue }));
  };

  // Manejar el envio del formulario de producto
  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/productos", { ...producto, categoria: Number(producto.categoria) });
      alert("Producto registrado con exito!");
      setProducto({ nombre_Producto: "", Descripcion: "", precio: "", unidad_de_medida: "", categoria: "1", distribuidor: "", stock_min: "" });
      fetchProductos();
    } catch (error) {
      alert("Error al registrar el producto.");
    }
  };

  // Manejar el envio del formulario de lote
  const handleSubmitLote = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    if (lote.fecha_vencimiento <= currentDate) {
      alert("La fecha de vencimiento debe ser mayor a la fecha actual.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/lotes", lote);
      alert("Lote registrado con exito!");
      setLote({ id_producto: "", numero_lote: "", stock: "", fecha_vencimiento: "" });
    } catch (error) {
      alert("Error al registrar el lote.");
    }
  };

  return (
    <div className="registro-container">
      <img src={logo} alt="Logo Mini Super" className="logo" />
      <button className="boton-inicio" onClick={() => navigate("/")}>⬅</button>

      <button onClick={() => setMostrarProducto(true)}>Registrar Producto</button>
      <button onClick={() => setMostrarProducto(false)}>Registrar Lote</button>

      {mostrarProducto ? (
        <>
          <h2>Registro de Producto</h2>
          <form onSubmit={handleSubmitProducto} className="form-container">
            {[
              { label: "Nombre del producto", name: "nombre_Producto", type: "text" },
              { label: "Descripcion", name: "Descripcion", type: "textarea" },
              { label: "Precio", name: "precio", type: "number" },
              { label: "Unidad de medida", name: "unidad_de_medida", type: "text" },
              { label: "Distribuidor", name: "distribuidor", type: "text" },
              { label: "Stock minimo", name: "stock_min", type: "number" },
            ].map(({ label, name, type }) => (
              <label key={name}>
                {label}:
                {type === "textarea" ? (
                  <textarea name={name} value={producto[name]} onChange={handleChange(setProducto)} required />
                ) : (
                  <input type={type} name={name} value={producto[name]} onChange={handleChange(setProducto)} min="0" required />
                )}
              </label>
            ))}

            <label>
              Categoria:
              <select name="categoria" value={producto.categoria} onChange={handleChange(setProducto)} required>
                <option value="1">Perecedero</option>
                <option value="0">No Perecedero</option>
              </select>
            </label>

            <button type="submit">Registrar Producto</button>
          </form>
        </>
      ) : (
        <>
          <h2>Registro de Lote</h2>
          <form onSubmit={handleSubmitLote} className="form-container">
            <label>
              Producto:
              <select name="id_producto" value={lote.id_producto} onChange={handleChange(setLote)} required>
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>{p.nombre_Producto}</option>
                ))}
              </select>
            </label>

            <label>Stock:<input type="number" name="stock" value={lote.stock} onChange={handleChange(setLote)} min="0" required /></label>
            <label>Fecha de vencimiento:<input type="date" name="fecha_vencimiento" value={lote.fecha_vencimiento} onChange={handleChange(setLote)} required /></label>

            <button type="submit">Registrar Lote</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Registro;

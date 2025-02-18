import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registro.css";
import logo from "./Recursos/LOGUITO.png";

const Registro = () => {
  const navigate = useNavigate();

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

  const [mostrarProducto, setMostrarProducto] = useState(true); // Estado para mostrar/ocultar el formulario de producto

  const fetchProductos = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
      alert("Error al cargar los productos.");
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    
    let newValue = value.trim();
    if (["precio", "stock_min", "stock"].includes(name)) {
      const numericValue = Number(value);
      newValue = numericValue >= 0 ? numericValue : ""; // No permite valores negativos
    }

    // Validación de la fecha (solo si es un campo de tipo fecha)
    if (name === "fecha_vencimiento") {
      const currentDate = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato YYYY-MM-DD
      if (value <= currentDate) {
        alert("La fecha de vencimiento debe ser mayor a la fecha actual.");
        return; // Si la fecha no es válida, no cambia el valor
      }
    }

    setter((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/productos", { ...producto, categoria: Number(producto.categoria) });
      alert("✅ Producto registrado con éxito!");
      setProducto({ nombre_Producto: "", Descripcion: "", precio: "", unidad_de_medida: "", categoria: "1", distribuidor: "", stock_min: "" });
      fetchProductos();
    } catch (error) {
      alert("Error al registrar el producto.");
    }
  };

  const handleSubmitLote = async (e) => {
    e.preventDefault();

    // Validación de la fecha antes de enviar
    const currentDate = new Date().toISOString().split("T")[0]; // Obtener la fecha actual
    if (lote.fecha_vencimiento <= currentDate) {
      alert("La fecha de vencimiento debe ser mayor a la fecha actual.");
      return; // Si la fecha no es válida, no envía el formulario
    }

    try {
      await axios.post("http://localhost:5000/api/lotes", lote);
      alert("✅ Lote registrado con éxito!");
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

      {mostrarProducto && (
        <>
          <h2>Registro de Producto</h2>
          <form onSubmit={handleSubmitProducto} className="form-container">
            {[ 
              { label: "Nombre del producto", name: "nombre_Producto", type: "text" },
              { label: "Descripción", name: "Descripcion", type: "textarea" },
              { label: "Precio", name: "precio", type: "number" },
              { label: "Unidad de medida", name: "unidad_de_medida", type: "text" },
              { label: "Distribuidor", name: "distribuidor", type: "text" },
              { label: "Stock mínimo", name: "stock_min", type: "number" },
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
              Categoría:
              <select name="categoria" value={producto.categoria} onChange={handleChange(setProducto)} required>
                <option value="1">Perecedero</option>
                <option value="0">No Perecedero</option>
              </select>
            </label>

            <button type="submit">Registrar Producto</button>
          </form>
        </>
      )}

      {!mostrarProducto && (
        <>
          <h2>Registro de Lote</h2>
          <form onSubmit={handleSubmitLote} className="form-container">
            <label>
              Producto:
              <select name="id_producto" value={lote.id_producto} onChange={handleChange(setLote)} required>
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre_Producto}
                  </option>
                ))}
              </select>
            </label>

            {[ 
              { label: "Stock", name: "stock", type: "number" },
              { label: "Fecha de vencimiento", name: "fecha_vencimiento", type: "date" },
            ].map(({ label, name, type }) => (
              <label key={name}>
                {label}:
                <input type={type} name={name} value={lote[name]} onChange={handleChange(setLote)} min={type === "number" ? "0" : undefined} required />
              </label>
            ))}

            <button type="submit">Registrar Lote</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Registro;

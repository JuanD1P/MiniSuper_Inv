import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Registro.css";

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

  const handleChange = (e, setState) => {
    setState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e, endpoint, data, setState, successMessage) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/${endpoint}`, data);
      alert(successMessage);
      setState(Object.fromEntries(Object.keys(data).map(key => [key, ""])));
      
      if (endpoint === "productos") {
        const response = await axios.get("http://localhost:5000/api/productos");
        setProductos(response.data);
      }
    } catch (error) {
      console.error(`❌ Error al registrar en ${endpoint}:`, error);
    }
  };

  return (
    <div className="registro-container">
      <div className="form-container">
        <h2>Registro de Producto</h2>
        <form onSubmit={(e) => handleSubmit(e, "productos", producto, setProducto, "✅ Producto registrado con éxito!")}> 
          {Object.keys(producto).map((key) => (
            key === "categoria" ? (
              <select key={key} name={key} value={producto[key]} onChange={(e) => handleChange(e, setProducto)} required>
                <option value="">Seleccione una categoría</option>
                <option value="true">Perecedero</option>
                <option value="false">No Perecedero</option>
              </select>
            ) : (
              <input 
                key={key} 
                type={key.includes("precio") || key.includes("stock") ? "number" : "text"}
                name={key}
                placeholder={key.replace("_", " ").toUpperCase()}
                value={producto[key]}
                onChange={(e) => handleChange(e, setProducto)}
                required
              />
            )
          ))}
          <button type="submit">Registrar Producto</button>
        </form>
      </div>
      
      <div className="form-container">
        <h2>Registro de Lote</h2>
        <form onSubmit={(e) => handleSubmit(e, "lotes", lote, setLote, "✅ Lote registrado con éxito!")}> 
          <select name="id_producto" value={lote.id_producto} onChange={(e) => handleChange(e, setLote)} required>
            <option value="">Seleccione un producto</option>
            {productos.map((prod) => (
              <option key={prod.id_producto} value={prod.id_producto}>{prod.nombre_Producto}</option>
            ))}
          </select>
          {Object.keys(lote).filter(key => key !== "id_producto").map((key) => (
            <input 
              key={key} 
              type={key.includes("fecha") ? "date" : key.includes("stock") ? "number" : "text"}
              name={key}
              placeholder={key.replace("_", " ").toUpperCase()}
              value={lote[key]}
              onChange={(e) => handleChange(e, setLote)}
              required
            />
          ))}
          <button type="submit">Registrar Lote</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;

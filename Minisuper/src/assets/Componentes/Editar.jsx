import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Editar.css";

const Editar = () => {
  const { id_producto } = useParams();
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

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/productos/${id_producto}`);
        setProducto(response.data);
      } catch (error) {
        console.error("❌ Error al obtener el producto:", error);
        alert("Error al cargar el producto.");
      }
    };
    fetchProducto();
  }, [id_producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: ["precio", "stock_min"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/productos/${id_producto}`, producto);
      alert("✅ Producto actualizado con éxito!");
      navigate("/");
    } catch (error) {
      alert("Error al actualizar el producto.");
    }
  };

  return (
    <div className="editar-container">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit} className="form-container">
        {["nombre_Producto", "Descripcion", "precio", "unidad_de_medida", "distribuidor", "stock_min"].map((field) => (
          <label key={field}>
            {field.replace("_", " ")}: 
            <input
              type={field === "precio" || field === "stock_min" ? "number" : "text"}
              name={field}
              value={producto[field]}
              onChange={handleChange}
              required
            />
          </label>
        ))}

        <label>
          Categoría:
          <select name="categoria" value={producto.categoria} onChange={handleChange} required>
            <option value="1">Perecedero</option>
            <option value="0">No Perecedero</option>
          </select>
        </label>

        <button type="submit">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default Editar;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Editar.css'; 
import logo from './Recursos/LOGUITO.png';

const Editar = () => {
  // Obtener el id del producto desde la URL
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estado inicial del producto con sus propiedades
  const [producto, setProducto] = useState({
    nombre_Producto: '',
    Descripcion: '',
    precio: '',
    unidad_de_medida: '',
    categoria: '',
    distribuidor: '',
    stock_min: '',
  });

  // Obtener los datos del producto cuando el componente se monta
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/productos/${id}`);
        setProducto(response.data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };
    fetchProducto();
  }, [id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  // Manejar el envio del formulario para actualizar el producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/productos/${id}`, producto);
      alert("Producto actualizado correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  return (
    <div className="contenedor">
      {/* Logo de la aplicacion */}
      <img src={logo} alt="Logo Mini Super" className="logo" />
      
      {/* Contenedor del formulario de edicion */}
      <div className="editar-container">
        <h2>Editar Producto</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" name="nombre_Producto" value={producto.nombre_Producto} onChange={handleChange} required />
          
          <label>Descripcion:</label>
          <input type="text" name="Descripcion" value={producto.Descripcion} onChange={handleChange} required />
          
          <label>Precio:</label>
          <input type="number" name="precio" value={producto.precio} onChange={handleChange} required />
          
          <label>Unidad de Medida:</label>
          <input type="text" name="unidad_de_medida" value={producto.unidad_de_medida} onChange={handleChange} required />
          
          <label>Categoria:</label>
          <select name="categoria" value={producto.categoria} onChange={handleChange} required>
            <option value="1">🟢 Perecedero</option>
            <option value="0">🔴 No Perecedero</option>
          </select>
          
          <label>Distribuidor:</label>
          <input type="text" name="distribuidor" value={producto.distribuidor} onChange={handleChange} required />
          
          <label>Stock Minimo:</label>
          <input type="number" name="stock_min" value={producto.stock_min} onChange={handleChange} required />
          
          {/* Botones para guardar o cancelar */}
          <div className="botones-formulario">
            <button type="submit" className="boton-guardar">Guardar Cambios</button>
            <button type="button" className="boton-cancelar" onClick={() => navigate("/")}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editar;

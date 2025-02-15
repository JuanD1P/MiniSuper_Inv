import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Ruta para registrar un nuevo producto
router.post("/", (req, res) => {
    const { nombre_Producto, Descripcion, precio, unidad_de_medida, categoria, distribuidor, stock_min } = req.body;

    console.log("Datos recibidos:", req.body); // Para depuración

    // Verificar que todos los campos estén presentes
    if (!nombre_Producto || !Descripcion || precio === undefined || !unidad_de_medida || categoria === undefined || !distribuidor || stock_min === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Convertir valores según el tipo esperado en la BD
    const precioValue = parseFloat(precio);
    const stockMinValue = parseInt(stock_min, 10);
    const categoriaValue = categoria ? 1 : 0; // Convertir booleano a 1 o 0

    const sql = `INSERT INTO producto (nombre_Producto, Descripcion, precio, unidad_de_medida, categoria, distribuidor, stock_min) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    con.query(sql, [nombre_Producto, Descripcion, precioValue, unidad_de_medida, categoriaValue, distribuidor, stockMinValue], (err, result) => {
        if (err) {
            console.error("Error al registrar el producto:", err);
            return res.status(500).json({ error: "Error al registrar el producto", err });
        }
        console.log("Producto registrado con éxito, ID:", result.insertId);
        res.json({ message: "Producto registrado con éxito", id: result.insertId });
    });
});

// Ruta para obtener todos los productos
router.get("/", (req, res) => {
    const sql = "SELECT * FROM producto";

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener los productos:", err);
            return res.status(500).json({ error: "Error al obtener los productos", err });
        }
        res.json(results);
    });
});

export default router;

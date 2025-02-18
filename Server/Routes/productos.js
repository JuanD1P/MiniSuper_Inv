import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Ruta para registrar un nuevo producto
router.post("/", (req, res) => {
    const { nombre_Producto, Descripcion, precio, unidad_de_medida, categoria, distribuidor, stock_min } = req.body;

    // Verificar que todos los campos estén presentes
    if (!nombre_Producto || !Descripcion || precio === undefined || !unidad_de_medida || categoria === undefined || !distribuidor || stock_min === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Convertir valores a tipos adecuados
    const precioNum = parseFloat(precio);
    const stockMinNum = parseInt(stock_min, 10);
    const categoriaNum = parseInt(categoria, 10);

    // Validar que precio y stock sean números válidos
    if (isNaN(precioNum) || isNaN(stockMinNum) || isNaN(categoriaNum)) {
        return res.status(400).json({ error: "Precio, stock mínimo y categoría deben ser valores numéricos válidos." });
    }

    const sql = `INSERT INTO producto (nombre_Producto, Descripcion, precio, unidad_de_medida, categoria, distribuidor, stock_min) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    con.query(sql, [nombre_Producto, Descripcion, precioNum, unidad_de_medida, categoriaNum, distribuidor, stockMinNum], (err, result) => {
        if (err) {
            console.error("❌ Error al registrar el producto:", err.message);
            return res.status(500).json({ error: "Error al registrar el producto", details: err.sqlMessage });
        }
        console.log("✅ Producto registrado con éxito, ID:", result.insertId);
        res.json({ message: "Producto registrado con éxito", id: result.insertId });
    });
});

// Ruta para obtener todos los productos
router.get("/", (req, res) => {
    const sql = "SELECT * FROM producto";

    con.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error al obtener los productos:", err.message);
            return res.status(500).json({ error: "Error al obtener los productos", details: err.sqlMessage });
        }
        res.json(results);
    });
});

// Ruta para eliminar un producto por ID
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    // Verificar si el ID es un número válido
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
        return res.status(400).json({ error: "ID de producto inválido" });
    }

    const sql = "DELETE FROM producto WHERE id_producto = ?";

    con.query(sql, [idNum], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar el producto:", err.message);
            return res.status(500).json({ error: "Error al eliminar el producto", details: err.sqlMessage });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({ message: "✅ Producto eliminado correctamente" });
    });
});

// Ruta para obtener un producto por ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM producto WHERE id_producto = ?";

    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error al obtener el producto:", err.message);
            return res.status(500).json({ error: "Error al obtener el producto", details: err.sqlMessage });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(result[0]);
    });
});

// Ruta para actualizar un producto
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre_Producto, Descripcion, precio, unidad_de_medida, categoria, distribuidor, stock_min } = req.body;

    if (!nombre_Producto || !Descripcion || precio === undefined || !unidad_de_medida || categoria === undefined || !distribuidor || stock_min === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `UPDATE producto SET 
                    nombre_Producto = ?, 
                    Descripcion = ?, 
                    precio = ?, 
                    unidad_de_medida = ?, 
                    categoria = ?, 
                    distribuidor = ?, 
                    stock_min = ?
                 WHERE id_producto = ?`;

    con.query(sql, [nombre_Producto, Descripcion, precio, unidad_de_medida, categoria, distribuidor, stock_min, id], (err, result) => {
        if (err) {
            console.error("❌ Error al actualizar el producto:", err.message);
            return res.status(500).json({ error: "Error al actualizar el producto", details: err.sqlMessage });
        }
        res.json({ message: "✅ Producto actualizado correctamente" });
    });
});

// Ruta para actualizar el stock total de un producto
router.put("/actualizar_stock/:id_producto", (req, res) => {
    const { id_producto } = req.params;
    const { cantidad } = req.body; // Recibimos la cantidad vendida

    // Verificar que la cantidad sea válida
    if (isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número mayor a cero." });
    }

    // Actualizamos el stock total sumando la cantidad vendida
    const sql = `
        UPDATE producto 
        SET stock_min = stock_min - ?
        WHERE id_producto = ? AND stock_min >= ?`;

    con.query(sql, [cantidad, id_producto, cantidad], (err, result) => {
        if (err) {
            console.error("❌ Error al actualizar el stock del producto:", err.message);
            return res.status(500).json({ error: "Error al actualizar el stock del producto", details: err.sqlMessage });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado o stock insuficiente." });
        }
        res.json({ message: "✅ Stock del producto actualizado correctamente." });
    });
});

export default router;

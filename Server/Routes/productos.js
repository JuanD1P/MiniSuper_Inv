import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Ruta para registrar un nuevo producto
router.post("/", (req, res) => {
    const { nombre_Producto, Descripcion, precio, unidad_de_medida, categoria, distribuidor, stock_min } = req.body;

    // Verificar que todos los campos estén presentes
    if (!nombre_Producto || !Descripcion || precio === undefined || !unidad_de_medida || !categoria || !distribuidor || stock_min === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `INSERT INTO producto (nombre_Producto, Descripcion, precio, unidad_de_medida, categoria, distribuidor, stock_min) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    con.query(sql, [nombre_Producto, Descripcion, precio, unidad_de_medida, categoria, distribuidor, stock_min], (err, result) => {
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


// Ruta para eliminar un producto por ID
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM producto WHERE id_producto = ?";

    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar el producto:", err);
            return res.status(500).json({ error: "Error al eliminar el producto" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({ message: "✅ Producto eliminado correctamente" });
    });
});

export default router;

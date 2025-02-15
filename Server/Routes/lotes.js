import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Ruta para registrar un nuevo lote
router.post("/", (req, res) => {
    const { id_producto, stock, fecha_vencimiento } = req.body;

    if (!id_producto || stock === undefined || !fecha_vencimiento) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO lotes (id_producto, stock, fecha_vencimiento) VALUES (?, ?, ?)";

    con.query(sql, [id_producto, stock, fecha_vencimiento], (err, result) => {
        if (err) {
            console.error("Error al registrar el lote:", err);
            return res.status(500).json({ error: "Error al registrar el lote", err });
        }
        console.log("Lote registrado con éxito, ID:", result.insertId);
        res.json({ message: "Lote registrado con éxito", id: result.insertId });
    });
});

// Ruta para obtener todos los lotes
router.get("/", (req, res) => {
    const sql = `
        SELECT 
            lotes.id_lote, 
            lotes.stock, 
            lotes.fecha_vencimiento, 
            producto.nombre_Producto 
        FROM lotes
        JOIN producto ON lotes.id_producto = producto.id_producto
    `;

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener los lotes:", err);
            return res.status(500).json({ error: "Error al obtener los lotes", err });
        }
        res.json(results);
    });
});

export default router;

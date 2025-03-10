import express from "express";
import con from "../utils/db.js";

const router = express.Router();

/**
 * Ruta para registrar un nuevo lote en la base de datos.
 * Se requiere `id_producto`, `stock` y `fecha_vencimiento` en el cuerpo de la solicitud.
 */
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
        console.log("Lote registrado con exito, ID:", result.insertId);
        res.json({ message: "Lote registrado con exito", id: result.insertId });
    });
});

/**
 * Ruta para obtener todos los lotes registrados.
 * Retorna los lotes junto con el nombre del producto asociado.
 */
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

/**
 * Ruta para obtener el stock total agrupado por producto.
 * Retorna una lista con el `id_producto` y la suma total del `stock`.
 */
router.get("/stocks", (req, res) => {
    const sql = `SELECT id_producto, SUM(stock) AS total_stock FROM lotes GROUP BY id_producto`;
    
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener los stocks:", err);
            return res.status(500).json({ error: "Error al obtener los stocks", err });
        }
        res.json(results);
    });
});

/**
 * Ruta para actualizar el stock de un lote especifico.
 * Se requiere el `id_lote` en los parametros y el nuevo `stock` en el cuerpo de la solicitud.
 */
router.put("/:id_lote", (req, res) => {
    const { id_lote } = req.params;
    const { stock } = req.body;

    // Validacion del stock
    if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ error: "Stock invalido." });
    }

    const sql = "UPDATE lotes SET stock = ? WHERE id_lote = ?";

    con.query(sql, [stock, id_lote], (err, result) => {
        if (err) {
            console.error("Error al actualizar el stock del lote:", err.message);
            return res.status(500).json({ error: "Error interno en el servidor." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Lote no encontrado." });
        }
        res.json({ message: "Stock actualizado correctamente." });
    });
});

export default router;

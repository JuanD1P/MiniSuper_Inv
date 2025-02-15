import express from "express";
import cors from "cors";
import productosRoutes from "./Routes/productos.js";
import lotesRoutes from "./Routes/lotes.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/lotes", lotesRoutes);
app.use("/api/productos", productosRoutes);

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:5000`);
});

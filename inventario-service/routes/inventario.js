import { Router } from 'express';
import mysql from 'mysql2/promise';

const router = Router();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    database: process.env.DB_NAME || 'inventario_db',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
});

// Inicializar tabla de productos
const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS productos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(150) NOT NULL,
            stock INT NOT NULL DEFAULT 0,
            precio DECIMAL(10,2) NOT NULL
        )
    `);
};
initDB().catch(console.error);

// GET /api/inventario
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar inventario', detalle: error.message });
    }
});

// POST /api/inventario (Para agregar productos)
router.post('/', async (req, res) => {
    const { nombre, stock, precio } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO productos (nombre, stock, precio) VALUES (?, ?, ?)',
            [nombre, stock, precio]
        );
        res.status(201).json({ id: result.insertId, nombre, stock, precio });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

export default router;
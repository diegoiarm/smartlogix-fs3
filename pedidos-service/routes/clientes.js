import { Router } from 'express';
import mysql from 'mysql2/promise';

const router = Router();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'pedidos_db',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS clientes (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            nombre     VARCHAR(150) NOT NULL,
            email      VARCHAR(150) NOT NULL UNIQUE,
            telefono   VARCHAR(20),
            creado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
};
initDB().catch(console.error);

// GET /api/clientes
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar clientes', detalle: error.message });
    }
});

// GET /api/clientes/:id
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar cliente', detalle: error.message });
    }
});

// POST /api/clientes
router.post('/', async (req, res) => {
    const { nombre, email, telefono } = req.body;
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Campos requeridos: nombre, email' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
            [nombre, email, telefono || null]
        );
        res.status(201).json({ id: result.insertId, nombre, email, telefono: telefono || null });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El email ya está registrado' });
        }
        res.status(500).json({ error: 'Error al crear cliente', detalle: error.message });
    }
});

// DELETE /api/clientes/:id
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar cliente', detalle: error.message });
    }
});

export default router;

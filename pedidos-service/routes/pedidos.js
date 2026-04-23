import { Router } from 'express';
import mysql from 'mysql2/promise';

const router = Router();

// Pool de conexiones — patrón del profesor
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

// Inicializar tabla si no existe
const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS pedidos (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            cliente    VARCHAR(150) NOT NULL,
            producto   VARCHAR(150) NOT NULL,
            cantidad   INT          NOT NULL DEFAULT 1,
            estado     ENUM('PENDIENTE','EN_RUTA','ENTREGADO','CANCELADO') NOT NULL DEFAULT 'PENDIENTE',
            creado_en  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
};
initDB().catch(console.error);

// GET /api/pedidos
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pedidos ORDER BY creado_en DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar pedidos', detalle: error.message });
    }
});

// GET /api/pedidos/:id
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar pedido', detalle: error.message });
    }
});

// POST /api/pedidos
router.post('/', async (req, res) => {
    const { cliente, producto, cantidad } = req.body;
    if (!cliente || !producto || !cantidad) {
        return res.status(400).json({ error: 'Campos requeridos: cliente, producto, cantidad' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO pedidos (cliente, producto, cantidad) VALUES (?, ?, ?)',
            [cliente, producto, cantidad]
        );
        res.status(201).json({ id: result.insertId, cliente, producto, cantidad, estado: 'PENDIENTE' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear pedido', detalle: error.message });
    }
});

// PUT /api/pedidos/:id/estado
router.put('/:id/estado', async (req, res) => {
    const { estado } = req.body;
    const estadosValidos = ['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'CANCELADO'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: `Estado inválido. Opciones: ${estadosValidos.join(', ')}` });
    }
    try {
        const [result] = await pool.query(
            'UPDATE pedidos SET estado = ? WHERE id = ?',
            [estado, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json({ id: Number(req.params.id), estado });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado', detalle: error.message });
    }
});

// DELETE /api/pedidos/:id
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM pedidos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar pedido', detalle: error.message });
    }
});

export default router;

import { Router } from 'express';
import axios from 'axios';

const router = Router();

const INVENTARIO_URL = process.env.INVENTARIO_URL || 'http://localhost:8081';
const PEDIDOS_URL    = process.env.PEDIDOS_URL    || 'http://localhost:8082';

// ============================================================
// INVENTARIO — proxy hacia inventario-service
// ============================================================

router.get('/inventario', async (_req, res) => {
    try {
        const { data } = await axios.get(`${INVENTARIO_URL}/api/inventario`);
        res.json(data);
    } catch (err) {
        res.status(502).json({ error: 'inventario-service no disponible', detalle: err.message });
    }
});

router.get('/inventario/alerta/stock-bajo', async (_req, res) => {
    try {
        const { data } = await axios.get(`${INVENTARIO_URL}/api/inventario/alerta/stock-bajo`);
        res.json(data);
    } catch (err) {
        res.status(502).json({ error: 'inventario-service no disponible', detalle: err.message });
    }
});

router.post('/inventario', async (req, res) => {
    try {
        const { data } = await axios.post(`${INVENTARIO_URL}/api/inventario`, req.body);
        res.status(201).json(data);
    } catch (err) {
        const status = err.response?.status || 502;
        res.status(status).json(err.response?.data || { error: err.message });
    }
});

router.put('/inventario/:id', async (req, res) => {
    try {
        const { data } = await axios.put(`${INVENTARIO_URL}/api/inventario/${req.params.id}`, req.body);
        res.json(data);
    } catch (err) {
        const status = err.response?.status || 502;
        res.status(status).json(err.response?.data || { error: err.message });
    }
});

router.delete('/inventario/:id', async (req, res) => {
    try {
        await axios.delete(`${INVENTARIO_URL}/api/inventario/${req.params.id}`);
        res.status(204).send();
    } catch (err) {
        const status = err.response?.status || 502;
        res.status(status).json(err.response?.data || { error: err.message });
    }
});

// ============================================================
// PEDIDOS — proxy hacia pedidos-service
// ============================================================

router.get('/pedidos', async (_req, res) => {
    try {
        const { data } = await axios.get(`${PEDIDOS_URL}/api/pedidos`);
        res.json(data);
    } catch (err) {
        res.status(502).json({ error: 'pedidos-service no disponible', detalle: err.message });
    }
});

router.post('/pedidos', async (req, res) => {
    try {
        const { data } = await axios.post(`${PEDIDOS_URL}/api/pedidos`, req.body);
        res.status(201).json(data);
    } catch (err) {
        const status = err.response?.status || 502;
        res.status(status).json(err.response?.data || { error: err.message });
    }
});

router.put('/pedidos/:id/estado', async (req, res) => {
    try {
        const { data } = await axios.put(`${PEDIDOS_URL}/api/pedidos/${req.params.id}/estado`, req.body);
        res.json(data);
    } catch (err) {
        const status = err.response?.status || 502;
        res.status(status).json(err.response?.data || { error: err.message });
    }
});

router.delete('/pedidos/:id', async (req, res) => {
    try {
        await axios.delete(`${PEDIDOS_URL}/api/pedidos/${req.params.id}`);
        res.status(204).send();
    } catch (err) {
        const status = err.response?.status || 502;
        res.status(status).json(err.response?.data || { error: err.message });
    }
});

// ============================================================
// DASHBOARD — agrega inventario + pedidos en una sola llamada
// ============================================================

router.get('/dashboard', async (_req, res) => {
    try {
        const [inventario, pedidos, alertas] = await Promise.allSettled([
            axios.get(`${INVENTARIO_URL}/api/inventario`),
            axios.get(`${PEDIDOS_URL}/api/pedidos`),
            axios.get(`${INVENTARIO_URL}/api/inventario/alerta/stock-bajo`),
        ]);

        res.json({
            inventario: inventario.status === 'fulfilled' ? inventario.value.data : [],
            pedidos:    pedidos.status    === 'fulfilled' ? pedidos.value.data    : [],
            alertas:    alertas.status    === 'fulfilled' ? alertas.value.data    : [],
        });
    } catch (err) {
        res.status(502).json({ error: 'Error al construir dashboard', detalle: err.message });
    }
});

export default router;

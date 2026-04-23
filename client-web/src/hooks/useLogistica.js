import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NotificacionService from '../services/NotificacionService';

const INVENTARIO_URL = 'http://localhost:8081/api/inventario';
const PEDIDOS_URL    = 'http://localhost:8082/api/pedidos';

/**
 * Hook personalizado — Módulo de lógica de logística.
 * Centraliza el estado de inventario y pedidos, y emite eventos
 * al NotificacionService cuando se detectan alertas.
 */
export function useLogistica() {
    const [inventario, setInventario]   = useState([]);
    const [pedidos, setPedidos]         = useState([]);
    const [cargando, setCargando]       = useState(false);
    const [error, setError]             = useState(null);

    const fetchInventario = useCallback(async () => {
        try {
            const { data } = await axios.get(INVENTARIO_URL);
            setInventario(data);

            // Detectar stock bajo y notificar observers
            const alertas = data.filter(item => item.cantidad <= item.stockMinimo);
            alertas.forEach(item =>
                NotificacionService.publicar('STOCK_BAJO', {
                    mensaje: `Stock bajo: "${item.nombre}" (${item.cantidad} unidades)`,
                    item,
                })
            );
        } catch (err) {
            setError('No se pudo cargar el inventario.');
        }
    }, []);

    const fetchPedidos = useCallback(async () => {
        try {
            const { data } = await axios.get(PEDIDOS_URL);
            setPedidos(data);
        } catch (err) {
            setError('No se pudo cargar los pedidos.');
        }
    }, []);

    const agregarStock = useCallback(async (nuevoItem) => {
        const { data } = await axios.post(INVENTARIO_URL, nuevoItem);
        setInventario(prev => [...prev, data]);
        return data;
    }, []);

    const crearPedido = useCallback(async (pedido) => {
        const { data } = await axios.post(PEDIDOS_URL, pedido);
        setPedidos(prev => [data, ...prev]);
        NotificacionService.publicar('PEDIDO_CREADO', {
            mensaje: `Pedido asignado a "${data.cliente}" — ${data.producto}`,
            pedido: data,
        });
        return data;
    }, []);

    const actualizarEstadoPedido = useCallback(async (id, estado) => {
        const { data } = await axios.put(`${PEDIDOS_URL}/${id}/estado`, { estado });
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
        NotificacionService.publicar('PEDIDO_ACTUALIZADO', {
            mensaje: `Pedido #${id} actualizado a "${estado}"`,
            pedido: data,
        });
    }, []);

    useEffect(() => {
        setCargando(true);
        Promise.all([fetchInventario(), fetchPedidos()])
            .finally(() => setCargando(false));
    }, [fetchInventario, fetchPedidos]);

    return {
        inventario,
        pedidos,
        cargando,
        error,
        fetchInventario,
        fetchPedidos,
        agregarStock,
        crearPedido,
        actualizarEstadoPedido,
    };
}

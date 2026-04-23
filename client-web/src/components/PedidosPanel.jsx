import { useState } from 'react';

const ESTADOS = ['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'CANCELADO'];
const formInicial = { cliente: '', producto: '', cantidad: 1 };

const estadoColor = {
    PENDIENTE:  '#f59e0b',
    EN_RUTA:    '#3b82f6',
    ENTREGADO:  '#22c55e',
    CANCELADO:  '#ef4444',
};

export default function PedidosPanel({ pedidos, onCrear, onActualizarEstado }) {
    const [form, setForm] = useState(formInicial);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        try {
            await onCrear({ ...form, cantidad: parseInt(form.cantidad) });
            setForm(formInicial);
        } catch {
            alert('Error al crear el pedido.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 10 }}>
            <h2 style={{ marginTop: 0 }}>Gestión de Pedidos</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                <input
                    placeholder="Nombre del cliente"
                    value={form.cliente}
                    onChange={e => setForm({ ...form, cliente: e.target.value })}
                    required style={{ flex: 2, minWidth: 160 }}
                />
                <input
                    placeholder="Producto"
                    value={form.producto}
                    onChange={e => setForm({ ...form, producto: e.target.value })}
                    required style={{ flex: 2, minWidth: 160 }}
                />
                <input
                    type="number" placeholder="Cant." min="1"
                    value={form.cantidad}
                    onChange={e => setForm({ ...form, cantidad: e.target.value })}
                    required style={{ flex: 1, minWidth: 70 }}
                />
                <button type="submit" disabled={enviando}
                    style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                    {enviando ? 'Creando...' : 'Nuevo Pedido'}
                </button>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                        <th style={th}>#</th>
                        <th style={th}>Cliente</th>
                        <th style={th}>Producto</th>
                        <th style={th}>Cant.</th>
                        <th style={th}>Estado</th>
                        <th style={th}>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.length === 0
                        ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 16 }}>Sin pedidos registrados</td></tr>
                        : pedidos.map(p => (
                            <tr key={p.id}>
                                <td style={td}>{p.id}</td>
                                <td style={td}>{p.cliente}</td>
                                <td style={td}>{p.producto}</td>
                                <td style={td}>{p.cantidad}</td>
                                <td style={td}>
                                    <span style={{
                                        color: estadoColor[p.estado] || '#6b7280',
                                        fontWeight: 600
                                    }}>
                                        {p.estado}
                                    </span>
                                </td>
                                <td style={td}>
                                    <select
                                        value={p.estado}
                                        onChange={e => onActualizarEstado(p.id, e.target.value)}
                                        style={{ fontSize: 13 }}
                                    >
                                        {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </section>
    );
}

const th = { padding: '10px 14px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #e5e7eb' };
const td = { padding: '10px 14px', borderBottom: '1px solid #f3f4f6' };

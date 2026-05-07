import { useState } from 'react';

const ESTADOS = ['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'CANCELADO'];
const formInicial = { cliente: '', producto: '', cantidad: 1 };

const estadoBadge = {
    PENDIENTE:  { color: '#92400e', bg: '#fef3c7', border: '#fcd34d' },
    EN_RUTA:    { color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
    ENTREGADO:  { color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
    CANCELADO:  { color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
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
        <section style={card}>
            <div style={cardHeader}>
                <div style={cardHeaderBar} />
                <h2 style={cardTitle}>Gestión de Pedidos</h2>
                <span style={countBadge}>{pedidos.length} pedidos</span>
            </div>

            <form onSubmit={handleSubmit} style={formRow}>
                <input
                    placeholder="Nombre del cliente"
                    value={form.cliente}
                    onChange={e => setForm({ ...form, cliente: e.target.value })}
                    required
                    style={{ flex: 2, minWidth: 160 }}
                />
                <input
                    placeholder="Producto"
                    value={form.producto}
                    onChange={e => setForm({ ...form, producto: e.target.value })}
                    required
                    style={{ flex: 2, minWidth: 160 }}
                />
                <input
                    type="number" placeholder="Cant." min="1"
                    value={form.cantidad}
                    onChange={e => setForm({ ...form, cantidad: e.target.value })}
                    required
                    style={{ flex: 1, minWidth: 70 }}
                />
                <button
                    type="submit"
                    disabled={enviando}
                    style={{ ...btnGreen, flexShrink: 0 }}
                >
                    {enviando ? 'Creando…' : '+ Nuevo Pedido'}
                </button>
            </form>

            <div style={{ overflowX: 'auto' }}>
                <table style={table}>
                    <thead>
                        <tr>
                            <th style={{ ...th, width: 48 }}>#</th>
                            <th style={th}>Cliente</th>
                            <th style={th}>Producto</th>
                            <th style={{ ...th, textAlign: 'right' }}>Cant.</th>
                            <th style={th}>Estado</th>
                            <th style={th}>Cambiar estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={emptyCell}>Sin pedidos registrados</td>
                            </tr>
                        ) : pedidos.map(p => (
                            <tr key={p.id}>
                                <td style={{ ...td, color: '#94a3b8', fontWeight: 600 }}>#{p.id}</td>
                                <td style={{ ...td, fontWeight: 500 }}>{p.cliente}</td>
                                <td style={td}>{p.producto}</td>
                                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                    {p.cantidad}
                                </td>
                                <td style={td}>
                                    <EstadoBadge estado={p.estado} />
                                </td>
                                <td style={td}>
                                    <select
                                        value={p.estado}
                                        onChange={e => onActualizarEstado(p.id, e.target.value)}
                                        style={selectAccion}
                                    >
                                        {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function EstadoBadge({ estado }) {
    const s = estadoBadge[estado] || { color: '#374151', bg: '#f3f4f6', border: '#d1d5db' };
    return (
        <span style={{
            display: 'inline-block',
            fontSize: 12,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 20,
            color: s.color,
            background: s.bg,
            border: `1px solid ${s.border}`,
            letterSpacing: '0.3px',
        }}>
            {estado}
        </span>
    );
}

/* ── Styles ─────────────────────────────────────────────── */

const card = {
    marginBottom: 28,
    padding: '24px 28px',
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,.07), 0 4px 12px rgba(0,0,0,.05)',
    border: '1px solid #e2e8f0',
};

const cardHeader = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
};

const cardHeaderBar = {
    width: 4,
    height: 22,
    borderRadius: 4,
    background: '#16a34a',
    flexShrink: 0,
};

const cardTitle = {
    fontSize: 17,
    fontWeight: 700,
    color: '#0f172a',
    flex: 1,
};

const countBadge = {
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    padding: '3px 10px',
    borderRadius: 20,
};

const formRow = {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 24,
    alignItems: 'flex-end',
};

const btnGreen = {
    padding: '8px 20px',
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
};

const table = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
};

const th = {
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #e2e8f0',
    background: '#f8fafc',
};

const td = {
    padding: '11px 14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1e293b',
};

const emptyCell = {
    textAlign: 'center',
    padding: '32px 16px',
    color: '#94a3b8',
    fontSize: 14,
};

const selectAccion = {
    fontSize: 13,
    padding: '5px 8px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    background: '#f8fafc',
    color: '#374151',
    cursor: 'pointer',
    width: 'auto',
};

import { useState } from 'react';

const TIPOS = ['ESTANDAR', 'FRAGIL', 'PERECIBLE'];
const formInicial = { nombre: '', precio: '', cantidad: '', tipo: 'ESTANDAR' };

const tipoBadge = {
    ESTANDAR:  { color: '#374151', bg: '#f3f4f6', border: '#d1d5db' },
    FRAGIL:    { color: '#92400e', bg: '#fef3c7', border: '#fcd34d' },
    PERECIBLE: { color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
};

export default function InventarioPanel({ inventario, onAgregar }) {
    const [form, setForm] = useState(formInicial);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        try {
            await onAgregar({
                nombre:   form.nombre,
                precio:   parseFloat(form.precio),
                cantidad: parseInt(form.cantidad),
                tipo:     form.tipo,
            });
            setForm(formInicial);
        } catch {
            alert('Error al agregar item al inventario.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section style={card}>
            <div style={cardHeader}>
                <div style={cardHeaderBar} />
                <h2 style={cardTitle}>Inventario de Stock</h2>
                <span style={countBadge}>{inventario.length} items</span>
            </div>

            <form onSubmit={handleSubmit} style={formRow}>
                <input
                    placeholder="Nombre del producto"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                    style={{ flex: 2, minWidth: 160 }}
                />
                <input
                    type="number" placeholder="Precio"
                    value={form.precio}
                    onChange={e => setForm({ ...form, precio: e.target.value })}
                    required min="0" step="0.01"
                    style={{ flex: 1, minWidth: 90 }}
                />
                <input
                    type="number" placeholder="Cantidad"
                    value={form.cantidad}
                    onChange={e => setForm({ ...form, cantidad: e.target.value })}
                    required min="0"
                    style={{ flex: 1, minWidth: 90 }}
                />
                <select
                    value={form.tipo}
                    onChange={e => setForm({ ...form, tipo: e.target.value })}
                    style={{ flex: 1, minWidth: 130 }}
                >
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button
                    type="submit"
                    disabled={enviando}
                    style={{ ...btnPrimary, flexShrink: 0 }}
                >
                    {enviando ? 'Guardando…' : '+ Agregar'}
                </button>
            </form>

            <div style={{ overflowX: 'auto' }}>
                <table style={table}>
                    <thead>
                        <tr>
                            <th style={th}>Nombre</th>
                            <th style={{ ...th, textAlign: 'right' }}>Precio</th>
                            <th style={{ ...th, textAlign: 'right' }}>Cantidad</th>
                            <th style={th}>Tipo</th>
                            <th style={th}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventario.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={emptyCell}>Sin items en inventario</td>
                            </tr>
                        ) : inventario.map(item => {
                            const bajo = item.cantidad <= item.stockMinimo;
                            return (
                                <tr key={item.id} style={{ background: bajo ? '#fffbeb' : 'transparent' }}>
                                    <td style={td}><span style={{ fontWeight: 500 }}>{item.nombre}</span></td>
                                    <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                        ${item.precio?.toFixed(2)}
                                    </td>
                                    <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                        {item.cantidad}
                                    </td>
                                    <td style={td}>
                                        <TipoBadge tipo={item.tipo} />
                                    </td>
                                    <td style={td}>
                                        {bajo && (
                                            <span style={stockBajoBadge}>
                                                ⚠ Stock bajo
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function TipoBadge({ tipo }) {
    const s = tipoBadge[tipo] || tipoBadge.ESTANDAR;
    return (
        <span style={{
            display: 'inline-block',
            fontSize: 12,
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: 20,
            color: s.color,
            background: s.bg,
            border: `1px solid ${s.border}`,
            letterSpacing: '0.3px',
        }}>
            {tipo}
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
    background: '#2563eb',
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

const btnPrimary = {
    padding: '8px 20px',
    background: '#2563eb',
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

const stockBajoBadge = {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 600,
    color: '#92400e',
    background: '#fef3c7',
    border: '1px solid #fcd34d',
    padding: '2px 10px',
    borderRadius: 20,
};

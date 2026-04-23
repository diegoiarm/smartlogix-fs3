import { useState } from 'react';

const TIPOS = ['ESTANDAR', 'FRAGIL', 'PERECIBLE'];

const formInicial = { nombre: '', precio: '', cantidad: '', tipo: 'ESTANDAR' };

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

    const tipoColor = { ESTANDAR: '#6b7280', FRAGIL: '#f59e0b', PERECIBLE: '#10b981' };

    return (
        <section style={{ marginBottom: 32, padding: 24, border: '1px solid #e5e7eb', borderRadius: 10 }}>
            <h2 style={{ marginTop: 0 }}>Inventario de Stock</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
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
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                    style={{ flex: 1, minWidth: 120 }}>
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button type="submit" disabled={enviando}
                    style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                    {enviando ? 'Guardando...' : 'Agregar'}
                </button>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                        <th style={th}>Nombre</th>
                        <th style={th}>Precio</th>
                        <th style={th}>Cantidad</th>
                        <th style={th}>Tipo</th>
                        <th style={th}>Alerta</th>
                    </tr>
                </thead>
                <tbody>
                    {inventario.length === 0
                        ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 16 }}>Sin items en inventario</td></tr>
                        : inventario.map(item => (
                            <tr key={item.id} style={{ background: item.cantidad <= item.stockMinimo ? '#fef3c7' : 'white' }}>
                                <td style={td}>{item.nombre}</td>
                                <td style={td}>${item.precio?.toFixed(2)}</td>
                                <td style={td}>{item.cantidad}</td>
                                <td style={td}>
                                    <span style={{ color: tipoColor[item.tipo] || '#6b7280', fontWeight: 600 }}>
                                        {item.tipo}
                                    </span>
                                </td>
                                <td style={td}>
                                    {item.cantidad <= item.stockMinimo && (
                                        <span style={{ color: '#dc2626', fontWeight: 600 }}>STOCK BAJO</span>
                                    )}
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

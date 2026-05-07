import { useState, useEffect } from 'react';
import NotificacionService from '../services/NotificacionService';

const tipoConfig = {
    danger:  { bg: '#fee2e2', border: '#ef4444', icon: '⚠', label: '#991b1b' },
    success: { bg: '#d1fae5', border: '#22c55e', icon: '✓', label: '#065f46' },
    info:    { bg: '#dbeafe', border: '#3b82f6', icon: 'i', label: '#1e40af' },
};

export default function AlertaPanel() {
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        const push = (tipo) => (datos) =>
            setAlertas(prev => [{ id: Date.now(), tipo, ...datos }, ...prev].slice(0, 5));

        const u1 = NotificacionService.suscribir('STOCK_BAJO',         push('danger'));
        const u2 = NotificacionService.suscribir('PEDIDO_CREADO',      push('success'));
        const u3 = NotificacionService.suscribir('PEDIDO_ACTUALIZADO', push('info'));

        return () => { u1(); u2(); u3(); };
    }, []);

    if (alertas.length === 0) return null;

    return (
        <div style={container}>
            {alertas.map(a => {
                const c = tipoConfig[a.tipo] || tipoConfig.info;
                return (
                    <div key={a.id} style={{
                        ...toast,
                        background: c.bg,
                        borderLeft: `4px solid ${c.border}`,
                    }}>
                        <span style={{ color: c.label, fontWeight: 700, marginRight: 8, fontSize: 15 }}>
                            {c.icon}
                        </span>
                        <span style={{ color: c.label, fontSize: 13, flex: 1 }}>{a.mensaje}</span>
                        <button
                            onClick={() => setAlertas(prev => prev.filter(x => x.id !== a.id))}
                            style={closeBtn}
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

const container = {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 340,
};

const toast = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,.12)',
    gap: 4,
};

const closeBtn = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 20,
    lineHeight: 1,
    padding: '0 2px',
    color: '#6b7280',
    marginLeft: 8,
    flexShrink: 0,
};

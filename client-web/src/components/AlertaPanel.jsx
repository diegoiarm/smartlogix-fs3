import { useState, useEffect } from 'react';
import NotificacionService from '../services/NotificacionService';

/**
 * Componente Observer — escucha eventos del NotificacionService
 * y los muestra como alertas flotantes sin recargar la página.
 */
export default function AlertaPanel() {
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        const unsubBajo  = NotificacionService.suscribir('STOCK_BAJO', (datos) => {
            setAlertas(prev => [{ id: Date.now(), tipo: 'danger', ...datos }, ...prev].slice(0, 5));
        });
        const unsubPedido = NotificacionService.suscribir('PEDIDO_CREADO', (datos) => {
            setAlertas(prev => [{ id: Date.now(), tipo: 'success', ...datos }, ...prev].slice(0, 5));
        });
        const unsubUpdate = NotificacionService.suscribir('PEDIDO_ACTUALIZADO', (datos) => {
            setAlertas(prev => [{ id: Date.now(), tipo: 'info', ...datos }, ...prev].slice(0, 5));
        });

        return () => { unsubBajo(); unsubPedido(); unsubUpdate(); };
    }, []);

    if (alertas.length === 0) return null;

    const colores = { danger: '#fee2e2', success: '#dcfce7', info: '#dbeafe' };
    const bordes  = { danger: '#ef4444', success: '#22c55e', info: '#3b82f6' };

    return (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alertas.map(a => (
                <div key={a.id} style={{
                    background: colores[a.tipo],
                    borderLeft: `4px solid ${bordes[a.tipo]}`,
                    padding: '10px 16px',
                    borderRadius: 6,
                    maxWidth: 320,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    fontSize: 14,
                }}>
                    {a.mensaje}
                    <button
                        onClick={() => setAlertas(prev => prev.filter(x => x.id !== a.id))}
                        style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
                    >
                        x
                    </button>
                </div>
            ))}
        </div>
    );
}

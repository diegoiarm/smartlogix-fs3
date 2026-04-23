import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton, LogoutButton } from './components/LoginLogout';
import AlertaPanel from './components/AlertaPanel';
import InventarioPanel from './components/InventarioPanel';
import PedidosPanel from './components/PedidosPanel';
import { useLogistica } from './hooks/useLogistica';

function App() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const {
        inventario, pedidos, cargando, error,
        agregarStock, crearPedido, actualizarEstadoPedido,
    } = useLogistica();

    if (isLoading) return <div style={{ padding: 50 }}>Cargando sesion...</div>;

    return (
        <div style={{ padding: '32px 48px', fontFamily: 'system-ui, sans-serif', maxWidth: 1100, margin: '0 auto' }}>
            <AlertaPanel />

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 28, color: '#1e3a5f' }}>SmartLogix</h1>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
                        Plataforma de Gestion Logistica para PYMEs
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {isAuthenticated && (
                        <span style={{ fontSize: 14, color: '#374151' }}>
                            Hola, <strong>{user?.name}</strong>
                        </span>
                    )}
                    {isAuthenticated ? <LogoutButton /> : <LoginButton />}
                </div>
            </header>

            {!isAuthenticated ? (
                <div style={{ textAlign: 'center', padding: 64, color: '#6b7280' }}>
                    <p style={{ fontSize: 18 }}>Inicia sesion para acceder al panel de logistica.</p>
                    <LoginButton />
                </div>
            ) : (
                <>
                    {cargando && <p style={{ color: '#6b7280' }}>Cargando datos...</p>}
                    {error   && <p style={{ color: '#dc2626' }}>{error}</p>}

                    <InventarioPanel
                        inventario={inventario}
                        onAgregar={agregarStock}
                    />

                    <PedidosPanel
                        pedidos={pedidos}
                        onCrear={crearPedido}
                        onActualizarEstado={actualizarEstadoPedido}
                    />
                </>
            )}
        </div>
    );
}

export default App;

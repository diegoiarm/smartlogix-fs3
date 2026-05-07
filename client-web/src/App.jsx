import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton, LogoutButton } from './components/LoginLogout';
import AlertaPanel from './components/AlertaPanel';
import InventarioPanel from './components/InventarioPanel';
import PedidosPanel from './components/PedidosPanel';
import { useLogistica } from './hooks/useLogistica';

const styles = {
    topBar: {
        height: 4,
        background: 'linear-gradient(90deg, #1e3a5f 0%, #2563eb 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    page: {
        padding: '36px 48px 60px',
        maxWidth: 1140,
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 36,
        paddingBottom: 24,
        borderBottom: '1px solid #e2e8f0',
    },
    brandTitle: {
        fontSize: 26,
        fontWeight: 700,
        color: '#1e3a5f',
        letterSpacing: '-0.5px',
    },
    brandSub: {
        marginTop: 4,
        color: '#64748b',
        fontSize: 13,
    },
    userChip: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    userName: {
        fontSize: 14,
        color: '#374151',
        background: '#f1f5f9',
        padding: '5px 12px',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
    },
    loginPrompt: {
        textAlign: 'center',
        padding: '80px 32px',
        color: '#64748b',
    },
    loginPromptTitle: {
        fontSize: 18,
        marginBottom: 24,
        color: '#1e3a5f',
    },
    loadingText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#64748b',
        fontSize: 15,
    },
    statusBar: {
        marginBottom: 24,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
    },
    errorBadge: {
        background: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fca5a5',
        borderRadius: 6,
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 500,
    },
    loadingBadge: {
        background: '#eff6ff',
        color: '#2563eb',
        border: '1px solid #bfdbfe',
        borderRadius: 6,
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 500,
    },
};

function App() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const {
        inventario, pedidos, cargando, error,
        agregarStock, crearPedido, actualizarEstadoPedido,
    } = useLogistica();

    if (isLoading) return <div style={styles.loadingText}>Cargando sesión...</div>;

    return (
        <>
            <div style={styles.topBar} />
            <div style={{ paddingTop: 4 }}>
                <div style={styles.page}>
                    <AlertaPanel />

                    <header style={styles.header}>
                        <div>
                            <div style={styles.brandTitle}>SmartLogix</div>
                            <div style={styles.brandSub}>Plataforma de Gestión Logística para PYMEs</div>
                        </div>
                        <div style={styles.userChip}>
                            {isAuthenticated && (
                                <span style={styles.userName}>
                                    {user?.name}
                                </span>
                            )}
                            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
                        </div>
                    </header>

                    {!isAuthenticated ? (
                        <div style={styles.loginPrompt}>
                            <p style={styles.loginPromptTitle}>
                                Inicia sesión para acceder al panel de logística.
                            </p>
                            <LoginButton />
                        </div>
                    ) : (
                        <>
                            {(cargando || error) && (
                                <div style={styles.statusBar}>
                                    {cargando && <span style={styles.loadingBadge}>Cargando datos...</span>}
                                    {error    && <span style={styles.errorBadge}>{error}</span>}
                                </div>
                            )}

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
            </div>
        </>
    );
}

export default App;

import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return (
        <button
            onClick={() => loginWithRedirect()}
            style={btnLogin}
        >
            Iniciar Sesión
        </button>
    );
};

export const LogoutButton = () => {
    const { logout } = useAuth0();
    return (
        <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            style={btnLogout}
        >
            Cerrar Sesión
        </button>
    );
};

const btnLogin = {
    padding: '9px 22px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'background .15s',
};

const btnLogout = {
    padding: '7px 16px',
    background: 'transparent',
    color: '#64748b',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 13,
    transition: 'border-color .15s, color .15s',
};

import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const handleLogin = () => {
    alert("¡Botón presionado!"); // Si este alert NO sale, el problema es React/Vite.
    loginWithRedirect();         // Si el alert sale pero no redirige, el problema es Auth0.
  };
  return (
    <button 
      onClick={() => handleLogin()}
      style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
    >
      Iniciar Sesión con Auth0
    </button>
  );
};

export const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button 
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
    >
      Cerrar Sesión
    </button>
  );
};

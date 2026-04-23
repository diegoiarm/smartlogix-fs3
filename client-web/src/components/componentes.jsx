import { useAuth0 } from "@auth0/auth0-react";

// Botón de Iniciar Sesión
export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Iniciar Sesión</button>;
};

// Botón de Cerrar Sesión
export const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Cerrar Sesión
    </button>
  );
};

// Componente de Perfil (para ver si funcionó)
export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Cargando...</div>;

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} style={{ width: '50px', borderRadius: '50%' }} />
        <h2>Bienvenido, {user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

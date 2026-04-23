// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import React from 'react' 
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import './index.css'

const onRedirectCallback = (appState) => {
  // Limpia la URL del código de Auth0 sin recargar la página
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <Auth0Provider
      domain="dev-ubmindysuu07y4nv.us.auth0.com"
      clientId= "6JkbnEsHA9HMPFFVXRgLPPWSKgq4lnoH" //"KxQGgdjTsm1cMbn6dwxxyalNwzrhrtSi"
       onRedirectCallback={onRedirectCallback} 
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://api-productos-auth0/"
      }}
      cacheLocation="localstorage" 
      useRefreshTokens={true}      
    >
      <App />
    </Auth0Provider>
  
   </React.StrictMode> 
)

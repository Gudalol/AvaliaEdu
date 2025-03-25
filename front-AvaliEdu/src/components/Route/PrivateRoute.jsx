import { Navigate } from "react-router-dom";

// Componente para proteger rotas
// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole"); // Pegando a role salva

  if (!userRole) {
    return <Navigate to="/" />; // Se não estiver autenticado, volta para login
  }

  // eslint-disable-next-line react/prop-types
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Se não tiver permissão, redireciona para home
  }

  return children;
};

export default PrivateRoute;

import { Navigate } from "react-router-dom";

// Componente para proteger rotas
const PrivateRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole"); // Pegando a role salva

  if (!userRole) {
    return <Navigate to="/" />; // Se não estiver autenticado, volta para login
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Se não tiver permissão, redireciona para home
  }

  return children;
};

export default PrivateRoute;

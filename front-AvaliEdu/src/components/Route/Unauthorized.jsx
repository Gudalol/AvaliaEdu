// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>🚫 Acesso Negado 🚫</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to="/home">Voltar para a Home</Link>
    </div>
  );
};

export default Unauthorized;

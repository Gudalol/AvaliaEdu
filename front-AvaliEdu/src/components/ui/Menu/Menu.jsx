// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import HomeIcon from "@img/Home_Icone.png";
import Logo from "@img/Logo_Icone.png";
import alunosIcon from "@img/alunos_Icone.png";
import disciplinasIcon from "@img/disciplinas_Icone.png";
import avaliacoesIcon from "@img/avaliacoes_Icone.png"; 
import professoresIcon from "@img/professores_Icone.png";
import usuarioIcone from "@img/usuario-Icone.png";

// eslint-disable-next-line react/prop-types
const MenuItem = ({ to, icon, label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      component={Link}
      to={to}
      sx={{
        width: 106,
        height: 93.23,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 1,
        display: "flex",
        textDecoration: "none",
        transition: "transform 0.3s ease-in-out, color 0.3s",
        transform: isHovered ? "scale(1.15)" : "scale(1)",
        color: isHovered ? "#000" : "#09b800",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img style={{ width: 64, height: 64 }} src={icon} alt={label} />
      <Typography
        sx={{
          width: 106,
          height: 24.23,
          textAlign: "center",
          fontSize: 14,
          fontFamily: "Inter",
          fontWeight: "600",
          wordWrap: "break-word",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

const Menu = () => {
  // Função para redirecionar para a página de admin
  const redirecionarParaAdministradores = () => {
    window.location.href = "/Administradores"; // URL da página de administração
  };

  return (
    <div
      style={{
        width: "90%",
        height: "90%",
        justifyContent: "space-between",
        alignItems: "center",
        display: "inline-flex",
        marginLeft: "3%",
      }}
    >
      <Box
        component={Link}
        to={"/"}
        sx={{
          width: 200,
          height: 66.67,
        }}
      >
        <img style={{ width: 100, height: 100 }} src={Logo} alt="Logo" />
      </Box>
      
      <Box
        sx={{
          width: 400,
          marginLeft: -10,
          height: 95.33,
          justifyContent: "space-between",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <MenuItem to="/home" icon={HomeIcon} label={"HOME"} />
        <MenuItem to="/alunos" icon={alunosIcon} label={"ALUNOS"} />
        <MenuItem to="/disciplinas" icon={disciplinasIcon} label={"DISCIPLINAS"} />
        <MenuItem to="/avaliacoes" icon={avaliacoesIcon} label={"AVALIAÇÕES"} />
        <MenuItem to="/professores" icon={professoresIcon} label={"PROFESSORES"} />
      </Box>

      <Box
        sx={{
          width: 174,
          height: 40,
          justifyContent: "space-between",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <img
          style={{ width: 70, height: 70, cursor: "pointer" }}
          src={usuarioIcone}
          alt="Ícone para usuário"
          onClick={redirecionarParaAdministradores}
        />
      </Box>
    </div>
  );
};

export default Menu;

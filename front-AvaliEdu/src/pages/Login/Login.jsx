// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import planinLogo from "@img/Logo_Icone.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, senha: password })
      });
  
      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }
  
      const data = await response.json();
      console.log("Usuário autenticado:", data.user, "Role:", data.role);
      // Armazena a role e o token
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("token", data.token); // <-- Armazene o token aqui
      localStorage.setItem("userEmail", data.user); // data.user contém o email do usuário autenticado

  
      if (data.role === "ADMIN") {
        navigate("/Administradores");
      } else if (data.role === "TEACHER") {
        navigate("/professores");
      } else {
        navigate("/home");
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro no login:", error);
      setOpenSnackbar(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
      disableGutters
    >
      <Box
        component="img"
        src={planinLogo}
        alt="Logo"
        sx={{ width: "30%", maxWidth: 200, marginBottom: 3 }}
      />
      
      <Typography variant="h5" sx={{ color: "#09b800", fontWeight: "bold", textAlign: "center", mb: 3 }}>
        Colocar alguma<br />
        frase top aqui
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleCloseSnackbar}>
          Incorrect credentials!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Login;

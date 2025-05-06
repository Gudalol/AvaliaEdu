// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import planinLogo from "@img/Logo_Icone.png";
import sideImage from "@img/sideImage.png"; // Importando a imagem

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, senha: password })
      });
  
      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }
  
      const data = await response.json();
      console.log("Usuário autenticado:", data.user, "Role:", data.role);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("email", data.nome);

      navigate("/home");
      
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
      maxWidth={false} // Ocupa a tela toda
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        margin: 0,
        padding: 0
      }}
    >
      {/* Imagem do lado esquerdo */}
      <Box
        component="img"
        src={sideImage}
        alt="Side Image"
        sx={{
          width: "50vw", // ou defina um valor fixo como "600px"
          height: "100vh",
          objectFit: "cover",
          display: "block"
        }}
      />
    
      {/* Conteúdo do formulário de login */}
      <Box
        sx={{
          width: "50vw", // Ocupa o restante da tela
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box
          component="img"
          src={planinLogo}
          alt="Logo"
          sx={{ width: "30%", maxWidth: 200, marginBottom: 3 }}
        />

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
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setemail(e.target.value)}
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
      </Box>
    </Container>
  );
};

export default Login;

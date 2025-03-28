// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import sideImage from "@img/Wavy_Bus-39_Single-07-Photoroom.png";
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
  
      // Salvando a role no localStorage para usarmos depois
      localStorage.setItem("userRole", data.role);
  
      // Redirecionando baseado na permissão
      if (data.role === "ADMIN") {
        navigate("/admin");
      } else if (data.role === "TEACHER") {
        navigate("/professor");
      } else {
        navigate("/aluno");
      }
  
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
        height: "90vh",
      }}
      disableGutters
    >
      <Grid container spacing={5}>
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "110%",
              width: "110%",
            }}
          >
            <img
              src={sideImage}
              alt="Imagem Lateral"
              style={{
                maxWidth: "90%",
                maxHeight: "100%",
                marginLeft: "-15rem",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              component="img"
              src={planinLogo}
              alt="Logo"
              sx={{
                width: "50%",
                marginTop: "2rem",
                maxWidth: 920,
              }}
            />
            <Box
              sx={{
                marginTop: "-15rem",
                width: "100%",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ marginBottom: "0.5rem", width: "100%", marginTop: "5rem" }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: "0.5rem", width: "100%" }}
              />
                <Button variant="contained" color="primary" style={{ width: "100%" }} onClick={handleLogin}>
                  Login
                </Button>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  severity="error"
                  onClose={handleCloseSnackbar}
                >
                  Incorrect credentials!
                </MuiAlert>
              </Snackbar>
            </Box>
            <Box
              sx={{
                width: "100%",
                padding: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                marginTop="-15rem"
                variant="h5"
                style={{
                  color: "#09b800",
                  fontWeight: "bold",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Colocar alguma<br />
                frase top aqui
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
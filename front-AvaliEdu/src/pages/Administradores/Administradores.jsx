// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Menu } from "@ui/Menu";
import { administradorService } from "@services"; // Supondo que você tenha um serviço similar para administradores
import {
  Grid,
  Paper,
  Typography,
  Modal,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  CircularProgress,
  TextField,
  Button,
  Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Função auxiliar para garantir que o dado seja um array
const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && data.content && Array.isArray(data.content)) return data.content;
  return [];
};

const Administradores = () => {
  const [administradores, setAdministradores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroEmail, setFiltroEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoAdministrador, setNovoAdministrador] = useState({email: "", senha: "" });
  const [administradorEditando, setAdministradorEditando] = useState(null);

  // Função para obter o token armazenado no localStorage
  const getAuthToken = () => localStorage.getItem("token");

  useEffect(() => {
    const carregarAdministradores = async () => {
      try {
        const token = getAuthToken();
        const response = await administradorService.getAll(token); // Passando o token para o serviço
        const administradoresData = extractArray(response.data);
        console.log("Administradores carregados:", administradoresData);
        setAdministradores(administradoresData);
      } catch (error) {
        console.error("Erro ao carregar administradores:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarAdministradores();
  }, []);

  const handleExcluirAdministrador = async (id) => {
    if (!id) {
      console.error("Tentativa de excluir administrador sem ID");
      alert("Este administrador não possui um ID válido e não pode ser excluído.");
      return;
    }
    const confirmar = window.confirm("Tem certeza que deseja excluir este administrador?");
    if (!confirmar) return;
    try {
      const token = getAuthToken();
      await administradorService.delete(id, token); // Passando o token para o serviço
      console.log("Administrador excluído, id:", id);
      setAdministradores(administradores.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Erro ao excluir administrador:", error);
    }
  };

  const handleSalvarAdministrador = async () => {
    if (!novoAdministrador.email || !novoAdministrador.senha) {
      alert("Preencha todos os campos!");
      return;
    }
    try {
      const administradorFormatado = { ...novoAdministrador };
      const token = getAuthToken();
      await administradorService.create(administradorFormatado, token); // Passando o token para o serviço
      console.log("Administrador criado com sucesso! Recarregando lista...");
      const response = await administradorService.getAll(token); // Passando o token para o serviço
      setAdministradores(extractArray(response.data));
      setIsModalOpen(false);
      setNovoAdministrador({email: "", senha: "" });
    } catch (error) {
      console.error("Erro ao salvar administrador:", error);
      alert("Erro ao salvar administrador. Verifique os dados e tente novamente.");
    }
  };

  const handleAbrirEdicao = (administrador) => {
    console.log("Administrador para edição:", administrador);
    if (!administrador.id) {
      console.error("Administrador sem ID:", administrador);
      alert("Este administrador não possui um ID válido e não pode ser editado.");
      return;
    }
    setAdministradorEditando({ ...administrador });
  };

  const handleSalvarEdicao = async () => {
    if (!administradorEditando) {
      console.error("Erro: Nenhum administrador selecionado para edição.");
      alert("Erro: Nenhum administrador selecionado para edição.");
      return;
    }
    if (!administradorEditando.id) {
      console.error("Erro: ID do administrador não está definido.", administradorEditando);
      alert("Erro: ID do administrador não está definido.");
      return;
    }
    try {
      console.log("Salvando edição do administrador:", administradorEditando);
      const token = getAuthToken();
      await administradorService.update(administradorEditando.id, administradorEditando, token); // Passando o token para o serviço
      console.log("Administrador atualizado com sucesso! Recarregando lista...");
      const response = await administradorService.getAll(token); // Passando o token para o serviço
      setAdministradores(extractArray(response.data));
      setAdministradorEditando(null);
    } catch (error) {
      console.error("Erro ao editar administrador:", error);
      alert("Erro ao editar administrador.");
    }
  };

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Menu />
      </Grid>

      <Grid item xs={10}>
        <TextField
          label="Filtrar por Email"
          variant="outlined"
          value={filtroEmail}
          onChange={(e) => setFiltroEmail(e.target.value)}
          fullWidth
        />
      </Grid>

      <Grid item xs={10} textAlign="right">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{ backgroundColor: "#FFC107", color: "#fff" }} // Cor amarela
        >
          Novo Administrador
        </Button>
      </Grid>

      {isLoading ? (
        <Grid item xs={10} textAlign="center">
          <CircularProgress />
        </Grid>
      ) : administradores.length === 0 ? (
        <Grid item xs={10} textAlign="center">
          <Typography variant="h5">Nenhum administrador cadastrado</Typography>
        </Grid>
      ) : (
        <Grid item xs={10}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {administradores
                  .filter((administrador) =>
                    administrador.email.toLowerCase().includes(filtroEmail.toLowerCase())
                  )
                  .map((administrador, index) => (
                    <TableRow key={administrador.id || `administrador-${index}-${administrador.email}`}>
                      <TableCell>{administrador.email}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleAbrirEdicao(administrador)}
                          sx={{ backgroundColor: "#09b800", color: "#fff", minWidth: "40px", p: "5px", mr: 1 }}
                        >
                          <EditIcon sx={{ color: "#fff" }} />
                        </Button>
                        <Button
                          onClick={() => handleExcluirAdministrador(administrador.id)}
                          sx={{ backgroundColor: "#ff0000", color: "#fff", minWidth: "40px", p: "5px" }}
                        >
                          <DeleteIcon sx={{ color: "#fff" }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {/* Modal para criar novo administrador */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h6" mb={2}>Novo Administrador</Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={novoAdministrador.email}
            onChange={(e) => setNovoAdministrador({ ...novoAdministrador, email: e.target.value })}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={novoAdministrador.senha}
            onChange={(e) => setNovoAdministrador({ ...novoAdministrador, senha: e.target.value })}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#FFC107" }}
            onClick={handleSalvarAdministrador}
          >
            Salvar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar administrador */}
      <Modal open={administradorEditando !== null} onClose={() => setAdministradorEditando(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h6" mb={2}>Editar Administrador</Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={administradorEditando?.email || ""}
            onChange={(e) => setAdministradorEditando({ ...administradorEditando, email: e.target.value })}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={administradorEditando?.senha || ""}
            onChange={(e) => setAdministradorEditando({ ...administradorEditando, senha: e.target.value })}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#FFC107" }}
            onClick={handleSalvarEdicao}
          >
            Salvar
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Administradores;

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Menu } from "@ui/Menu";
import { alunoService } from "@services";
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

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroEmail, setFiltroEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoAluno, setNovoAluno] = useState({ nome: "", email: "", idade: "", senha: "" });
  const [alunoEditando, setAlunoEditando] = useState(null);

  // Obtém o token, a role e o email do usuário logado
  const getAuthToken = () => localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // "USER", "TEACHER", "ADMIN"
  const loggedUserEmail = localStorage.getItem("userEmail"); // Email do aluno logado

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        const token = getAuthToken();
        const response = await alunoService.getAll(token); // Passando o token para o serviço
        const alunosData = extractArray(response.data);
        console.log("Alunos carregados:", alunosData);
        setAlunos(alunosData);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarAlunos();
  }, []);

  const handleExcluirAluno = async (id) => {
    if (!id) {
      console.error("Tentativa de excluir aluno sem ID");
      alert("Este aluno não possui um ID válido e não pode ser excluído.");
      return;
    }
    const confirmar = window.confirm("Tem certeza que deseja excluir este aluno?");
    if (!confirmar) return;
    try {
      const token = getAuthToken();
      await alunoService.delete(id, token); // Passando o token para o serviço
      console.log("Aluno excluído, id:", id);
      setAlunos(alunos.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  };

  const handleSalvarAluno = async () => {
    if (!novoAluno.nome || !novoAluno.email || !novoAluno.idade || !novoAluno.senha) {
      alert("Preencha todos os campos!");
      return;
    }
    try {
      const alunoFormatado = { ...novoAluno, idade: parseInt(novoAluno.idade, 10) };
      const token = getAuthToken();
      await alunoService.create(alunoFormatado, token); // Passando o token para o serviço
      console.log("Aluno criado com sucesso! Recarregando lista...");
      const response = await alunoService.getAll(token); // Passando o token para o serviço
      setAlunos(extractArray(response.data));
      setIsModalOpen(false);
      setNovoAluno({ nome: "", email: "", idade: "", senha: "" });
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      alert("Erro ao salvar aluno. Verifique os dados e tente novamente.");
    }
  };

  const handleAbrirEdicao = (aluno) => {
    console.log("Aluno para edição:", aluno);
    if (!aluno.id) {
      console.error("Aluno sem ID:", aluno);
      alert("Este aluno não possui um ID válido e não pode ser editado.");
      return;
    }
    // Se o usuário logado for USER, permitir edição apenas se o aluno for o próprio usuário
    if (userRole === "USER" && aluno.email.toLowerCase() !== loggedUserEmail?.toLowerCase()) {
      alert("Você só pode editar seu próprio perfil!");
      return;
    }
    setAlunoEditando({ ...aluno });
  };

  const handleSalvarEdicao = async () => {
    if (!alunoEditando) {
      console.error("Erro: Nenhum aluno selecionado para edição.");
      alert("Erro: Nenhum aluno selecionado para edição.");
      return;
    }
    if (!alunoEditando.id) {
      console.error("Erro: ID do aluno não está definido.", alunoEditando);
      alert("Erro: ID do aluno não está definido.");
      return;
    }
    try {
      console.log("Salvando edição do aluno:", alunoEditando);
      const token = getAuthToken();
      await alunoService.update(alunoEditando.id, alunoEditando, token); // Passando o token para o serviço
      console.log("Aluno atualizado com sucesso! Recarregando lista...");
      const response = await alunoService.getAll(token); // Passando o token para o serviço
      setAlunos(extractArray(response.data));
      setAlunoEditando(null);
    } catch (error) {
      console.error("Erro ao editar aluno:", error);
      alert("Erro ao editar aluno.");
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

      {/* Permite que apenas ADMIN veja o botão "Novo Aluno" */}
      {userRole === "ADMIN" && (
        <Grid item xs={10} textAlign="right">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{ backgroundColor: "#09b800", color: "#fff" }}
          >
            Novo Aluno
          </Button>
        </Grid>
      )}

      {isLoading ? (
        <Grid item xs={10} textAlign="center">
          <CircularProgress />
        </Grid>
      ) : alunos.length === 0 ? (
        <Grid item xs={10} textAlign="center">
          <Typography variant="h5">Nenhum aluno cadastrado</Typography>
        </Grid>
      ) : (
        <Grid item xs={10}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Idade</TableCell>
                  <TableCell>Senha</TableCell>
                  {/* Exibe a coluna "Ações" se o usuário for ADMIN ou se for USER (mas apenas para seu próprio registro) */}
                  {(userRole === "ADMIN" || userRole === "USER") && <TableCell>Ações</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {alunos
                  .filter((aluno) =>
                    aluno.email.toLowerCase().includes(filtroEmail.toLowerCase())
                  )
                  .map((aluno, index) => (
                    <TableRow key={aluno.id || `aluno-${index}-${aluno.email}`}>
                      <TableCell>{aluno.nome}</TableCell>
                      <TableCell>{aluno.email}</TableCell>
                      <TableCell>{aluno.idade}</TableCell>
                      <TableCell>{aluno.senha}</TableCell>
                      {(userRole === "ADMIN" || userRole === "USER") && (
                        <TableCell>
                          {/* Se o usuário for ADMIN, mostrar sempre os botões */}
                          {userRole === "ADMIN" && (
                            <>
                              <Button
                                onClick={() => handleAbrirEdicao(aluno)}
                                sx={{
                                  backgroundColor: "#09b800",
                                  color: "#fff",
                                  minWidth: "40px",
                                  p: "5px",
                                  mr: 1,
                                  "&:hover": {
                                    backgroundColor: "#fff",
                                    color: "#09b800"
                                  }
                                }}
                              >
                                <EditIcon sx={{ color: "inherit" }} />
                              </Button>
                              <Button
                                onClick={() => handleExcluirAluno(aluno.id)}
                                sx={{
                                  backgroundColor: "#ff0000",
                                  color: "#fff",
                                  minWidth: "40px",
                                  p: "5px",
                                  "&:hover": {
                                    backgroundColor: "#fff",
                                    color: "#ff0000"
                                  }
                                }}
                              >
                                <DeleteIcon sx={{ color: "inherit" }} />
                              </Button>
                            </>
                          )}
                          {/* Se o usuário for USER, mostrar botões apenas se o registro for o dele */}
                          {userRole === "USER" &&
                            aluno.email.toLowerCase() === loggedUserEmail?.toLowerCase() && (
                              <>
                                <Button
                                  onClick={() => handleAbrirEdicao(aluno)}
                                  sx={{
                                    backgroundColor: "#09b800",
                                    color: "#fff",
                                    minWidth: "40px",
                                    p: "5px",
                                    mr: 1,
                                    "&:hover": {
                                      backgroundColor: "#fff",
                                      color: "#09b800"
                                    }
                                  }}
                                >
                                  <EditIcon sx={{ color: "inherit" }} />
                                </Button>
                                <Button
                                  onClick={() => handleExcluirAluno(aluno.id)}
                                  sx={{
                                    backgroundColor: "#ff0000",
                                    color: "#fff",
                                    minWidth: "40px",
                                    p: "5px",
                                    "&:hover": {
                                      backgroundColor: "#fff",
                                      color: "#ff0000"
                                    }
                                  }}
                                >
                                  <DeleteIcon sx={{ color: "inherit" }} />
                                </Button>
                              </>
                            )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {/* Modal para criar novo aluno */}
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
          <Typography variant="h6" mb={2}>Novo Aluno</Typography>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={novoAluno.nome}
            onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={novoAluno.email}
            onChange={(e) => setNovoAluno({ ...novoAluno, email: e.target.value })}
          />
          <TextField
            label="Idade"
            type="number"
            fullWidth
            margin="normal"
            value={novoAluno.idade}
            onChange={(e) => setNovoAluno({ ...novoAluno, idade: e.target.value })}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={novoAluno.senha}
            onChange={(e) => setNovoAluno({ ...novoAluno, senha: e.target.value })}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#09b800" }}
            onClick={handleSalvarAluno}
          >
            Salvar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar aluno */}
      <Modal open={alunoEditando !== null} onClose={() => setAlunoEditando(null)}>
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
          <Typography variant="h6" mb={2}>Editar Aluno</Typography>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={alunoEditando?.nome || ""}
            onChange={(e) => setAlunoEditando({ ...alunoEditando, nome: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={alunoEditando?.email || ""}
            onChange={(e) => setAlunoEditando({ ...alunoEditando, email: e.target.value })}
          />
          <TextField
            label="Idade"
            type="number"
            fullWidth
            margin="normal"
            value={alunoEditando?.idade || ""}
            onChange={(e) => setAlunoEditando({ ...alunoEditando, idade: e.target.value })}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={alunoEditando?.senha || ""}
            onChange={(e) => setAlunoEditando({ ...alunoEditando, senha: e.target.value })}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#09b800" }}
            onClick={handleSalvarEdicao}
          >
            Salvar
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Alunos;
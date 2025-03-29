// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Menu } from "@ui/Menu";
import { professorService } from "@services";
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
import PermissionButton from "@comp/PermissionButton";

const userRole = localStorage.getItem("userRole"); // "TEACHER", "ADMIN", ou "USER"
const loggedProfessorEmail = localStorage.getItem("userEmail"); // Email do professor logado

const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [novoProfessor, setNovoProfessor] = useState({ nome: "", email: "" });
  const [professorEditando, setProfessorEditando] = useState(null);
  const [filtroEmail, setFiltroEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarProfessores = async () => {
      try {
        const response = await professorService.getAll();
        console.log("Professores carregados:", response.data);
        setProfessores(response.data);
      } catch (error) {
        console.error("Erro ao carregar professores:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarProfessores();
  }, []);

  const handleSubmit = async () => {
    if (!novoProfessor.nome || !novoProfessor.email) {
      alert("Preencha todos os campos!");
      return;
    }
    try {
      const professorFormatado = { ...novoProfessor };
      await professorService.create(professorFormatado);
      console.log("Professor criado com sucesso! Recarregando lista...");
      const response = await professorService.getAll();
      setProfessores(response.data);
      setIsModalOpen(false);
      setNovoProfessor({ nome: "", email: "" });
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
      alert("Erro ao salvar professor. Verifique os dados e tente novamente.");
    }
  };

  const handleExcluirProfessor = async (id) => {
    if (!id) {
      console.error("Tentativa de excluir professor sem ID");
      alert("Este professor não possui um ID válido e não pode ser excluído.");
      return;
    }
    const confirmar = window.confirm("Tem certeza que deseja excluir este professor?");
    if (!confirmar) return;
    try {
      await professorService.delete(id);
      setProfessores(professores.filter(p => p.id !== id));
      console.log("Professor excluído, id:", id);
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
    }
  };

  const handleAbrirEdicao = (professor) => {
    console.log("Professor para edição:", professor);
    if (!professor.id) {
      console.error("Professor sem ID:", professor);
      alert("Este professor não possui um ID válido e não pode ser editado.");
      return;
    }
    // Se o usuário for TEACHER, permitir edição apenas se o email corresponder
    if (userRole === "TEACHER" && professor.email !== loggedProfessorEmail) {
      alert("Você só pode editar seu próprio perfil!");
      return;
    }
    setProfessorEditando({ ...professor });
    setIsEditModalOpen(true);
  };

  const handleSalvarEdicao = async () => {
    if (!professorEditando) {
      console.error("Erro: Nenhum professor selecionado para edição.");
      alert("Erro: Nenhum professor selecionado para edição.");
      return;
    }
    if (!professorEditando.id) {
      console.error("Erro: ID do professor não está definido.", professorEditando);
      alert("Erro: ID do professor não está definido.");
      return;
    }
    try {
      console.log("Salvando edição do professor:", professorEditando);
      await professorService.update(professorEditando.id, professorEditando);
      console.log("Professor atualizado com sucesso! Recarregando lista...");
      const response = await professorService.getAll();
      setProfessores(response.data);
      setIsEditModalOpen(false);
      setProfessorEditando(null);
    } catch (error) {
      console.error("Erro ao editar professor:", error);
      alert("Erro ao editar professor.");
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

      {/* Botão "Novo Professor" aparece somente para ADMIN */}
      {userRole === "ADMIN" && (
        <Grid item xs={12} textAlign="right" p={3}>
          <PermissionButton userRole={userRole} allowedRoles={["ADMIN"]} onClick={() => setIsModalOpen(true)}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ backgroundColor: "#09b800" }}>
              Novo Professor
            </Button>
          </PermissionButton>
        </Grid>
      )}

      {isLoading ? (
        <Grid item xs={10} textAlign="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid item xs={10}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  {/* Exibir a coluna "Ações" somente para ADMIN ou para TEACHER que pode editar seu próprio perfil */}
                  {userRole === "ADMIN" || userRole === "TEACHER" ? <TableCell>Ações</TableCell> : null}
                  </TableRow>
                  </TableHead>
                  <TableBody>
                    {professores
                    .filter(professor =>
                      professor.email.toLowerCase().includes(filtroEmail.toLowerCase())
                    )
                    .map((professor, index) => (
                      <TableRow key={professor.id || `professor-${index}-${professor.email}`}>
                      <TableCell>{professor.nome}</TableCell>
                      <TableCell>{professor.email}</TableCell>
                      <TableCell>
                        {/* Se for ADMIN, mostrar editar e excluir */}
                        {userRole === "ADMIN" && (
                        <>
                          <PermissionButton userRole={userRole} allowedRoles={["ADMIN"]} onClick={() => handleAbrirEdicao(professor)}>
                          <Button
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
                          </PermissionButton>
                          <PermissionButton userRole={userRole} allowedRoles={["ADMIN"]} onClick={() => handleExcluirProfessor(professor.id)}>
                          <Button
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
                          </PermissionButton>
                        </>
                        )}

                        {/* Se for TEACHER e for o próprio professor logado, mostrar editar */}
                        {userRole === "TEACHER" && professor.email === loggedProfessorEmail && (
                        <PermissionButton userRole={userRole} allowedRoles={["TEACHER"]} onClick={() => handleAbrirEdicao(professor)}>
                          <Button
                          sx={{
                            backgroundColor: "#09b800",
                            color: "#fff",
                            minWidth: "40px",
                            p: "5px",
                            "&:hover": {
                            backgroundColor: "#fff",
                            color: "#09b800"
                            }
                          }}
                          >
                          <EditIcon sx={{ color: "inherit" }} />
                          </Button>
                        </PermissionButton>
                        )}
                      </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </TableContainer>
              </Grid>
              )}

              {/* Modal para criar novo professor */}
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
          <Typography variant="h6" mb={2}>Novo Professor</Typography>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={novoProfessor.nome}
            onChange={(e) => setNovoProfessor({ ...novoProfessor, nome: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={novoProfessor.email}
            onChange={(e) => setNovoProfessor({ ...novoProfessor, email: e.target.value })}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#09b800" }}
            onClick={handleSubmit}
          >
            Salvar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar professor */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
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
          <Typography variant="h6" mb={2}>Editar Professor</Typography>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={professorEditando?.nome || ""}
            onChange={(e) => setProfessorEditando({ ...professorEditando, nome: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={professorEditando?.email || ""}
            onChange={(e) => setProfessorEditando({ ...professorEditando, email: e.target.value })}
          />
          <Button 
            variant="contained" 
            onClick={handleSalvarEdicao}
            sx={{ mt: 2, backgroundColor: "#09b800" }}
          >
            Salvar
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Professores;

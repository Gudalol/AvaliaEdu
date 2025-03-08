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
    // Validação dos campos
    if (!novoProfessor.nome || !novoProfessor.email) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const professorFormatado = { ...novoProfessor };
      await professorService.create(professorFormatado);
      console.log("Professor criado com sucesso! Recarregando lista...");
      // Recarrega a lista para obter o professor com ID
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
    setProfessorEditando({ ...professor }); // Cria uma cópia para evitar problemas de referência
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
      // Recarrega a lista para garantir que os dados estão atualizados
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

      <Grid item xs={12} textAlign="right" p={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{ backgroundColor: "#09b800" }}
        >
          Novo Professor
        </Button>
      </Grid>

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
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {professores
                  .filter(professor =>
                    professor.email.toLowerCase().includes(filtroEmail.toLowerCase())
                  )
                  .map((professor, index) => {
                    const hasValidId = Boolean(professor.id);
                    return (
                      <TableRow key={professor.id || `professor-${index}-${professor.email}`}>
                        <TableCell>{professor.nome}</TableCell>
                        <TableCell>{professor.email}</TableCell>
                        <TableCell>
                          <Button 
                            onClick={() => handleAbrirEdicao(professor)}
                            sx={{ backgroundColor: "#09b800", color: "#fff", minWidth: "40px", p: "5px", mr: 1 }}
                            disabled={!hasValidId}
                          >
                            <EditIcon sx={{ color: "#fff" }} />
                          </Button>
                          <Button 
                            onClick={() => handleExcluirProfessor(professor.id)}
                            sx={{ backgroundColor: "#ff0000", color: "#fff", minWidth: "40px", p: "5px" }}
                            disabled={!hasValidId}
                          >
                            <DeleteIcon sx={{ color: "#fff" }} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {/* Modal para criar novo professor */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4 
        }}>
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
            onClick={handleSubmit}
            sx={{ mt: 2, backgroundColor: "#09b800" }}
          >
            Salvar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar professor */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4 
        }}>
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

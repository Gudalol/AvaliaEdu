// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Menu } from '@ui/Menu';
import { disciplinaService } from '@services';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Função auxiliar para garantir que o dado seja um array
const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && data.content && Array.isArray(data.content)) return data.content;
  return [];
};

const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [novaDisciplina, setNovaDisciplina] = useState({ nome: '' });
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const [filtroNome, setFiltroNome] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Obtém a role do usuário do localStorage (por exemplo, "ADMIN", "TEACHER", "USER")
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const carregarDisciplinas = async () => {
      try {
        const response = await disciplinaService.getAll();
        const discArray = extractArray(response.data);
        console.log("Disciplinas carregadas:", discArray);
        setDisciplinas(discArray);
      } catch (error) {
        console.error("Erro ao carregar disciplinas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarDisciplinas();
  }, []);

  const handleSubmit = async () => {
    if (!novaDisciplina.nome) {
      alert("Preencha o nome da disciplina!");
      return;
    }
    try {
      const response = await disciplinaService.create(novaDisciplina);
      console.log("Disciplina criada com sucesso! Recarregando lista...", response.data);
      const res = await disciplinaService.getAll();
      setDisciplinas(extractArray(res.data));
      setIsModalOpen(false);
      setNovaDisciplina({ nome: '' });
    } catch (error) {
      console.error("Erro ao criar disciplina:", error);
      alert("Erro ao criar disciplina.");
    }
  };

  const handleExcluirDisciplina = async (id) => {
    if (!id) {
      console.error("Tentativa de excluir disciplina sem ID");
      alert("Esta disciplina não possui um ID válido e não pode ser excluída.");
      return;
    }
    const confirmar = window.confirm("Tem certeza que deseja excluir esta disciplina?");
    if (!confirmar) return;
    try {
      await disciplinaService.delete(id);
      console.log("Disciplina excluída, id:", id);
      setDisciplinas(disciplinas.filter(d => d.id !== id));
    } catch (error) {
      console.error("Erro ao excluir disciplina:", error);
    }
  };

  const handleAbrirEdicao = (disciplina) => {
    console.log("Disciplina para edição:", disciplina);
    if (!disciplina.id) {
      console.error("Disciplina sem ID:", disciplina);
      alert("Esta disciplina não possui um ID válido e não pode ser editada.");
      return;
    }
    setDisciplinaEditando({ ...disciplina });
    setIsEditModalOpen(true);
  };

  const handleSalvarEdicao = async () => {
    if (!disciplinaEditando) {
      console.error("Erro: Nenhuma disciplina selecionada para edição.");
      alert("Erro: Nenhuma disciplina selecionada para edição.");
      return;
    }
    if (!disciplinaEditando.id) {
      console.error("Erro: ID da disciplina não está definido.", disciplinaEditando);
      alert("Erro: ID da disciplina não está definido.");
      return;
    }
    try {
      console.log("Salvando edição da disciplina:", disciplinaEditando);
      await disciplinaService.update(disciplinaEditando.id, disciplinaEditando);
      console.log("Disciplina atualizada com sucesso! Recarregando lista...");
      const response = await disciplinaService.getAll();
      setDisciplinas(extractArray(response.data));
      setIsEditModalOpen(false);
      setDisciplinaEditando(null);
    } catch (error) {
      console.error("Erro ao editar disciplina:", error);
      alert("Erro ao editar disciplina.");
    }
  };

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Menu />
      </Grid>

      <Grid item xs={10}>
        <TextField
          label="Filtrar por Nome"
          variant="outlined"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          fullWidth
        />
      </Grid>

      {/* Apenas ADMIN pode ver o botão "Nova Disciplina" */}
      {userRole === "ADMIN" && (
        <Grid item xs={10} textAlign="right" p={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{ backgroundColor: '#09b800', color: '#fff' }}
          >
            Nova Disciplina
          </Button>
        </Grid>
      )}

      {isLoading ? (
        <CircularProgress />
      ) : disciplinas.length === 0 ? (
        <Typography variant="h5">Nenhuma disciplina cadastrada</Typography>
      ) : (
        <Grid item xs={10}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  {/* Apenas ADMIN pode ver a coluna "Ações" */}
                  {userRole === "ADMIN" && <TableCell>Ações</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {disciplinas
                  .filter(disc => disc.nome.toLowerCase().includes(filtroNome.toLowerCase()))
                  .map((disciplina) => (
                    <TableRow key={disciplina.id}>
                      <TableCell>{disciplina.id}</TableCell>
                      <TableCell>{disciplina.nome}</TableCell>
                      {userRole === "ADMIN" && (
                        <TableCell>
                          <Button
                            onClick={() => handleAbrirEdicao(disciplina)}
                            sx={{ 
                              backgroundColor: "#09b800", 
                              color: "#fff", 
                              minWidth: "40px", 
                              p: "5px", 
                              mr: 1,
                              '&:hover': {
                                backgroundColor: "#fff",
                                color: "#09b800"
                              }
                            }}
                          >
                            <EditIcon sx={{ color: "inherit" }} />
                          </Button>
                          <Button
                            onClick={() => handleExcluirDisciplina(disciplina.id)}
                            sx={{ 
                              backgroundColor: "#ff0000", 
                              color: "#fff", 
                              minWidth: "40px", 
                              p: "5px",
                              '&:hover': {
                                backgroundColor: "#fff",
                                color: "#ff0000"
                              }
                            }}
                          >
                            <DeleteIcon sx={{ color: "inherit" }} />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {/* Modal para criar nova disciplina */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h6" mb={3}>Nova Disciplina</Typography>
          
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={novaDisciplina.nome}
            onChange={(e) => setNovaDisciplina({ nome: e.target.value })}
          />

          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ mt: 2, backgroundColor: '#09b800', color: '#fff' }}
          >
            Salvar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar disciplina */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h6" mb={3}>Editar Disciplina</Typography>
          
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={disciplinaEditando?.nome || ''}
            onChange={(e) => setDisciplinaEditando({ ...disciplinaEditando, nome: e.target.value })}
          />

          <Button 
            variant="contained" 
            onClick={handleSalvarEdicao}
            sx={{ mt: 2, backgroundColor: '#09b800', color: '#fff' }}
          >
            Salvar Alterações
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Disciplinas;
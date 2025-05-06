// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Menu } from "@ui/Menu";
import { avaliacaoService, alunoService, professorService, disciplinaService } from "@services";
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
  Box,
  Select,
  MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PermissionButton from "@comp/PermissionButton";

const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.content && Array.isArray(data.content)) return data.content;
  return [];
};

const Avaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroAluno, setFiltroAluno] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const userRole = localStorage.getItem("userRole"); // "USER", "ADMIN", "TEACHER"
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota: "",
    descricao: "",
    alunoId: userRole === "USER" ? userId : "",
    professorId: "",
    disciplinaId: ""
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [avalRes, alunosRes, profRes, discRes] = await Promise.all([
          avaliacaoService.getAll(),
          alunoService.getAll(),
          professorService.getAll(),
          disciplinaService.getAll()
        ]);

        setAvaliacoes(extractArray(avalRes.data));
        setAlunos(extractArray(alunosRes.data));
        setProfessores(extractArray(profRes.data));
        setDisciplinas(extractArray(discRes.data));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleSubmit = async () => {
    const { nota, descricao, alunoId, professorId, disciplinaId } = novaAvaliacao;

    if (!nota || !descricao || !alunoId || !professorId || !disciplinaId) {
      alert("Preencha todos os campos!");
      return;
    }

    const notaNum = parseFloat(nota);
    if (isNaN(notaNum)) {
      alert("A nota deve ser um número válido!");
      return;
    }

    const avaliacaoFormatada = {
      nota: notaNum,
      descricao,
      aluno: { id: parseInt(alunoId, 10) },
      professor: { id: parseInt(professorId, 10) },
      disciplina: { id: parseInt(disciplinaId, 10) }
    };

    const confirmar = window.confirm("Tem certeza que terminou? Não será possível editar depois.");
    if (!confirmar) return;

    try {
      await avaliacaoService.create(avaliacaoFormatada);
      const res = await avaliacaoService.getAll();
      setAvaliacoes(extractArray(res.data));
      setIsModalOpen(false);
      setNovaAvaliacao({
        nota: "",
        descricao: "",
        alunoId: userRole === "USER" ? userId : "",
        professorId: "",
        disciplinaId: ""
      });
    } catch (error) {
      console.error("Erro ao criar avaliação:", error.response?.data || error);
      alert("Erro ao criar avaliação. Verifique o console para mais detalhes.");
    }
  };

  const handleExcluirAvaliacao = async (id) => {
    if (!id) {
      alert("Avaliação inválida.");
      return;
    }

    const confirmar = window.confirm("Deseja excluir esta avaliação?");
    if (!confirmar) return;

    try {
      await avaliacaoService.delete(id);
      setAvaliacoes(avaliacoes.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
    }
  };

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Menu />
      </Grid>

      <Grid item xs={10}>
        <TextField
          label="Filtrar por Aluno"
          variant="outlined"
          value={filtroAluno}
          onChange={(e) => setFiltroAluno(e.target.value)}
          fullWidth
        />
      </Grid>

      {userRole === "USER" && (
        <Grid item xs={10} textAlign="right" p={3}>
          <PermissionButton userRole={userRole} allowedRoles={["USER"]} onClick={() => setIsModalOpen(true)}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ backgroundColor: '#09b800' }}>
              Nova Avaliação
            </Button>
          </PermissionButton>
        </Grid>
      )}

      {isLoading ? (
        <CircularProgress />
      ) : avaliacoes.length === 0 ? (
        <Typography variant="h5">Nenhuma avaliação cadastrada</Typography>
      ) : (
        <Grid item xs={10}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Aluno</TableCell>
                  <TableCell>Disciplina</TableCell>
                  <TableCell>Professor</TableCell>
                  <TableCell>Nota</TableCell>
                  <TableCell>Descrição</TableCell>
                  {["USER", "ADMIN"].includes(userRole) && <TableCell>Ações</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {avaliacoes
                  .filter((aval) =>
                    aval.aluno.nome.toLowerCase().includes(filtroAluno.toLowerCase())
                  )
                  .map((aval) => (
                    <TableRow key={aval.id}>
                      <TableCell>{aval.aluno.nome}</TableCell>
                      <TableCell>{aval.disciplina.nome}</TableCell>
                      <TableCell>{aval.professor.nome}</TableCell>
                      <TableCell>{aval.nota}</TableCell>
                      <TableCell>{aval.descricao}</TableCell>
                      {["USER", "ADMIN"].includes(userRole) && (
                        <TableCell>
                          <PermissionButton userRole={userRole} allowedRoles={["USER", "ADMIN"]} onClick={() => handleExcluirAvaliacao(aval.id)}>
                            <Button
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
                          </PermissionButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h6" mb={3}>Nova Avaliação</Typography>

          <TextField
            label="Nota"
            type="number"
            fullWidth
            margin="normal"
            value={novaAvaliacao.nota}
            onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, nota: e.target.value })}
          />

          <TextField
            label="Descrição"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={novaAvaliacao.descricao}
            onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, descricao: e.target.value })}
          />

          {userRole === "USER" ? (
            <TextField
              label="Aluno:"
              value={userName}
              fullWidth
              margin="normal"
              disabled
            />
          ) : (
            <Select
              fullWidth
              value={novaAvaliacao.alunoId}
              onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, alunoId: e.target.value })}
              displayEmpty
              margin="normal"
            >
              <MenuItem value="">Selecione o Aluno</MenuItem>
              {alunos.map((aluno) => (
                <MenuItem key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </MenuItem>
              ))}
            </Select>
          )}

          <Select
            fullWidth
            value={novaAvaliacao.professorId}
            onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, professorId: e.target.value })}
            displayEmpty
            margin="normal"
          >
            <MenuItem value="">Selecione o Professor</MenuItem>
            {professores.map((prof) => (
              <MenuItem key={prof.id} value={prof.id}>
                {prof.nome}
              </MenuItem>
            ))}
          </Select>

          <Select
            fullWidth
            value={novaAvaliacao.disciplinaId}
            onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, disciplinaId: e.target.value })}
            displayEmpty
            margin="normal"
          >
            <MenuItem value="">Selecione a Disciplina</MenuItem>
            {disciplinas.map((disc) => (
              <MenuItem key={disc.id} value={disc.id}>
                {disc.nome}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 2, backgroundColor: '#09b800' }}
          >
            Salvar Avaliação
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Avaliacoes;

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Menu } from '@ui/Menu';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  avaliacaoService,
  alunoService,
  professorService,
  disciplinaService
} from '@services';

// Função auxiliar para garantir que o dado seja um array
const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && data.content && Array.isArray(data.content)) return data.content;
  return [];
};

const Avaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filtroAluno, setFiltroAluno] = useState("");
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota: '',
    descricao: '',
    alunoId: '',
    professorId: '',
    disciplinaId: ''
  });
  const [avaliacaoEditando, setAvaliacaoEditando] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [avalRes, alunosRes, profRes, discRes] = await Promise.all([
          avaliacaoService.getAll(),
          alunoService.getAll(),
          professorService.getAll(),
          disciplinaService.getAll()
        ]);

        const avalData = extractArray(avalRes.data);
        const alunosData = extractArray(alunosRes.data);
        const profData = extractArray(profRes.data);
        const discData = extractArray(discRes.data);

        console.log("Avaliações carregadas:", avalData);
        console.log("Alunos carregados:", alunosData);
        console.log("Professores carregados:", profData);
        console.log("Disciplinas carregadas:", discData);

        setAvaliacoes(avalData);
        setAlunos(alunosData);
        setProfessores(profData);
        setDisciplinas(discData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarDados();
  }, []);

  const handleSubmit = async () => {
    if (
      !novaAvaliacao.nota ||
      !novaAvaliacao.descricao ||
      !novaAvaliacao.alunoId ||
      !novaAvaliacao.professorId ||
      !novaAvaliacao.disciplinaId
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    const nota = parseFloat(novaAvaliacao.nota);
    if (isNaN(nota)) {
      alert("A nota deve ser um número válido!");
      return;
    }

    const alunoId = parseInt(novaAvaliacao.alunoId, 10);
    const professorId = parseInt(novaAvaliacao.professorId, 10);
    const disciplinaId = parseInt(novaAvaliacao.disciplinaId, 10);

    // Monta o payload conforme o esperado pelo backend (objetos aninhados)
    const avaliacaoFormatada = {
      nota,
      descricao: novaAvaliacao.descricao,
      aluno: { id: alunoId },
      professor: { id: professorId },
      disciplina: { id: disciplinaId }
    };

    console.log("Payload da avaliação:", JSON.stringify(avaliacaoFormatada, null, 2));

    try {
      const response = await avaliacaoService.create(avaliacaoFormatada);
      console.log("Avaliação criada com sucesso!", response.data);
      const res = await avaliacaoService.getAll();
      setAvaliacoes(extractArray(res.data));
      setIsModalOpen(false);
      setNovaAvaliacao({
        nota: '',
        descricao: '',
        alunoId: '',
        professorId: '',
        disciplinaId: ''
      });
    } catch (error) {
      console.error("Erro ao criar avaliação:", error.response?.data || error);
      alert("Erro ao criar avaliação. Verifique o console para mais detalhes.");
    }
  };

  const handleExcluirAvaliacao = async (id) => {
    if (!id) {
      console.error("Tentativa de excluir avaliação sem ID");
      alert("Esta avaliação não possui um ID válido e não pode ser excluída.");
      return;
    }
    const confirmar = window.confirm("Tem certeza que deseja excluir esta avaliação?");
    if (!confirmar) return;
    try {
      await avaliacaoService.delete(id);
      console.log("Avaliação excluída, id:", id);
      setAvaliacoes(avaliacoes.filter(a => a.id !== id));
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
    }
  };

  const handleAbrirEdicao = (avaliacao) => {
    console.log("Avaliação para edição:", avaliacao);
    if (!avaliacao.id) {
      console.error("Avaliação sem ID:", avaliacao);
      alert("Esta avaliação não possui um ID válido e não pode ser editada.");
      return;
    }
    // Prepara os campos para os Selects (extrai os IDs dos objetos aninhados)
    setAvaliacaoEditando({
      ...avaliacao,
      alunoId: avaliacao.aluno?.id || '',
      professorId: avaliacao.professor?.id || '',
      disciplinaId: avaliacao.disciplina?.id || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSalvarEdicao = async () => {
    if (!avaliacaoEditando) {
      console.error("Erro: Nenhuma avaliação selecionada para edição.");
      alert("Erro: Nenhuma avaliação selecionada para edição.");
      return;
    }
    if (!avaliacaoEditando.id) {
      console.error("Erro: ID da avaliação não está definido.", avaliacaoEditando);
      alert("Erro: ID da avaliação não está definido.");
      return;
    }
    const nota = parseFloat(avaliacaoEditando.nota);
    if (isNaN(nota)) {
      alert("A nota deve ser um número válido!");
      return;
    }
    const alunoId = parseInt(avaliacaoEditando.alunoId, 10);
    const professorId = parseInt(avaliacaoEditando.professorId, 10);
    const disciplinaId = parseInt(avaliacaoEditando.disciplinaId, 10);

    const avaliacaoFormatada = {
      nota,
      descricao: avaliacaoEditando.descricao,
      aluno: { id: alunoId },
      professor: { id: professorId },
      disciplina: { id: disciplinaId }
    };

    console.log("Payload de edição da avaliação:", JSON.stringify(avaliacaoFormatada, null, 2));

    try {
      await avaliacaoService.update(avaliacaoEditando.id, avaliacaoFormatada);
      console.log("Avaliação atualizada com sucesso! Recarregando lista...");
      const response = await avaliacaoService.getAll();
      setAvaliacoes(extractArray(response.data));
      setIsEditModalOpen(false);
      setAvaliacaoEditando(null);
    } catch (error) {
      console.error("Erro ao editar avaliação:", error.response?.data || error);
      alert("Erro ao editar avaliação.");
    }
  };

  return (
    <Grid container spacing={3}>
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

      <Grid item xs={12} textAlign="right" p={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{ backgroundColor: '#09b800' }}
        >
          Nova Avaliação
        </Button>
      </Grid>

      {isLoading ? (
        <CircularProgress />
      ) : avaliacoes.length === 0 ? (
        <Typography variant="h5">Nenhuma avaliação cadastrada</Typography>
      ) : (
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Aluno</TableCell>
                  <TableCell>Disciplina</TableCell>
                  <TableCell>Professor</TableCell>
                  <TableCell>Nota</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {avaliacoes
                  .filter(aval =>
                    aval.aluno.nome.toLowerCase().includes(filtroAluno.toLowerCase())
                  )
                  .map((aval) => (
                    <TableRow key={aval.id}>
                      <TableCell>{aval.aluno.nome}</TableCell>
                      <TableCell>{aval.disciplina.nome}</TableCell>
                      <TableCell>{aval.professor.nome}</TableCell>
                      <TableCell>{aval.nota}</TableCell>
                      <TableCell>{aval.descricao}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleAbrirEdicao(aval)}
                          sx={{ backgroundColor: "#09b800", color: "#fff", minWidth: "40px", p: "5px", mr: 1 }}
                        >
                          <EditIcon sx={{ color: "#fff" }} />
                        </Button>
                        <Button
                          onClick={() => handleExcluirAvaliacao(aval.id)}
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

      {/* Modal para criar nova avaliação */}
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

          <Select
            fullWidth
            value={novaAvaliacao.alunoId}
            onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, alunoId: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">Selecione o Aluno</MenuItem>
            {alunos.map((aluno) => (
              <MenuItem key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </MenuItem>
            ))}
          </Select>

          <Select
            fullWidth
            value={novaAvaliacao.professorId}
            onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, professorId: e.target.value })}
            displayEmpty
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

      {/* Modal para editar avaliação */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
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
          <Typography variant="h6" mb={3}>Editar Avaliação</Typography>

          <TextField
            label="Nota"
            type="number"
            fullWidth
            margin="normal"
            value={avaliacaoEditando?.nota || ''}
            onChange={(e) => setAvaliacaoEditando({ ...avaliacaoEditando, nota: e.target.value })}
          />

          <TextField
            label="Descrição"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={avaliacaoEditando?.descricao || ''}
            onChange={(e) => setAvaliacaoEditando({ ...avaliacaoEditando, descricao: e.target.value })}
          />

          <Select
            fullWidth
            value={avaliacaoEditando?.alunoId || ''}
            onChange={(e) => setAvaliacaoEditando({ ...avaliacaoEditando, alunoId: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">Selecione o Aluno</MenuItem>
            {alunos.map((aluno) => (
              <MenuItem key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </MenuItem>
            ))}
          </Select>

          <Select
            fullWidth
            value={avaliacaoEditando?.professorId || ''}
            onChange={(e) => setAvaliacaoEditando({ ...avaliacaoEditando, professorId: e.target.value })}
            displayEmpty
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
            value={avaliacaoEditando?.disciplinaId || ''}
            onChange={(e) => setAvaliacaoEditando({ ...avaliacaoEditando, disciplinaId: e.target.value })}
            displayEmpty
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
            onClick={handleSalvarEdicao}
            sx={{ mt: 2, backgroundColor: '#09b800' }}
          >
            Salvar Alterações
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Avaliacoes;

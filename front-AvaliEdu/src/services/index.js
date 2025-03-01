import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const alunoService = {
  getAll: () => axios.get(`${API_URL}/alunos`),
  create: (aluno) => axios.post(`${API_URL}/alunos`, aluno),
  update: (id, aluno) => axios.put(`${API_URL}/alunos/${id}`, aluno),
  delete: (id) => axios.delete(`${API_URL}/alunos/${id}`)
};

export const professorService = {
  getAll: () => axios.get(`${API_URL}/professores`),
  create: (professor) => axios.post(`${API_URL}/professores`, professor),
  update: (id, professor) => axios.put(`${API_URL}/professores/${id}`, professor),
  delete: (id) => axios.delete(`${API_URL}/professores/${id}`)
};

export const disciplinaService = {
  getAll: () => axios.get(`${API_URL}/disciplinas`),
  create: (disciplina) => axios.post(`${API_URL}/disciplinas`, disciplina),
  update: (id, disciplina) => axios.put(`${API_URL}/disciplinas/${id}`, disciplina),
  delete: (id) => axios.delete(`${API_URL}/disciplinas/${id}`)
};

export const avaliacaoService = {
  getAll: () => axios.get(`${API_URL}/avaliacoes`),
  create: (avaliacao) => axios.post(`${API_URL}/avaliacoes`, avaliacao),
  delete: (id) => axios.delete(`${API_URL}/avaliacoes/${id}`)
};
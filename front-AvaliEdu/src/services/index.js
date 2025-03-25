// services/index.js
import axiosInstance from "./axiosConfig";

export const alunoService = {
  getAll: () => axiosInstance.get("/alunos"),
  create: (aluno) => axiosInstance.post("/alunos", aluno),
  update: (id, aluno) => axiosInstance.put(`/alunos/${id}`, aluno),
  delete: (id) => axiosInstance.delete(`/alunos/${id}`)
};

export const professorService = {
  getAll: () => axiosInstance.get("/professores"),
  create: (professor) => axiosInstance.post("/professores", professor),
  update: (id, professor) => axiosInstance.put(`/professores/${id}`, professor),
  delete: (id) => axiosInstance.delete(`/professores/${id}`)
};

export const disciplinaService = {
  getAll: () => axiosInstance.get("/disciplinas"),
  create: (disciplina) => axiosInstance.post("/disciplinas", disciplina),
  update: (id, disciplina) => axiosInstance.put(`/disciplinas/${id}`, disciplina),
  delete: (id) => axiosInstance.delete(`/disciplinas/${id}`)
};

export const avaliacaoService = {
  getAll: () => axiosInstance.get("/avaliacoes"),
  create: (avaliacao) => axiosInstance.post("/avaliacoes", avaliacao),
  delete: (id) => axiosInstance.delete(`/avaliacoes/${id}`)
};

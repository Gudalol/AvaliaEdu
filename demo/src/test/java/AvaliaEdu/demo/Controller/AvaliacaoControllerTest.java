package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Aluno;
import AvaliaEdu.demo.Model.Avaliacao;
import AvaliaEdu.demo.Model.Disciplina;
import AvaliaEdu.demo.Model.Professor;
import AvaliaEdu.demo.Service.AvaliacaoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AvaliacaoController.class)
class AvaliacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
    @MockBean
    private AvaliacaoService avaliacaoService;

    @Autowired
    private ObjectMapper objectMapper;

    private Avaliacao avaliacao;
    private Aluno aluno;
    private Professor professor;
    private Disciplina disciplina;

    @BeforeEach
    void setUp() {
        aluno = new Aluno();
        aluno.setId(1L);
        aluno.setNome("João");

        professor = new Professor();
        professor.setId(1L);
        professor.setNome("Prof. Silva");

        disciplina = new Disciplina();
        disciplina.setId(1L);
        disciplina.setNome("Matemática");

        avaliacao = new Avaliacao();
        avaliacao.setId(1L);
        avaliacao.setNota(8);
        avaliacao.setDescricao("Ótimo desempenho");
        avaliacao.setAluno(aluno);
        avaliacao.setProfessor(professor);
        avaliacao.setDisciplina(disciplina);
    }

    @Test
    void testeListarAvaliacoes() throws Exception {
        when(avaliacaoService.listaAvaliacoes())
            .thenReturn(Arrays.asList(avaliacao));

        mockMvc.perform(get("/api/avaliacoes"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].nota").value(8))
            .andExpect(jsonPath("$[0].descricao").value("Ótimo desempenho"));
    }

    @Test
    void testeBuscarAvaliacaoPorId() throws Exception {
        when(avaliacaoService.buscarAvaliacao(1L))
            .thenReturn(Optional.of(avaliacao));

        mockMvc.perform(get("/api/avaliacoes/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nota").value(8));
    }

    @Test
    void testeSalvarAvaliacao() throws Exception {
        // Simula o retorno da avaliação salva
        when(avaliacaoService.salvarAvaliacao(any(Avaliacao.class)))
            .thenReturn(avaliacao);

        mockMvc.perform(post("/api/avaliacoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(avaliacao)))
            .andExpect(status().isOk())
            .andExpect(content().string("Avaliação salva com sucesso!")); // Verifica a mensagem
    }

    @Test
    void testeRetornarBadRequestComNotaMenorQueZero() throws Exception {
        avaliacao.setNota(-1);

        mockMvc.perform(post("/api/avaliacoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(avaliacao)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$[0]").value("nota: A nota deve ser maior ou igual a 0"));
    }

    @Test
    void testeRetornarBadRequestComNotaMaiorQueDez() throws Exception {
        avaliacao.setNota(11);

        mockMvc.perform(post("/api/avaliacoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(avaliacao)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$[0]").value("nota: A nota deve ser menor ou igual a 10"));
    }

    @Test
    void testeRetornarBadRequestComNotaNula() throws Exception {
        avaliacao.setNota(null);

        mockMvc.perform(post("/api/avaliacoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(avaliacao)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$[0]").value("nota: A nota é obrigatória"));
    }

    @Test
    void testeExcluirAvaliacao() throws Exception {
        // Simula a exclusão bem-sucedida
        doNothing().when(avaliacaoService).excluirAvaliacao(1L);

        mockMvc.perform(delete("/api/avaliacoes/1"))
            .andExpect(status().isOk())
            .andExpect(content().string("Avaliação excluída com sucesso!"));
    }
}
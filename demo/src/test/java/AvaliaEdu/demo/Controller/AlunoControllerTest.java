package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Aluno;
import AvaliaEdu.demo.Service.AlunoService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AlunoController.class)
class AlunoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
    @MockBean
    private AlunoService alunoService;

    @Autowired
    private ObjectMapper objectMapper;

    private Aluno aluno;

    @BeforeEach
    void setUp() {
        aluno = new Aluno();
        aluno.setId(1L);
        aluno.setNome("João");
        aluno.setIdade(15);
        aluno.setEmail("joao@email.com");
        aluno.setSenha("senha123");
    }

    @Test
    void testeListarAlunos() throws Exception {
        when(alunoService.listarAlunos()).thenReturn(Arrays.asList(aluno));

        mockMvc.perform(get("/api/alunos"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].nome").value("João"));
    }

    @Test
    void testeBuscarAlunoPorId() throws Exception {
        when(alunoService.buscarAlunoPorId(1L)).thenReturn(Optional.of(aluno));

        mockMvc.perform(get("/api/alunos/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.nome").value("João"));
    }

    @Test
    void testeRetornarNotFoundAoBuscarAlunoInexistente() throws Exception {
        when(alunoService.buscarAlunoPorId(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/alunos/99"))
            .andExpect(status().isNotFound());
    }

    @Test
    void testeSalvarAluno() throws Exception {
        when(alunoService.salvarAluno(any(Aluno.class))).thenReturn(aluno);

        mockMvc.perform(post("/api/alunos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aluno)))
            .andExpect(status().isOk())
            .andExpect(content().string("Aluno salvo com sucesso!"));
    }

    @Test
    void testeAtualizarAluno() throws Exception {
        Aluno alunoAtualizado = new Aluno();
        alunoAtualizado.setNome("João Atualizado");
        alunoAtualizado.setIdade(16);
        alunoAtualizado.setEmail("joao.atualizado@example.com");
        alunoAtualizado.setSenha("senha123");
        alunoAtualizado.setEmail("joao.atualizado@example.com");
        alunoAtualizado.setSenha("senha123");

        when(alunoService.atualizarAluno(eq(1L), any(Aluno.class)))
            .thenReturn(Optional.of(alunoAtualizado));

        mockMvc.perform(put("/api/alunos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(alunoAtualizado)))
            .andExpect(status().isOk())
            .andExpect(content().string("Aluno atualizado com sucesso!"));
    }

    @Test
    void testeExcluirAluno() throws Exception {
        doNothing().when(alunoService).excluirAluno(1L);

        mockMvc.perform(delete("/api/alunos/1"))
            .andExpect(status().isOk())
            .andExpect(content().string("Aluno excluído com sucesso!"));
    }

    @Test
    void testeRetornarNotFoundAoExcluirAlunoInexistente() throws Exception {
        doThrow(new RuntimeException("Aluno não encontrado"))
            .when(alunoService).excluirAluno(99L);

        mockMvc.perform(delete("/api/alunos/99"))
            .andExpect(status().isNotFound());
    }
}
package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Disciplina;
import AvaliaEdu.demo.Service.DisciplinaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DisciplinaController.class)
class DisciplinaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
    @MockBean
    private DisciplinaService disciplinaService;

    @Autowired
    private ObjectMapper objectMapper;

    private Disciplina disciplina;

    @BeforeEach
    void setUp() {
        disciplina = new Disciplina();
        disciplina.setId(1L);
        disciplina.setNome("Matemática");
    }

    @Test
    void testeListarDisciplinas() throws Exception {
        when(disciplinaService.getAllDisciplinas())
            .thenReturn(Arrays.asList(disciplina));

        mockMvc.perform(get("/api/disciplinas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].nome").value("Matemática"));
    }

    void testeSalvarDisciplina() throws Exception {
        // Simula o retorno da disciplina salva
        when(disciplinaService.saveDisciplina(any(Disciplina.class)))
            .thenReturn(disciplina); // Retorna a disciplina mockada
    
        mockMvc.perform(post("/api/disciplinas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(disciplina)))
            .andExpect(status().isOk())
            .andExpect(content().string("Disciplina salva com sucesso!"));
    }
    
    @Test
    void deveSalvarDisciplinaComNomeValido() throws Exception {
        // Simula o retorno da disciplina salva
        when(disciplinaService.saveDisciplina(any(Disciplina.class)))
            .thenReturn(disciplina); // Retorna a disciplina mockada
    
        mockMvc.perform(post("/api/disciplinas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(disciplina)))
            .andExpect(status().isOk())
            .andExpect(content().string("Disciplina salva com sucesso!"));
    }

    @Test
    void testeRetornarBadRequestAoSalvarDisciplinaInvalida() throws Exception {
        Disciplina disciplinaInvalida = new Disciplina();
        disciplinaInvalida.setNome("");

        mockMvc.perform(post("/api/disciplinas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(disciplinaInvalida)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$[0]").value("nome: O nome da disciplina é obrigatório"));
    }

    @Test
    void testeExcluirDisciplina() throws Exception {
        doNothing().when(disciplinaService).deleteDisciplina(1L);

        mockMvc.perform(delete("/api/disciplinas/1"))
            .andExpect(status().isOk())
            .andExpect(content().string("Disciplina excluída com sucesso!"));
    }

    @Test
    void testeRetornarNotFoundAoExcluirDisciplinaInexistente() throws Exception {
        doThrow(new RuntimeException("Disciplina não encontrada"))
            .when(disciplinaService).deleteDisciplina(999L);

        mockMvc.perform(delete("/api/disciplinas/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void naoDeveSalvarDisciplinaComNomeVazio() throws Exception {
        Disciplina disciplinaInvalida = new Disciplina();
        disciplinaInvalida.setNome("");

        mockMvc.perform(post("/api/disciplinas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(disciplinaInvalida)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$[0]").value("nome: O nome da disciplina é obrigatório"));
    }

    @Test
    void naoDeveSalvarDisciplinaComNomeNulo() throws Exception {
        Disciplina disciplinaInvalida = new Disciplina();
        disciplinaInvalida.setNome(null);

        mockMvc.perform(post("/api/disciplinas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(disciplinaInvalida)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$[0]").value("nome: O nome da disciplina é obrigatório"));
    }

    @Test
    void deveAtualizarDisciplinaComSucesso() throws Exception {
        when(disciplinaService.updateDisciplina(anyLong(), any(Disciplina.class)))
            .thenReturn(disciplina);

        mockMvc.perform(put("/api/disciplinas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(disciplina)))
            .andExpect(status().isOk())
            .andExpect(content().string("Disciplina atualizada com sucesso!"));
    }

    @Test
    void deveRetornarNotFoundAoAtualizarDisciplinaInexistente() throws Exception {
        when(disciplinaService.updateDisciplina(anyLong(), any(Disciplina.class)))
            .thenThrow(new RuntimeException("Disciplina não encontrada"));

        mockMvc.perform(put("/api/disciplinas/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(disciplina)))
            .andExpect(status().isNotFound());
    }

}
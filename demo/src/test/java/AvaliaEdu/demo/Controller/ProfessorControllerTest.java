package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Professor;
import AvaliaEdu.demo.Service.ProfessorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ProfessorControllerTest {

    @InjectMocks
    private ProfessorController professorController;

    @Mock
    private ProfessorService professorService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testAtualizarProfessor_Sucesso() {
        Professor professor = new Professor(1L, "Nome Atualizado", "email@exemplo.com", null, null);
        BindingResult bindingResult = new BeanPropertyBindingResult(professor, "professor");

        when(professorService.salvarProfessor(any(Professor.class))).thenReturn(professor);

        ResponseEntity<?> response = professorController.atualizarProfessor(1L, professor, bindingResult);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Professor atualizado com sucesso!", response.getBody());
        verify(professorService, times(1)).salvarProfessor(any(Professor.class));
    }

    @Test
    public void testAtualizarProfessor_Erro() {
        Professor professor = new Professor(null, "Nome Atualizado", "email@exemplo.com", null, null);
        BindingResult bindingResult = new BeanPropertyBindingResult(professor, "professor");

        when(professorService.salvarProfessor(any(Professor.class)))
            .thenThrow(new RuntimeException("Erro ao atualizar"));

        ResponseEntity<?> response = professorController.atualizarProfessor(1L, professor, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Erro ao atualizar professor: Erro ao atualizar", response.getBody());
    }

    @Test
    public void testAtualizarProfessor_NomeVazio() {
        Professor professor = new Professor(null, "", "email@exemplo.com", null);
        BindingResult bindingResult = new BeanPropertyBindingResult(professor, "professor");
        bindingResult.rejectValue("nome", "NotBlank", "O nome é obrigatório");

        ResponseEntity<?> response = professorController.atualizarProfessor(1L, professor, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(List.of("nome: O nome é obrigatório"), response.getBody());
    }

    @Test
    public void testSalvarProfessor_Sucesso() {
        Professor professor = new Professor(null, "Nome", "email@exemplo.com", null);
        BindingResult bindingResult = new BeanPropertyBindingResult(professor, "professor");

        when(professorService.salvarProfessor(any(Professor.class))).thenReturn(professor);

        ResponseEntity<?> response = professorController.salvarProfessor(professor, bindingResult);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Professor salvo com sucesso!", response.getBody());
        verify(professorService, times(1)).salvarProfessor(any(Professor.class));
    }

    @Test
    public void testSalvarProfessor_EmailVazio() {
        Professor professor = new Professor(null, "Nome", "", null);
        BindingResult bindingResult = new BeanPropertyBindingResult(professor, "professor");
        bindingResult.rejectValue("email", "NotBlank", "O email é obrigatório");

        ResponseEntity<?> response = professorController.salvarProfessor(professor, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(List.of("email: O email é obrigatório"), response.getBody());
    }

    @Test
    public void testListarProfessores() {
        List<Professor> professores = Arrays.asList(
            new Professor(1L, "Professor 1", "prof1@exemplo.com", null),
            new Professor(2L, "Professor 2", "prof2@exemplo.com", null)
        );

        when(professorService.listarProfessor()).thenReturn(professores);

        ResponseEntity<List<Professor>> response = professorController.listarProfessores();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(professores, response.getBody());
    }

    @Test
    public void testExcluirProfessor_Sucesso() {
        Long id = 1L;

        ResponseEntity<String> response = professorController.excluirProfessor(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Professor excluído com sucesso!", response.getBody());
        verify(professorService, times(1)).excluirProfessor(id);
    }
}
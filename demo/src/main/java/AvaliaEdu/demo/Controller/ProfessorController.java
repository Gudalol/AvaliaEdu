package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Professor;
import AvaliaEdu.demo.Service.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @GetMapping
    public ResponseEntity<List<Professor>> listarProfessores() {
        return ResponseEntity.ok(professorService.listarProfessores());
    }

    @PostMapping
    public ResponseEntity<?> salvarProfessor(
        @Valid @RequestBody Professor professor,
        BindingResult result
    ) {
        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            professorService.salvarProfessor(professor);
            return ResponseEntity.ok("Professor salvo com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar professor: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProfessor(
        @PathVariable Long id,
        @Valid @RequestBody Professor professor,
        BindingResult result
    ) {
        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            professor.setId(id);
            professorService.salvarProfessor(professor);
            return ResponseEntity.ok("Professor atualizado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar professor: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluirProfessor(@PathVariable Long id) {
        try {
            professorService.excluirProfessor(id);
            return ResponseEntity.ok("Professor excluído com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir professor: " + e.getMessage());
        }
    }
}
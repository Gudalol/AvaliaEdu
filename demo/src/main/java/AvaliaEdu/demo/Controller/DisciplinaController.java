package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Disciplina;
import AvaliaEdu.demo.Service.DisciplinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/disciplinas")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @GetMapping
    public ResponseEntity<List<Disciplina>> listarDisciplinas() {
        return ResponseEntity.ok(disciplinaService.getAllDisciplinas());
    }

    @PostMapping
    public ResponseEntity<?> salvarDisciplina(
        @Valid @RequestBody Disciplina disciplina,
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
            disciplinaService.saveDisciplina(disciplina);
            return ResponseEntity.ok("Disciplina salva com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar disciplina: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarDisciplina(
        @PathVariable Long id,
        @Valid @RequestBody Disciplina disciplinaAtualizada,
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
            disciplinaService.updateDisciplina(id, disciplinaAtualizada);
            return ResponseEntity.ok("Disciplina atualizada com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluirDisciplina(@PathVariable Long id) {
        try {
            disciplinaService.deleteDisciplina(id);
            return ResponseEntity.ok("Disciplina excluída com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Retorna 404 se não existir
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir disciplina: " + e.getMessage());
        }
    }
}
package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Aluno;
import AvaliaEdu.demo.Service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @GetMapping
    public ResponseEntity<List<Aluno>> listarAlunos() {
        return ResponseEntity.ok(alunoService.listarAlunos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarAlunoPorId(@PathVariable Long id) {
        return alunoService.buscarAlunoPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> salvarAluno(
        @Valid @RequestBody Aluno aluno,
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
            alunoService.salvarAluno(aluno);
            return ResponseEntity.ok("Aluno salvo com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar aluno: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAluno(
        @PathVariable Long id,
        @Valid @RequestBody Aluno aluno,
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
            alunoService.atualizarAluno(id, aluno);
            return ResponseEntity.ok("Aluno atualizado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluirAluno(@PathVariable Long id) {
        try {
            alunoService.excluirAluno(id); // Método agora é void e lança exceção
            return ResponseEntity.ok("Aluno excluído com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Retorna 404 se não existir
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir aluno: " + e.getMessage());
        }
    }
}
package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Avaliacao;
import AvaliaEdu.demo.Service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @GetMapping
    public ResponseEntity<List<Avaliacao>> listarAvaliacoes() {
        return ResponseEntity.ok(avaliacaoService.listaAvaliacoes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Avaliacao> buscarAvaliacao(@PathVariable Long id) {
        return avaliacaoService.buscarAvaliacao(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> salvarAvaliacao(
        @Valid @RequestBody Avaliacao avaliacao,
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
            avaliacaoService.salvarAvaliacao(avaliacao);
            return ResponseEntity.ok("Avaliação salva com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar a avaliação: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluirAvaliacao(@PathVariable Long id) {
        try {
            avaliacaoService.excluirAvaliacao(id);
            return ResponseEntity.ok("Avaliação excluída com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir avaliação: " + e.getMessage());
        }
    }
}
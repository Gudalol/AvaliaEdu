package Controller;

import Model.Disciplina;
import Repository.DisciplinaRepository;
import Service.DisciplinaService;
import com.fasterxml.jackson.databind.annotation.JsonAppend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disciplinas")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @GetMapping
    public List<Disciplina> getDisciplinas() {
        return disciplinaService.getAllDisciplinas();
    }

    @GetMapping("/{id}")
    public Disciplina getDisciplinaById(@PathVariable Long id) {
        return disciplinaService.getDisciplinaById(id);
    }

    @PostMapping
    public Disciplina saveDisciplina(@RequestBody Disciplina disciplina) {
        return disciplinaService.saveDisciplina(disciplina);
    }

    @DeleteMapping("/{id}")
    public void deleteDisciplinaById(@PathVariable Long id) {
        disciplinaService.deleteDisciplina(id);
    }
}

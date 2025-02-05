package Controller;

import Model.Professor;
import Service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @GetMapping
    public String listarProfessores(Model model){
        List<Professor> professores = professorService.listarProfessor();
        model.addAtribute("professore", professores);
        return "professores";
    }

    @PostMapping
    public String salvarProfessor(@ModelAttribute Professor professor) {
        professorService.salvarProfessor(professor);
        return "redirect:/professores";
    }

    @GetMapping("/excluir/{id}")
    public String excluirProfessor(@PathVariable Long id) {
        professorService.excluirProfessor(id);
        return "redirect:/professores";
    }
}

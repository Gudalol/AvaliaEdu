package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Disciplina;
import AvaliaEdu.demo.Service.DisciplinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;


import java.util.List;

@RestController
@RequestMapping("/disciplinas")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

   @GetMapping
    public String listarDisciplinas(Model model){
       List<Disciplina> disciplinas = disciplinaService.getAllDisciplinas();
       model.addAttribute("disciplinas", disciplinas);
       return "disciplinas";
   }

   @PostMapping
    public String salvarDisciplina(@ModelAttribute Disciplina disciplina){
        disciplinaService.saveDisciplina(disciplina);
        return "redirect:/disciplinas";
   }

   @GetMapping("/excluir/{id}")
    public String excluirDisciplina(@PathVariable Long id){
       disciplinaService.deleteDisciplina(id);
       return "redirect:/disciplinas";
   }
}

package Controller;

import Model.Aluno;
import Service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @GetMapping
    public String listarAlunos(Model mode){
        List<Aluno> alunos = alunoService.listarAlunos();
        model.addAtributte("alunos", alunos);
        return "alunos";
    }

    @PostMapping
    public String salvarAluno(@ModelAttribute Aluno aluno){
        alunoService.salvarAluno(aluno);
        return "redirect:/alunos";
    }

    @GetMapping("/excluir/{id}")
    public String excluirAluno(@PathVariable Long id){
    alunoService.excluirAluno(id);
    return "redirect:/alunos";
    }
}

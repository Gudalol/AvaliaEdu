package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Model.Aluno;
import AvaliaEdu.demo.Service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/alunos") // Este endpoint é diferente do AlunoController, esse foi feito depois só para lidar com a renderização das paginas html
public class AlunoThymeleafController {

    @Autowired
    private AlunoService alunoService;

    @GetMapping("/form")
    public String exibirFormulario(Model model) {
        model.addAttribute("aluno", new Aluno());
        return "formulario-aluno";
    }

    @PostMapping("/salvar")
    public String salvarAluno(@ModelAttribute Aluno aluno) {
        alunoService.salvarAluno(aluno);
        return "redirect:/alunos/listar";
    }

    @GetMapping("/listar")
    public String listarAlunos(@RequestParam(defaultValue = "1") int pagina, Model model) {
        Pageable pageable = PageRequest.of(pagina - 1, 10); // 10 alunos por página
        Page<Aluno> alunosPage = alunoService.listarAlunos(pageable);

        model.addAttribute("alunos", alunosPage.getContent());
        model.addAttribute("paginaAtual", pagina);
        model.addAttribute("totalPaginas", alunosPage.getTotalPages());

        return "lista-alunos";
    }

    @GetMapping("/excluir/{id}")
    public String excluirAluno(@PathVariable Long id) {
        alunoService.excluirAluno(id);
        return "redirect:/alunos/listar";
    }
}
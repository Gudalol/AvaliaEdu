package Controller;

import Model.Avaliacao;
import Service.AvaliacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @GetMapping
    public String listarAvaliacoes(Model model) {
        List<Avaliacao> avaliacoes = avaliacaoService.listaAvaliacoes();
        model.addAttribute("avaliacoes", avaliacoes);
        return "avaliacoes";
    }

    @PostMapping
    public String salvarAvaliacao(@ModelAttribute Avaliacao avaliacao) {
        avaliacaoService.salvarAvaliacao(avaliacao);
        return "redirect:/avaliacoes";
    }

    @GetMapping("/excluir/{id}")
    public String excluirAvaliacao(@PathVariable Long id) {
        avaliacaoService.excluirAvaliacao(id);
        return "redirect:/avaliacoes";
    }

}

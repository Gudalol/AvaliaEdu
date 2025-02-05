package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Avaliacao;
import AvaliaEdu.demo.Repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    public List<Avaliacao> listaAvaliacoes() {
        return avaliacaoRepository.findAll();
    }

    public Avaliacao getAvaliacao(Long id) {
        return avaliacaoRepository.findById(id).get();
    }
    public Avaliacao salvarAvaliacao(Avaliacao avaliacao) {
        return avaliacaoRepository.save(avaliacao);
    }

    public void excluirAvaliacao(Long id) {
        avaliacaoRepository.deleteById(id);
    }
}

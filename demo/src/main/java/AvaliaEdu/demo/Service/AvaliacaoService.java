package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Avaliacao;
import AvaliaEdu.demo.Repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    public List<Avaliacao> listaAvaliacoes() {
        return avaliacaoRepository.findAll();
    }

    public Optional<Avaliacao> buscarAvaliacao(Long id) {
        return avaliacaoRepository.findById(id);
    }

    public Avaliacao salvarAvaliacao(Avaliacao avaliacao) {
        return avaliacaoRepository.save(avaliacao);
    }

    public void excluirAvaliacao(Long id) {
        if (!avaliacaoRepository.existsById(id)) {
            throw new RuntimeException("Avaliação não encontrada");
        }
        avaliacaoRepository.deleteById(id);
    }
}
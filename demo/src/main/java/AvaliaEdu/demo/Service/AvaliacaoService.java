package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Avaliacao;
import AvaliaEdu.demo.Model.Aluno;
import AvaliaEdu.demo.Model.Professor;
import AvaliaEdu.demo.Model.Disciplina;
import AvaliaEdu.demo.Repository.AvaliacaoRepository;
import AvaliaEdu.demo.Repository.AlunoRepository;
import AvaliaEdu.demo.Repository.ProfessorRepository;
import AvaliaEdu.demo.Repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;
    
    @Autowired
    private AlunoRepository alunoRepository;
    
    @Autowired
    private ProfessorRepository professorRepository;
    
    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public List<Avaliacao> listaAvaliacoes() {
        return avaliacaoRepository.findAll();
    }

    public Optional<Avaliacao> buscarAvaliacao(Long id) {
        return avaliacaoRepository.findById(id);
    }

    public Avaliacao salvarAvaliacao(Avaliacao avaliacao) {
        // Busca as entidades associadas pelo ID para garantir que estão gerenciadas
        Aluno aluno = alunoRepository.findById(avaliacao.getAluno().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Professor professor = professorRepository.findById(avaliacao.getProfessor().getId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        Disciplina disciplina = disciplinaRepository.findById(avaliacao.getDisciplina().getId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        // Atribui as instâncias gerenciadas à avaliação
        avaliacao.setAluno(aluno);
        avaliacao.setProfessor(professor);
        avaliacao.setDisciplina(disciplina);

        return avaliacaoRepository.save(avaliacao);
    }

    public void excluirAvaliacao(Long id) {
        if (!avaliacaoRepository.existsById(id)) {
            throw new RuntimeException("Avaliação não encontrada");
        }
        avaliacaoRepository.deleteById(id);
    }
}

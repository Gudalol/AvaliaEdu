package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Disciplina;
import AvaliaEdu.demo.Repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisciplinaService {
    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public List<Disciplina> getAllDisciplinas() {
        return disciplinaRepository.findAll();
    }

    public Optional<Disciplina> getDisciplinaById(Long id) {
        return disciplinaRepository.findById(id);
    }

    public Disciplina saveDisciplina(Disciplina disciplina) {
        return disciplinaRepository.save(disciplina);
    }
    public Disciplina updateDisciplina(Long id, Disciplina disciplinaAtualizada) {
        Disciplina disciplinaExistente = disciplinaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
        
        disciplinaExistente.setNome(disciplinaAtualizada.getNome());
        // Atualize outros campos conforme necessário
        
        return disciplinaRepository.save(disciplinaExistente);
    }

    public void deleteDisciplina(Long id) {
        if (!disciplinaRepository.existsById(id)) {
            throw new RuntimeException("Disciplina não encontrada");
        }
        disciplinaRepository.deleteById(id);
    }
}
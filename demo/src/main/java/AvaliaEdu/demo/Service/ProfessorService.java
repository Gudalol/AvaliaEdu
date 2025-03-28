package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Professor;
import AvaliaEdu.demo.Repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    public List<Professor> listarProfessor() {
        return professorRepository.findAll();
    }

    public Professor salvarProfessor(Professor professor) {
        return professorRepository.save(professor);
    }

    public boolean professorExists(Long id) {
        return professorRepository.existsById(id);
    }

    public void excluirProfessor(Long id) {
        professorRepository.deleteById(id);
    }
}

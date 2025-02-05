package Service;

import Model.Professor;
import Repository.ProfessorRepository;
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

    public void excluirProfessor(Long id) {
        professorRepository.deleteById(id);
    }
}

package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Professor;
import AvaliaEdu.demo.Repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<Professor> listarProfessores() {
        return professorRepository.findAll();
    }

    public Professor salvarProfessor(Professor professor) {
        // Criptografa a senha antes de salvar
        professor.setSenha(passwordEncoder.encode(professor.getSenha()));
        return professorRepository.save(professor);
    }

    public Optional<Professor> listarProfessor(Long id) {
        return professorRepository.findById(id);
    }

    public Optional<Professor> atualizarProfessor(Long id, Professor professorAtualizado) {
        return professorRepository.findById(id)
            .map(professorExistente -> {
                professorExistente.setNome(professorAtualizado.getNome());
                professorExistente.setEmail(professorAtualizado.getEmail());
                
                // Atualiza a senha se for informada
                if (professorAtualizado.getSenha() != null && !professorAtualizado.getSenha().isEmpty()) {
                    professorExistente.setSenha(passwordEncoder.encode(professorAtualizado.getSenha()));
                }
                
                return professorRepository.save(professorExistente);
            });
    }

    public void excluirProfessor(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new RuntimeException("Professor não encontrado");
        }
        professorRepository.deleteById(id);
    }
}
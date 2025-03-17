package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Aluno;
import AvaliaEdu.demo.Repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {
    
    @Autowired
    private AlunoRepository alunoRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    public Aluno salvarAluno(Aluno aluno) {
        // Criptografa a senha antes de salvar
        aluno.setSenha(passwordEncoder.encode(aluno.getSenha()));
        return alunoRepository.save(aluno);
    }

    public List<Aluno> listarAlunos() {
        return alunoRepository.findAll();
    }

    public Optional<Aluno> buscarAlunoPorId(Long id) {
        return alunoRepository.findById(id);
    }

    public Optional<Aluno> atualizarAluno(Long id, Aluno alunoAtualizado) {
        return alunoRepository.findById(id)
            .map(alunoExistente -> {
                alunoExistente.setNome(alunoAtualizado.getNome());
                alunoExistente.setIdade(alunoAtualizado.getIdade());
                alunoExistente.setEmail(alunoAtualizado.getEmail());
                
                // Atualiza a senha se for informada
                if (alunoAtualizado.getSenha() != null && !alunoAtualizado.getSenha().isEmpty()) {
                    alunoExistente.setSenha(passwordEncoder.encode(alunoAtualizado.getSenha()));
                }
                
                return alunoRepository.save(alunoExistente);
            });
    }

    public void excluirAluno(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new RuntimeException("Aluno não encontrado");
        }
        alunoRepository.deleteById(id);
    }
}

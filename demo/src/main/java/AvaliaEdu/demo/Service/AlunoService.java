package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Aluno;
import AvaliaEdu.demo.Repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AlunoService {

    @Autowired
    AlunoRepository alunoRepository;

    public List<Aluno> listarAlunos() {
        return alunoRepository.findAll();
    }
    public Page<Aluno> listarAlunos(Pageable pageable) {
        return alunoRepository.findAll(pageable);
    }

    public Aluno salvarAluno(Aluno aluno) {
        return alunoRepository.save(aluno);
    }

    public void excluirAluno(Long id) {
        alunoRepository.deleteById(id);
    }
}

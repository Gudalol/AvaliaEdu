package AvaliaEdu.demo.Repository;

import AvaliaEdu.demo.Model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
}

package AvaliaEdu.demo.Repository;

import AvaliaEdu.demo.Model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {

}

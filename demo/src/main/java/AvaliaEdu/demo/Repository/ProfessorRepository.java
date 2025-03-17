package AvaliaEdu.demo.Repository;

import AvaliaEdu.demo.Model.Professor;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByEmail(String email);

}

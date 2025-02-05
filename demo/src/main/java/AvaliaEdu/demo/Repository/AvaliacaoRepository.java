package AvaliaEdu.demo.Repository;

import AvaliaEdu.demo.Model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
}

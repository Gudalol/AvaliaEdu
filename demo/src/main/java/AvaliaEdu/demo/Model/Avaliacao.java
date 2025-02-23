package AvaliaEdu.demo.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_avaliacao")
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "A nota é obrigatória")
    @Min(value = 0, message = "A nota deve ser maior ou igual a 0")
    @Max(value = 10, message = "A nota deve ser menor ou igual a 10")
    @Column(nullable = false)
    private Integer nota;

    @Size(max = 500, message = "A descrição não pode ter mais de 500 caracteres")
    @Column(length = 500)
    private String descricao;

    @NotNull(message = "O aluno é obrigatório")
    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @NotNull(message = "O professor é obrigatório")
    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    @NotNull(message = "A disciplina é obrigatória")
    @ManyToOne
    @JoinColumn(name = "disciplina_id", nullable = false)
    private Disciplina disciplina;
}
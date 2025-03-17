package AvaliaEdu.demo.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "db_professor")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Email(message = "Email deve ser válido")
    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email é obrigatório")
    private String email;

    @NotBlank(message = "A senha não pode estar em branco")
    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    private Role role = Role.TEACHER;

    @OneToMany(mappedBy = "professor", fetch = FetchType.LAZY)
    @JsonIgnore // Evita recursão
    private List<Avaliacao> avaliacoes;
}

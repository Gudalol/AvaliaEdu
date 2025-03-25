package AvaliaEdu.demo.Controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import AvaliaEdu.demo.Model.Admin;
import AvaliaEdu.demo.Repository.AdminRepository;
import AvaliaEdu.demo.Repository.AlunoRepository;
import AvaliaEdu.demo.Repository.ProfessorRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')") // Somente Admin pode acessar
public class AdministradorController {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final AdminRepository adminRepository;

    public AdministradorController(AlunoRepository alunoRepository, 
                           ProfessorRepository professorRepository, 
                           AdminRepository adminRepository) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.adminRepository = adminRepository;
    }

    @PostMapping
    public Admin criarAdmin(@RequestBody Admin admin) {
        return adminRepository.save(admin);
    }

    @GetMapping
    public List<Admin> listarAdmins() {
        return adminRepository.findAll();
    }

    @DeleteMapping("/alunos/{id}")
    public String excluirAluno(@PathVariable Long id) {
        if (alunoRepository.existsById(id)) {
            alunoRepository.deleteById(id);
            return "Aluno excluído com sucesso!";
        }
        return "Aluno não encontrado!";
    }

    // 4️⃣ Excluir um professor
    @DeleteMapping("/professores/{id}")
    public String excluirProfessor(@PathVariable Long id) {
        if (professorRepository.existsById(id)) {
            professorRepository.deleteById(id);
            return "Professor excluído com sucesso!";
        }
        return "Professor não encontrado!";
    }
    @PutMapping("/{id}")
    public Admin atualizarAdmin(@PathVariable Long id, @RequestBody Admin adminAtualizado) {
        return adminRepository.findById(id).map(admin -> {
            admin.setEmail(adminAtualizado.getEmail());
            admin.setSenha(adminAtualizado.getSenha()); // Lembre-se de aplicar hash na senha antes de salvar
            return adminRepository.save(admin);
        }).orElseThrow(() -> new RuntimeException("Administrador não encontrado!"));
    }
    @DeleteMapping("/{id}")
    public String excluirAdmin(@PathVariable Long id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
            return "Administrador excluído com sucesso!";
        }
        return "Administrador não encontrado!";
    }


}


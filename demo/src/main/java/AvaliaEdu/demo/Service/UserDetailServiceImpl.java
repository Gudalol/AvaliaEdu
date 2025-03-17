package AvaliaEdu.demo.security;

import AvaliaEdu.demo.model.Aluno;
import AvaliaEdu.demo.model.Professor;
import AvaliaEdu.demo.model.Admin;
import AvaliaEdu.demo.repository.AlunoRepository;
import AvaliaEdu.demo.repository.ProfessorRepository;
import AvaliaEdu.demo.repository.AdminRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final AdminRepository adminRepository;

    public UserDetailsServiceImpl(AlunoRepository alunoRepository, ProfessorRepository professorRepository, AdminRepository adminRepository) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Aluno> alunoOpt = alunoRepository.findByEmail(email);
        if (alunoOpt.isPresent()) {
            Aluno aluno = alunoOpt.get();
            return new User(
                aluno.getEmail(),
                aluno.getSenha(),
                Collections.singleton(new SimpleGrantedAuthority("USER"))
            );
        }

        Optional<Professor> professorOpt = professorRepository.findByEmail(email);
        if (professorOpt.isPresent()) {
            Professor professor = professorOpt.get();
            return new User(
                professor.getEmail(),
                professor.getSenha(),
                Collections.singleton(new SimpleGrantedAuthority("TEACHER"))
            );
        }

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return new User(
                admin.getEmail(),
                admin.getSenha(),
                Collections.singleton(new SimpleGrantedAuthority("ADMIN"))
            );
        }

        throw new UsernameNotFoundException("Usuário não encontrado");
    }
}

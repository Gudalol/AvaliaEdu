package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Aluno;
import AvaliaEdu.demo.Model.Professor;
import AvaliaEdu.demo.Model.Admin;
import AvaliaEdu.demo.Repository.AlunoRepository;
import AvaliaEdu.demo.Repository.ProfessorRepository;
import AvaliaEdu.demo.Repository.AdminRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserDetailServiceImpl implements UserDetailsService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final AdminRepository adminRepository;

    public UserDetailServiceImpl(AlunoRepository alunoRepository, ProfessorRepository professorRepository, AdminRepository adminRepository) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return alunoRepository.findByEmail(email).map(aluno ->
            new org.springframework.security.core.userdetails.User(
                aluno.getEmail(), aluno.getSenha(), Collections.singleton(new SimpleGrantedAuthority("USER"))
            )
        ).orElseGet(() -> professorRepository.findByEmail(email).map(professor ->
            new org.springframework.security.core.userdetails.User(
                professor.getEmail(), professor.getSenha(), Collections.singleton(new SimpleGrantedAuthority("TEACHER"))
            )
        ).orElseGet(() -> adminRepository.findByEmail(email).map(admin ->
            new org.springframework.security.core.userdetails.User(
                admin.getEmail(), admin.getSenha(), Collections.singleton(new SimpleGrantedAuthority("ADMIN"))
            )
        ).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"))));
    }
}

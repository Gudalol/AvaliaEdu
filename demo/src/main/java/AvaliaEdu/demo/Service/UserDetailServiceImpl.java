package AvaliaEdu.demo.Service;

import AvaliaEdu.demo.Model.Admin;
import AvaliaEdu.demo.Model.Aluno;
import AvaliaEdu.demo.Model.Professor;
import AvaliaEdu.demo.Repository.AdminRepository;
import AvaliaEdu.demo.Repository.AlunoRepository;
import AvaliaEdu.demo.Repository.ProfessorRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
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

    public UserDetailServiceImpl(AlunoRepository alunoRepository, 
                                ProfessorRepository professorRepository, 
                                AdminRepository adminRepository) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Verifica primeiro se é um aluno
        Optional<Aluno> alunoOpt = Optional.ofNullable(alunoRepository.findByEmail(email));
        if (alunoOpt.isPresent()) {
            Aluno aluno = alunoOpt.get();
            return new User(aluno.getEmail(), aluno.getSenha(),
                    Collections.singletonList(new SimpleGrantedAuthority("USER")));
        }

        // Verifica se é um professor
        Optional<Professor> professorOpt = professorRepository.findByEmail(email);
        if (professorOpt.isPresent()) {
            Professor professor = professorOpt.get();
            return new User(professor.getEmail(), professor.getSenha(),
                    Collections.singletonList(new SimpleGrantedAuthority("TEACHER")));
        }

        // Verifica se é um admin
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return new User(admin.getEmail(), admin.getSenha(),
                    Collections.singletonList(new SimpleGrantedAuthority("ADMIN")));
        }

        throw new UsernameNotFoundException("Usuário não encontrado com o email: " + email);
    }
}
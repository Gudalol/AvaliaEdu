package AvaliaEdu.demo.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import AvaliaEdu.demo.Model.Admin;
import AvaliaEdu.demo.Repository.AdminRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(AdminRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            if (usuarioRepository.findByEmail("admin@admin.com").isEmpty()) {
                Admin admin = new Admin();
                admin.setEmail("admin@admin.com");
                admin.setSenha(passwordEncoder.encode("admin123"));

                usuarioRepository.save(admin);
                System.out.println("✅ Usuário administrador criado com sucesso!");
            } else {
                System.out.println("ℹ️ Usuário administrador já existe.");
            }
        };
    }
}

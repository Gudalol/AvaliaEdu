package AvaliaEdu.demo.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import AvaliaEdu.demo.Model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long>{
    Optional<Admin> findByEmail(String email);

}

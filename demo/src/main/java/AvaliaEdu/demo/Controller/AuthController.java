package AvaliaEdu.demo.Controller;

import AvaliaEdu.demo.Config.JwtUtil;
import AvaliaEdu.demo.Model.LoginRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Pegando a role do usuário autenticado
            String role = authentication.getAuthorities().iterator().next().getAuthority();
            String token = jwtUtil.generateToken(loginRequest.getEmail(), role);

            return ResponseEntity.ok().body(Map.of(
                "message", "Login bem-sucedido!",
                "user", authentication.getName(),
                "role", role,
                "token", token  // Enviando o token JWT no retorno
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Credenciais inválidas"));
        }
    }
}

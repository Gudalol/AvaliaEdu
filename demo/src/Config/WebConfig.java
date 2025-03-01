package AvaliaEdu.demo.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite todas as APIs
                .allowedOrigins("http://localhost:3000") // Adicione o endereço da sua aplicação front-end (ajuste conforme necessário)
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Métodos HTTP permitidos
                .allowedHeaders("*") // Todos os cabeçalhos permitidos
                .allowCredentials(true); // Permite enviar cookies, se necessário
    }
}

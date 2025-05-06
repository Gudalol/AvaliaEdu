import { Menu } from "@comp/ui/Menu"; 
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// Importa as imagens
import imgHomeAluno from "@img/img-home-aluno.jpg";
import imgHomeProfessor from "@img/img-home-professor.png";
import imgHomeAdmin from "@img/img-home-admin.png"; 

const Home = () => {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const userName = userEmail ? userEmail.split("@")[0] : "Usuário";

  let imgHome = imgHomeAluno; // padrão

  if (userRole === "TEACHER") {
    imgHome = imgHomeProfessor;
  } else if (userRole === "ADMIN") {
    imgHome = imgHomeAdmin;
  }

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Menu />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4" align="left" gutterBottom style={{ color: "#09b800", marginLeft: "5rem", marginTop: "12rem" }}>
          Olá {userName}, seja Bem-vindo!
        </Typography>
        <Typography variant="body1" align="left" paragraph style={{ lineHeight: 1.6, marginLeft: "5rem" }}>
          Ajude-nos a melhorar nosso aprendizado.
        </Typography>

        <img
          src={imgHome}
          alt="Imagem de Entrada"
          style={{ maxWidth: "50%", height: "auto", marginTop: "-20rem", justifyContent: "right", alignItems: "center", display: "flex", marginLeft: "48rem" }}
        />
      </Grid>
    </Grid>
  );
};

export default Home;

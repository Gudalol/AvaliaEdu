import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import "@fontsource/lato/700.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import TemaPlanin from "@theme/TemaPadrao.jsx";
import Login from "@pages/Login";
import { Home } from "@pages/Home";
import { Disciplinas } from "@pages/Disciplinas";
import { Avaliacoes } from "@pages/Avaliacoes";
import { Project } from "@pages/Project";
import { Alunos } from "@pages/Alunos";
import { Professores } from "@pages/Professores";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/Alunos",
    element: <Alunos />,
  },
  {
    path: "/Disciplinas",
    element: <Disciplinas />,
  },
  {
    path: "/Avaliacoes",
    element: <Avaliacoes />,
  },
  {
    path: "/project",
    element: <Project />,
  },
  { 
    path: "/professores",
    element: <Professores />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={TemaPlanin}>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  </React.StrictMode>,
);

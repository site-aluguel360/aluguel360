import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home";
import { ResultadosPesquisa } from "./pages/ResultadosPesquisa";
import { CadastroUsuario } from "./pages/CadastroUsuario";
import { Login } from "./pages/Login";
import { EditProfile } from "./pages/EditProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/editar-perfil" element={<EditProfile />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path="contact"
            element={
              <div className="p-20 text-center text-xl">
                Contato (Em breve)
              </div>
            }
          />

          <Route
            path="resultados"
            element={<ResultadosPesquisa />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home";
import { ResultadosPesquisa } from "./pages/ResultadosPesquisa";
import { CadastroUsuario } from "./pages/CadastroUsuario";
import { Login } from "./pages/Login";
import { EditProfile } from "./pages/EditProfile";
import { RecuperarSenha } from "./pages/RecuperarSenha";

import { About } from "./pages/About";
import { Perfil } from "./pages/Perfil";
import { PerfilEnderecos } from "./pages/PerfilEnderecos";
import { PerfilSeguranca } from "./pages/PerfilSeguranca";
import { PerfilPrivacidade } from "./pages/PerfilPrivacidade";
import { PerfilQualidade } from "./pages/PerfilQualidade";
import { PerfilMidia } from "./pages/PerfilMidia";
import { PerfilMeusImoveis } from "./pages/PerfilMeusImoveis";
import { PerfilMeusAnuncios } from "./pages/PerfilMeusAnuncios";
import { CadastroImovel } from "./pages/CadastroImovel";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="contact" element={<Navigate to="#footer" replace />} />
            <Route path="resultados" element={<ResultadosPesquisa />} />
            <Route path="about" element={<About />} />
            <Route path="recuperar-senha" element={<RecuperarSenha />} />

            <Route path="perfil" element={<Perfil />} />
            <Route path="perfil/editar" element={<EditProfile />} />
            <Route path="perfil/enderecos" element={<PerfilEnderecos />} />
            <Route path="perfil/seguranca" element={<PerfilSeguranca />} />
            <Route path="perfil/privacidade" element={<PerfilPrivacidade />} />
            <Route path="perfil/qualidade" element={<PerfilQualidade />} />
            <Route path="perfil/midia" element={<PerfilMidia />} />
            <Route path="perfil/cadastro-imovel" element={<CadastroImovel />} />
            <Route path="perfil/meus-imoveis" element={<PerfilMeusImoveis />} />
            <Route path="perfil/meus-anuncios" element={<PerfilMeusAnuncios />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
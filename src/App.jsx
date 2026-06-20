import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home";
import { ResultadosPesquisa } from "./pages/ResultadosPesquisa";
import { CadastroUsuario } from "./pages/CadastroUsuario";
import { Login } from "./pages/Login";
import { About } from "./pages/About";
import { Perfil } from "./pages/Perfil";
import { PerfilEnderecos } from "./pages/PerfilEnderecos";
import { PerfilSeguranca } from "./pages/PerfilSeguranca";
import { PerfilPrivacidade } from "./pages/PerfilPrivacidade";
import { PerfilQualidade } from "./pages/PerfilQualidade";
import { PerfilMidia } from "./pages/PerfilMidia";
import { PerfilMeusImoveis } from "./pages/PerfilMeusImoveis";
import { PerfilMeusAnuncios } from "./pages/PerfilMeusAnuncios";
// import { RecuperarSenha } from "./pages/RecuperarSenha";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
           
        <Route path="/" element={<Layout />}>
        
          <Route index element={<Home />} />
          {/* Futuramente, novas páginas serão adicionadas aqui */}
          <Route path="resultados" element={<ResultadosPesquisa />} />
          <Route path="contact" element={<div className="p-20 text-center text-xl">Contato (Em breve)</div>} />
          <Route path="about" element={<About />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="perfil/enderecos" element={<PerfilEnderecos />} />
          <Route path="perfil/seguranca" element={<PerfilSeguranca />} />
          <Route path="perfil/privacidade" element={<PerfilPrivacidade />} />
          <Route path="perfil/qualidade" element={<PerfilQualidade />} />
          <Route path="perfil/midia" element={<PerfilMidia />} />
          <Route path="perfil/meus-imoveis" element={<PerfilMeusImoveis />} />
          <Route path="perfil/meus-anuncios" element={<PerfilMeusAnuncios />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
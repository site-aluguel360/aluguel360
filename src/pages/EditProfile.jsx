import { useState } from "react";
import { Link } from "react-router-dom";
import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PerfilCard } from "../components/PerfilCard";

const usuarioMock = {
  nome: "Fulano de Tal",
  email: "fulanodetal@gmail.com",
  iniciais: "FT",
  dataCadastro: "01/02/2023",
  cpf: "123.***.***-10"
};

export function EditProfile() {
  const [user, setUser] = useState({
    nome: "Fulano de Tal",
    email: "fulanodetal@gmail.com",
    telefone: "(89) 99999-8888",
    dataNascimento: "2000-01-01",
    cidade: "Floriano",
    estado: "PI",
    rua: "",
    numeroCasa: "",
    cep: "",
    logradouro: "",
    bairro: "",
    complemento: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMessage("Alterações salvas com sucesso!");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      {/* Main Layout Grid */}
      <div className="grid gap-8 min-[1080px]:grid-cols-[200px_minmax(0,1fr)]">
        {/* Sidebar Left */}
        <PerfilSidebar />

        {/* Content Right */}
        <div className="flex flex-col min-w-0">
          {/* Header */}
          <PerfilHeader usuario={usuarioMock} />

          <PerfilCard
            titulo="Editar Perfil"
            descricao="Atualize suas informações pessoais e endereço."
          >
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Dados pessoais */}
              <div className="md:col-span-2">
                <h2 className="text-[16px] font-semibold text-primary border-b pb-2 mb-2">Dados Pessoais</h2>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">Nome Completo</label>
                <Input
                  type="text"
                  name="nome"
                  value={user.nome}
                  onChange={handleChange}
                  placeholder="Digite o nome completo"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">E-mail</label>
                <Input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Digite o Email"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">Data de Nascimento</label>
                <Input
                  type="date"
                  name="dataNascimento"
                  value={user.dataNascimento}
                  onChange={handleChange}
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">Telefone</label>
                <Input
                  type="text"
                  name="telefone"
                  value={user.telefone}
                  onChange={handleChange}
                  placeholder="Digite o Telefone"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              {/* Endereço */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-[16px] font-semibold text-primary border-b pb-2 mb-2">Endereço</h2>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">CEP</label>
                <Input
                  type="text"
                  name="cep"
                  value={user.cep}
                  onChange={handleChange}
                  placeholder="Digite o CEP"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">Estado</label>
                <Input
                  type="text"
                  name="estado"
                  value={user.estado}
                  onChange={handleChange}
                  placeholder="Digite o Estado"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">Cidade</label>
                <Input
                  type="text"
                  name="cidade"
                  value={user.cidade}
                  onChange={handleChange}
                  placeholder="Digite a Cidade"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">Bairro</label>
                <Input
                  type="text"
                  name="bairro"
                  value={user.bairro}
                  onChange={handleChange}
                  placeholder="Digite o Bairro"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[14px] font-medium text-foreground">Logradouro / Rua</label>
                <Input
                  type="text"
                  name="logradouro"
                  value={user.logradouro}
                  onChange={handleChange}
                  placeholder="Digite o Logradouro/Rua"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">Número</label>
                <Input
                  type="text"
                  name="numeroCasa"
                  value={user.numeroCasa}
                  onChange={handleChange}
                  placeholder="Número"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-foreground">Complemento</label>
                <Input
                  type="text"
                  name="complemento"
                  value={user.complemento}
                  onChange={handleChange}
                  placeholder="Ex: Apto 123, Bloco B"
                  className="h-[41px] rounded-[9px] border-primary bg-white px-3 text-[14px] font-light text-foreground"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                <Link to="/perfil">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 px-6 rounded-[9px] border-primary text-primary hover:bg-accent"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="h-10 px-8 rounded-[9px] bg-primary font-normal text-white hover:bg-primary-light"
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>

            {message && (
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[14px] font-medium flex items-center gap-2">
                ✅ {message}
              </div>
            )}
          </PerfilCard>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";

export function EditProfile() {
  const [user, setUser] = useState({
    nome: "Francieli dos Santos",
    email: "francieli@email.com",
    telefone: "(89) 99999-8888",
    dataNascimento: "2000-01-01",
    cidade: "Floriano",
    estado: "PI",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setMessage("Alterações salvas com sucesso!");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
  <div className="min-h-screen bg-gray-100 py-10 px-4">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#145C63]">
          Editar Perfil
        </h1>
        <p className="text-gray-500 mt-2">
          Atualize suas informações pessoais e endereço.
        </p>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dados pessoais */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            name="nome"
            value={user.nome}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Data de Nascimento
         </label>

         <input
           type="date"
           name="dataNascimento"
           value={user.dataNascimento}
           onChange={handleChange}
           className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#356F75]"
         />
         </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Telefone
          </label>
          <input
            type="text"
            name="telefone"
            value={user.telefone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        

        {/* Endereço */}
        <div className="md:col-span-2 mt-4">
          <h2 className="text-xl font-semibold text-[#145C63]">
            Endereço
          </h2>
        </div>
        <div>
        <label className="block mb-2 font-medium">
          Rua
        </label>

        <input
          type="text"
          name="rua"
          value={user.rua}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3"
       />
      </div>

      <div>
      <label className="block mb-2 font-medium">
        Número
     </label>

    <input
      type="text"
      name="numero"
      value={user.numeroCasa}
      onChange={handleChange}
     className="w-full border border-gray-300 rounded-lg p-3"
    />
    </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            CEP
          </label>
          <input
            type="text"
            name="cep"
            value={user.cep}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Logradouro
          </label>
          <input
            type="text"
            name="logradouro"
            value={user.logradouro}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Bairro
          </label>
          <input
            type="text"
            name="bairro"
            value={user.bairro}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Complemento
          </label>
          <input
            type="text"
            name="complemento"
            value={user.complemento}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Cidade
          </label>
          <input
            type="text"
            name="cidade"
            value={user.cidade}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Estado
          </label>
          <input
            type="text"
            name="estado"
            value={user.estado}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#145C63] text-white px-6 py-3 rounded-lg hover:opacity-90"
          >
            Salvar Alterações
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-6 p-4 rounded-lg bg-green-100 border border-green-300 text-green-700">
          ✅ {message}
        </div>
      )}
    </div>
  </div>
);
}
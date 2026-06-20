import { useState } from "react";

export function EditProfile() {
  const [user, setUser] = useState({
    nome: "Francieli dos Santos",
    email: "francieli@email.com",
    telefone: "(89) 99999-8888",
    cpf: "123.456.789-00",
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
  <div className="min-h-screen bg-gray-100 py-12 px-4">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center text-[#1F5D63] mb-2">
        Editar Perfil
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Atualize suas informações pessoais
      </p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            name="nome"
            value={user.nome}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F5D63]"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F5D63]"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="text"
            name="telefone"
            value={user.telefone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F5D63]"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            CPF
          </label>
          <input
            type="text"
            name="cpf"
            value={user.cpf}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F5D63]"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Cidade
          </label>
          <input
            type="text"
            name="cidade"
            value={user.cidade}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F5D63]"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Estado
          </label>
          <input
            type="text"
            name="estado"
            value={user.estado}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F5D63]"
          />
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#1F5D63] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Salvar Alterações
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-6 bg-green-100 border border-green-300 text-green-700 p-4 rounded-xl">
          {message}
        </div>
      )}
    </div>
  </div>
);

}
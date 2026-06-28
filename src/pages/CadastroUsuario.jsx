import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Sun } from "lucide-react";
import { Button, ButtonForms } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialForm = {
  nome: "",
  email: "",
  telefone: "",
  nascimento: "",
  cpf: "",
  senha: "",
  confirmarSenha: "",
  cep: "",
  logradouro: "",
  bairro: "",
  complemento: "",
};

const personalFields = [
  {
    label: "Nome completo",
    name: "nome",
    placeholder: "Digite o nome completo",
    className: "sm:col-span-2",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Digite o Email",
    className: "sm:col-span-2",
  },
  {
    label: "Telefone",
    name: "telefone",
    placeholder: "Digite o Telefone",
    className: "sm:col-span-2",
  },
  {
    label: "Data de Nascimento",
    name: "nascimento",
    type: "date",
    placeholder: "Digite a Data de Nascimento",
  },
  {
    label: "CPF",
    name: "cpf",
    placeholder: "Digite CPF",
  },
  {
    label: "Crie uma Senha",
    name: "senha",
    type: "password",
    placeholder: "Digite uma senha",
  },
  {
    label: "Confirme a Senha",
    name: "confirmarSenha",
    type: "password",
    placeholder: "Digite novamente",
  },
];

const addressFields = [
  {
    label: "CEP",
    name: "cep",
    placeholder: "Digite o CEP",
  },
  {
    label: "Logradouro",
    name: "logradouro",
    placeholder: "Digite o Logradouro",
  },
  {
    label: "Bairro",
    name: "bairro",
    placeholder: "Digite o Bairro",
  },
  {
    label: "Complemento",
    name: "complemento",
    placeholder: "Digite o Complemento",
    required: false,
  },
];


function LogoPainel() {
  return (
    <div className="flex min-h-[180px] items-center justify-center bg-[#1A535C] px-8 py-10 text-center sm:min-h-[240px] lg:min-h-[560px]">
      <Link to="/" aria-label="Voltar para a página inicial">
        <img
          src="/logo_fundo_removido_aluguel360.svg"
          alt="Aluguel360"
          className="h-auto w-[240px] max-w-full sm:w-[320px] lg:w-[447px]"
        />
      </Link>
    </div>
  );
}

function Field({ label, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1 font-['Inter'] text-[14px] font-medium leading-normal text-black sm:text-[16px] ${className}`}>
      {label}
      <Input
        className="h-[41px] rounded-[9px] border-[#1A535C] bg-white px-2 font-['Inter'] text-[14px] font-light text-[#2D2D2D] shadow-none transition-all duration-200 placeholder:text-black/60 focus-visible:ring-1 focus-visible:ring-[#1A535C] sm:text-[15px]"
        {...props}
      />
    </label>
  );
}

function StepTitle({ title }) {
  return (
    <div className="w-full max-w-[472px] text-[#2D2D2D]/90">
      <h1 className="font-['Poppins'] text-[26px] font-semibold leading-normal sm:text-[32px]">{title}</h1>
      <p className="font-['Inter'] text-[14px] leading-normal sm:text-[16px]">Preencha seus dados pessoais</p>
    </div>
  );
}



export function CadastroUsuario() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handlePersonalSubmit = (event) => {
    event.preventDefault();
    setStep(2);
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    setStep(3);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white px-4 py-6 sm:px-6 sm:py-8 lg:p-0 min-[1080px]:px-8 min-[1080px]:py-12">
      <section className="m-auto grid w-full max-w-[1200px] overflow-hidden rounded-[8px] border border-[#515151]/80 bg-white shadow-[0_0_2.2px_0_#1A535C] lg:max-w-none lg:min-h-screen lg:rounded-none lg:border-none lg:shadow-none min-[1080px]:max-w-[1200px] min-[1080px]:min-h-0 min-[1080px]:rounded-[8px] min-[1080px]:border min-[1080px]:border-[#515151]/80 min-[1080px]:shadow-[0_0_2.2px_0_#1A535C] lg:grid-cols-2">
        <LogoPainel />

        <div className="flex min-h-[auto] items-center justify-center overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[560px] lg:px-10">
          {step === 1 && (
            <form
              key="personal"
              onSubmit={handlePersonalSubmit}
              className="auth-step-panel flex w-full max-w-[472px] flex-col items-center gap-5"
            >
              <StepTitle title="Vamos criar sua conta" />

              <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                {personalFields.map((field) => (
                  <Field
                    key={field.name}
                    {...field}
                    value={form[field.name]}
                    onChange={updateField}
                    required={field.required ?? true}
                  />
                ))}
              </div>

              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-5">
                <ButtonForms

                  variant="danger"
                  className="w-full sm:w-[130px]"
                >
                  <Link to="/">

                    Cancelar
                  </Link>
                </ButtonForms>
                <ButtonForms type="submit" className="w-full sm:w-[128px]">

                  Próximo &gt;&gt;
                </ButtonForms>
              </div>
            </form>
          )}

          {step === 2 && (
            <form
              key="address"
              onSubmit={handleAddressSubmit}
              className="auth-step-panel flex w-full max-w-[472px] flex-col items-center gap-5"
            >
              <StepTitle title="Adicione seu endereço" />

              <div className="grid w-full gap-5">
                {addressFields.map((field) => (
                  <Field
                    key={field.name}
                    {...field}
                    value={form[field.name]}
                    onChange={updateField}
                    required={field.required ?? true}
                  />
                ))}
              </div>

              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-5">
                <ButtonForms
                  type="button"
                  onClick={() => setStep(1)}
                  variant="subtle"
                  className="w-full sm:w-[173px]"
                >
                  &lt;&lt; Voltar
                </ButtonForms>
                <ButtonForms type="submit" className="w-full sm:w-[173px]">
                  Concluir Cadastro
                </ButtonForms>
              </div>
            </form>
          )}

          {step === 3 && (
            <div
              key="success"
              className="auth-step-panel flex w-full max-w-[514px] flex-col items-center justify-center text-center"
            >
              <Sun className="h-[75px] w-[75px] text-[#2C7E7B]" strokeWidth={1.25} />
              <h1 className="mt-2 font-['Poppins'] text-[28px] font-semibold leading-normal text-[#2D2D2D]/90 sm:text-[32px]">
                Sucesso!
              </h1>
              <p className="font-['Inter'] text-[14px] text-[#2D2D2D]/90 sm:text-[16px]">
                Cadastro realizado com sucesso!
              </p>
              <Button
                asChild
                className="h-10 mt-8 gap-2 rounded-[9px] bg-[#1A535C] font-['Poppins'] text-[16px] font-normal text-[#F0F4F8] shadow-[0_0_6.1px_0_rgba(0,0,0,0.41)] hover:bg-[#2F646C]"
              >
                <Link to="/login">
                  <LogIn className="h-5 w-5" /> Acessar minha conta
                </Link>
              </Button>
              
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

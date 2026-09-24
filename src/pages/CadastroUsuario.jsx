import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Sun } from "lucide-react";
import { Button, ButtonForms } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { toApiError } from "../lib/api";
import { toRegisterPayload } from "../lib/adapters";
import { lookupCep } from "../lib/viacep";

const initialForm = { nome: "", email: "", telefone: "", nascimento: "", cpf: "", senha: "", confirmarSenha: "", cep: "", logradouro: "", numero: "", bairro: "", cidade: "", estado: "", complemento: "" };
const personalFields = [
  { label: "Nome completo", name: "nome", placeholder: "Digite o nome completo", className: "sm:col-span-2" },
  { label: "Email", name: "email", type: "email", placeholder: "Digite o Email", className: "sm:col-span-2" },
  { label: "Telefone", name: "telefone", placeholder: "Digite o Telefone", className: "sm:col-span-2" },
  { label: "Data de Nascimento", name: "nascimento", type: "date", placeholder: "Digite a Data de Nascimento" },
  { label: "CPF", name: "cpf", placeholder: "Digite CPF" },
  { label: "Crie uma Senha", name: "senha", type: "password", placeholder: "Digite uma senha" },
  { label: "Confirme a Senha", name: "confirmarSenha", type: "password", placeholder: "Digite novamente" },
];
const addressFields = [
  { label: "CEP", name: "cep", placeholder: "Digite o CEP", hint: "O endereço será preenchido automaticamente" },
  { label: "Logradouro", name: "logradouro", placeholder: "Digite o Logradouro", className: "sm:col-span-2" },
  { label: "Número", name: "numero", placeholder: "Número" },
  { label: "Bairro", name: "bairro", placeholder: "Digite o Bairro" },
  { label: "Cidade", name: "cidade", placeholder: "Digite a Cidade" },
  { label: "Estado", name: "estado", placeholder: "UF", maxLength: 2 },
  { label: "Complemento", name: "complemento", placeholder: "Digite o Complemento", required: false, className: "sm:col-span-2" },
];

function LogoPainel() { return <div className="flex min-h-[180px] items-center justify-center bg-[#1A535C] px-8 py-10 text-center sm:min-h-[240px] lg:min-h-[560px]"><Link to="/" aria-label="Voltar para a página inicial"><img src="/logo_fundo_removido_aluguel360.svg" alt="Aluguel360" className="h-auto w-[240px] max-w-full sm:w-[320px] lg:w-[447px]" /></Link></div>; }
function Field({ label, hint, className = "", ...props }) { return <label className={`flex flex-col gap-1 font-['Inter'] text-[14px] font-medium leading-normal text-black sm:text-[16px] ${className}`}>{label}<Input className="h-[41px] rounded-[9px] border-[#1A535C] bg-white px-2 font-['Inter'] text-[14px] font-light text-[#2D2D2D] shadow-none placeholder:text-black/60 focus-visible:ring-1 focus-visible:ring-[#1A535C] sm:text-[15px]" {...props} />{hint && <small className="font-normal text-gray-500">{hint}</small>}</label>; }
function StepTitle({ title, subtitle }) { return <div className="w-full max-w-[472px] text-[#2D2D2D]/90"><h1 className="font-['Poppins'] text-[26px] font-semibold sm:text-[32px]">{title}</h1><p className="font-['Inter'] text-[14px] sm:text-[16px]">{subtitle}</p></div>; }

export function CadastroUsuario() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cepController = useRef(null);
  const { register } = useAuth();

  const updateField = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.name === "estado" ? target.value.toUpperCase() : target.value }));

  useEffect(() => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return undefined;
    cepController.current?.abort();
    const controller = new AbortController();
    cepController.current = controller;
    lookupCep(cep, controller.signal).then((address) => {
      if (!address) return;
      setForm((current) => ({ ...current, ...address }));
      setError("");
    }).catch((requestError) => {
      if (requestError.name !== "AbortError") setError(requestError.message);
    });
    return () => controller.abort();
  }, [form.cep]);

  const handlePersonalSubmit = (event) => { event.preventDefault(); setError(""); setStep(2); };
  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try { await register(toRegisterPayload(form)); setStep(3); }
    catch (requestError) { setError(toApiError(requestError)); }
    finally { setIsSubmitting(false); }
  };

  return <main className="flex min-h-screen flex-col bg-white px-4 py-6 sm:px-6 sm:py-8 lg:p-0 min-[1080px]:px-8 min-[1080px]:py-12"><section className="m-auto grid w-full max-w-[1200px] overflow-hidden rounded-[8px] border border-[#515151]/80 bg-white shadow-[0_0_2.2px_0_#1A535C] lg:grid-cols-2"><LogoPainel /><div className="flex min-h-[auto] items-center justify-center overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[560px] lg:px-10">
    {step === 1 && <form onSubmit={handlePersonalSubmit} className="flex w-full max-w-[472px] flex-col items-center gap-5"><StepTitle title="Vamos criar sua conta" subtitle="Preencha seus dados pessoais" /><div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">{personalFields.map((field) => <Field key={field.name} {...field} value={form[field.name]} onChange={updateField} required={field.required ?? true} />)}</div><div className="flex w-full justify-center gap-3 sm:w-auto sm:gap-5"><ButtonForms variant="danger" className="w-full sm:w-[130px]"><Link to="/">Cancelar</Link></ButtonForms><ButtonForms type="submit" className="w-full sm:w-[128px]">Próximo &gt;&gt;</ButtonForms></div></form>}
    {step === 2 && <form onSubmit={handleAddressSubmit} className="flex w-full max-w-[472px] flex-col items-center gap-5"><StepTitle title="Adicione seu endereço" subtitle="Consulte o CEP para preencher o endereço automaticamente" /><div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">{addressFields.map((field) => <Field key={field.name} {...field} value={form[field.name]} onChange={updateField} required={field.required ?? true} />)}</div>{error && <p role="alert" className="w-full rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="flex w-full justify-center gap-3 sm:w-auto sm:gap-5"><ButtonForms type="button" onClick={() => setStep(1)} variant="subtle" className="w-full sm:w-[173px]">&lt;&lt; Voltar</ButtonForms><ButtonForms type="submit" disabled={isSubmitting} className="w-full sm:w-[173px]">{isSubmitting ? "Cadastrando..." : "Concluir Cadastro"}</ButtonForms></div></form>}
    {step === 3 && <div className="flex w-full max-w-[514px] flex-col items-center justify-center text-center"><Sun className="h-[75px] w-[75px] text-[#2C7E7B]" strokeWidth={1.25} /><h1 className="mt-2 font-['Poppins'] text-[28px] font-semibold text-[#2D2D2D]/90 sm:text-[32px]">Sucesso!</h1><p className="font-['Inter'] text-[14px] text-[#2D2D2D]/90 sm:text-[16px]">Cadastro realizado com sucesso!</p><Button asChild className="mt-8 h-10 gap-2 rounded-[9px] bg-[#1A535C] text-[#F0F4F8]"><Link to="/"><LogIn className="h-5 w-5" /> Acessar a plataforma</Link></Button></div>}
  </div></section></main>;
}

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ButtonForms } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi, toApiError } from "../lib/api";

const INITIAL_OTP = ["", "", "", "", "", ""];

export function RecuperarSenha() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(INITIAL_OTP);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpInputs = useRef([]);

  const clearFeedback = () => {
    setError("");
    setFieldErrors({});
  };

  const getFieldErrors = (requestError) => {
    const details = requestError?.payload?.details || requestError?.payload;
    if (!details || typeof details !== "object" || Array.isArray(details)) return {};
    return Object.fromEntries(
      Object.entries(details).filter(([, value]) => value !== undefined && value !== null),
    );
  };

  const runRequest = async (request, nextStep) => {
    clearFeedback();
    setIsSubmitting(true);
    try {
      await request();
      setStep(nextStep);
      return true;
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      setError(toApiError(requestError));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    await runRequest(() => authApi.forgotPassword(email.trim()), 2);
  };

  const handleOtpChange = (event, index) => {
    const value = event.target.value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    clearFeedback();
    if (value && index < nextOtp.length - 1) otpInputs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const nextOtp = INITIAL_OTP.map((_, index) => pasted[index] || "");
    setOtp(nextOtp);
    otpInputs.current[Math.min(pasted.length, 6) - 1]?.focus();
  };

  const handleOtpBackspace = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    const codigo = otp.join("");
    await runRequest(() => authApi.verifyOtp(email.trim(), codigo), 3);
  };

  const handleResendOtp = async () => {
    await runRequest(() => authApi.forgotPassword(email.trim()), 2);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const succeeded = await runRequest(
      () => authApi.resetPassword({
        email: email.trim(),
        codigo: otp.join(""),
        nova_senha: password,
        confirmar_nova_senha: passwordConfirmation,
      }),
      4,
    );
    if (succeeded) {
      setEmail("");
      setOtp(INITIAL_OTP);
      setPassword("");
      setPasswordConfirmation("");
    }
  };

  const renderFeedback = () => (
    <>
      {error && <p className="mt-4 text-center text-sm text-red-600" role="alert">{error}</p>}
      {Object.entries(fieldErrors).map(([field, message]) => (
        <p key={field} className="mt-1 text-center text-sm text-red-600" role="alert">
          {Array.isArray(message) ? message.join(" ") : message}
        </p>
      ))}
    </>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F0F4F8] p-6">
      <section className="flex min-h-[754px] w-[605px] flex-col rounded-[8px] bg-white px-[45px] py-[51px]">
        <div className="mb-5 flex justify-center">
          <img src="/logoFundoVerde.svg" alt="Aluguel360" className="h-[44px] w-[161px]" />
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <h1 className="text-[32px] font-semibold text-[rgba(45,45,45,0.87)]">Perdeu a senha?</h1>
            <p className="mt-4 text-[20px] font-light text-black">Preencha abaixo para verificarmos sua identidade</p>
            <div className="mt-16">
              <label htmlFor="recovery-email" className="mb-3 block text-[24px] font-light text-black">E-mail</label>
              <Input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Digite o email"
                required
                autoComplete="email"
                className="h-[60px] rounded-[9px] border-[#1A535C] px-[8px] pr-[20px] text-[15px] font-light placeholder:text-[15px] placeholder:font-light placeholder:text-black/60"
              />
            </div>
            {renderFeedback()}
            <div className="mt-12 flex flex-col items-center gap-4">
              <ButtonForms type="submit" disabled={isSubmitting} className="h-[39px] w-[215px] text-[20px]">
                {isSubmitting ? "Enviando..." : "Prosseguir >>"}
              </ButtonForms>
              <Link to="/" className="text-[16px] font-normal text-[#1A535C] underline underline-offset-[3px]">Cancelar Operação</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <h1 className="w-[515px] text-[32px] font-semibold text-[rgba(45,45,45,0.87)]">Acesse seu email</h1>
            <p className="mt-4 w-[515px] text-[20px] font-light text-black">Enviamos um código para você.</p>
            <div className="mt-16 flex justify-center gap-[20px]" onPaste={handleOtpPaste}>
              {otp.map((value, index) => (
                <Input
                  key={index}
                  aria-label={`Dígito ${index + 1} do código`}
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  ref={(element) => { otpInputs.current[index] = element; }}
                  onChange={(event) => handleOtpChange(event, index)}
                  onKeyDown={(event) => handleOtpBackspace(event, index)}
                  className="h-[42px] w-[42px] rounded-[8px] border-[#4ECDC4] text-center text-[18px] font-normal"
                />
              ))}
            </div>
            {renderFeedback()}
            <div className="mt-[30px] flex items-center justify-center gap-2">
              <span className="text-[12px] font-light text-black">Não recebeu o código?</span>
              <button type="button" onClick={handleResendOtp} disabled={isSubmitting} className="text-[12px] font-semibold text-[#1A535C] underline underline-offset-[1.5px]">
                Enviar novamente
              </button>
            </div>
            <div className="mt-[40px] flex flex-col items-center gap-6">
              <ButtonForms type="submit" disabled={isSubmitting || otp.join("").length !== 6} className="h-[39px] w-[215px] text-[20px]">
                {isSubmitting ? "Validando..." : "Continuar >>"}
              </ButtonForms>
              <Link to="/" className="text-[16px] font-normal text-[#1A535C] underline underline-offset-[3px]">Cancelar Operação</Link>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h1 className="w-[515px] text-[32px] font-semibold text-[rgba(45,45,45,0.87)]">Vamos redefinir a senha</h1>
            <p className="mt-4 w-[515px] text-[20px] font-light text-black">Digite abaixo a <span className="font-medium">nova</span> senha.</p>
            <label htmlFor="new-password" className="mb-1 block text-[24px] font-light text-black">Senha</label>
            <div className="relative">
              <Input id="new-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite a nova senha" required minLength={8} autoComplete="new-password" className="h-[56px] rounded-[9px] border-[#1A535C] pl-[8px] pr-12 text-[15px] font-light placeholder:text-black/60" />
              <button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A535C]">
                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
            <div className="relative mt-4">
              <label htmlFor="confirm-new-password" className="mb-1 block text-[24px] font-light text-black">Digite Novamente</label>
              <Input id="confirm-new-password" type={showPasswordConfirmation ? "text" : "password"} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Digite novamente a nova senha" required minLength={8} autoComplete="new-password" className="h-[56px] rounded-[9px] border-[#1A535C] pl-[8px] pr-12 text-[15px] font-light placeholder:text-black/60" />
              <button type="button" aria-label={showPasswordConfirmation ? "Ocultar confirmação" : "Mostrar confirmação"} onClick={() => setShowPasswordConfirmation((visible) => !visible)} className="absolute right-3 top-3/4 -translate-y-3/4 text-[#1A535C]">
                {showPasswordConfirmation ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
            {renderFeedback()}
            <div className="mt-5 flex justify-center gap-4">
              <ButtonForms type="submit" disabled={isSubmitting} className="h-[39px] w-[215px] text-[20px]">
                {isSubmitting ? "Salvando..." : "Continuar >>"}
              </ButtonForms>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center gap-[10px] text-center">
            <img src="/sucess.svg" alt="Sucesso" className="h-[75px] w-[71px]" />
            <h1 className="text-[32px] font-semibold text-[rgba(45,45,45,0.87)]">Sucesso!</h1>
            <p className="max-w-[515px] text-[16px] font-normal text-[rgba(45,45,45,0.87)]">Redefinimos sua senha com sucesso!</p>
            <ButtonForms asChild className="h-[42px] w-[269px] text-[16px]"><Link to="/login">Acessar minha conta</Link></ButtonForms>
          </div>
        )}
      </section>
    </main>
  );
}

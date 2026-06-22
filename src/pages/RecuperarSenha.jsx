import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RecuperarSenha() {

    const [step, setStep] = useState(1);

    const otpInputs = useRef([]);

    const handleOtpChange = (e, index) => {
        const value = e.target.value;

        if (value.length === 1 && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    const handleOtpBackspace = (e, index) => {
        if (
            e.key === "Backspace" &&
            !e.target.value &&
            index > 0
        ) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-200 p-6">

            <section className="w-full max-w-[620px] rounded-xl bg-white p-12 shadow-lg">

                {/* Logo */}
                <div className="mb-12 flex justify-center">
                    <img
                        src="./logoFundoVerde.svg"
                        alt="Aluguel360"
                        className="w-[220px]"
                    />
                </div>

                {/* Formulário 1 */}
                {step === 1 && (
                    <div>
                        <h1 className="text-5xl font-bold">
                            Perdeu a senha?
                        </h1>

                        <p className="mt-4 text-2xl">
                            Preencha abaixo para verificarmos sua identidade
                        </p>

                        <div className="mt-16">
                            <label className="mb-2 block text-xl">
                                E-mail
                            </label>

                            <Input placeholder="Digite o email" />
                        </div>

                        <div className="mt-12 flex flex-col items-center gap-4">
                            <Button onClick={() => setStep(2)}>
                                Prosseguir
                            </Button>

                            <Link to="/">
                                Cancelar Operação
                            </Link>
                        </div>
                    </div>
                )}

                {/* Formulário 2 */}
                {step === 2 && (
                    <div>
                        <h1 className="text-5xl font-bold">
                            Acesse seu email
                        </h1>

                        <p className="mt-4 text-2xl">
                            Enviamos um código para você.
                        </p>

                        <div className="mt-16 flex justify-center gap-3">
                            {[...Array(6)].map((_, index) => (
                                <Input
                                    key={index}
                                    maxLength={1}
                                    ref={(el) => {
                                        otpInputs.current[index] = el;
                                    }}
                                    onChange={(e) =>
                                        handleOtpChange(e, index)
                                    }
                                    onKeyDown={(e) =>
                                        handleOtpBackspace(e, index)
                                    }
                                    className="h-14 w-14 text-center text-xl"
                                />
                            ))}
                        </div>

                        <div className="mt-6 text-center">
                            Não recebeu o código?
                            <button className="ml-2 underline">
                                Enviar novamente
                            </button>
                        </div>

                        <div className="mt-10 flex justify-center gap-4">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                Voltar
                            </Button>

                            <Button onClick={() => setStep(3)}>
                                Continuar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Formulário 3 */}
                {step === 3 && (
                    <div>
                        <h1 className="text-5xl font-bold">
                            Vamos redefinir a senha
                        </h1>

                        <div className="mt-12">
                            <label className="mb-2 block">
                                Nova senha
                            </label>

                            <Input
                                type="password"
                                placeholder="Digite a nova senha"
                            />
                        </div>

                        <div className="mt-8">
                            <label className="mb-2 block">
                                Confirme a senha
                            </label>

                            <Input
                                type="password"
                                placeholder="Digite novamente"
                            />
                        </div>

                        <div className="mt-10 flex justify-center gap-4">
                            <Button variant="outline" onClick={() => setStep(2)}>
                                Voltar
                            </Button>

                            <Button onClick={() => setStep(4)}>
                                Continuar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Formulário 4 */}
                {step === 4 && (
                    <div className="text-center">
                        <div className="mb-6 text-7xl">
                            <img
                                src="/public/sucess.svg"
                                alt="Sucesso"
                                className="mx-auto h-16 w-16"
                            />
                        </div>

                        <h1 className="text-5xl font-bold">
                            Sucesso!
                        </h1>

                        <p className="mt-4 text-xl">
                            Redefinimos sua senha com sucesso!
                        </p>

                        <div className="mt-10">
                            <Button asChild>
                                <Link to="/login">
                                    Acessar minha conta
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}

            </section>

        </main>
    );
}
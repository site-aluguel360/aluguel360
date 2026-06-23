import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { EyeOff } from "lucide-react";
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
        <main className="flex min-h-screen items-center justify-center bg-[#F0F4F8] p-6">

            <section className="flex w-[605px] h-[754px] flex-col rounded-[8px] bg-white px-[45px] py-[51px]">
                {/* Logo */}
                <div className="mb-5 flex justify-center">
                    <img
                        src="./logoFundoVerde.svg"
                        alt="Aluguel360"
                        className="w-[161px] h-[44px]"
                    />
                </div>

                {/* Formulário 1 */}
                {step === 1 && (
                    <div>
                        <h1 className="text-[32px] font-semibold text-[rgba(45,45,45,0.87)]">
                            Perdeu a senha?
                        </h1>

                        <p className="mt-4 text-[20px] font-light text-black">
                            Preencha abaixo para verificarmos sua identidade
                        </p>

                        <div className="mt-16">
                            <label className="mb-3 block text-[24px] font-light text-black">
                                E-mail
                            </label>

                            <Input placeholder="Digite o email" className=" h-[60px] rounded-[9px] border-[#1A535C] px-[8px] pr-[20px]text-[15px] font-light placeholder:text-[15px] placeholder:font-light placeholder:text-black/60" />
                        </div>

                        <div className="mt-12 flex flex-col items-center gap-4">
                            <Button onClick={() => setStep(2)} className="
                                w-[215px]
                                h-[39px]
                                rounded-[9px]
                                bg-[#2C7E7B]
                                text-[#F0F4F8]
                                text-[20px]
                                font-normal
                                shadow-[0_-1px_6.1px_rgba(0,0,0,0.41)]
                                ">
                                Prosseguir &gt;&gt;
                            </Button>

                            <Link to="/" color="--color-primary" className=" text-[16px] font-normal text-[#1A535C] underline underline-offset-[3px]">
                                Cancelar Operação
                            </Link>
                        </div>
                    </div>
                )}

                {/* Formulário 2 */}
                {step === 2 && (
                    <div>
                        <h1 className="w-[515px] text-[32px] font-semibold text-[rgba(45,45,45,0.87)]">
                            Acesse seu email
                        </h1>

                        <p className="mt-4 w-[515px] text-[20px] font-light text-black">
                            Enviamos um código para você.
                        </p>

                        <div className="mt-16 flex justify-center gap-[20px]">
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
                                    className=" h-[42px] w-[42px] rounded-[8px] border-[#4ECDC4] text-center text-[18px] font-normal " />
                            ))}
                        </div>

                        <div className="mt-[30px] flex items-center justify-center gap-2">
                            <span className="text-[12px] font-light text-black">
                                Não recebeu o código?
                            </span>

                            <button
                                className="
                                    text-[12px]
                                    font-semibold
                                    text-[#1A535C]
                                    underline
                                    underline-offset-[1.5px]
                                "
                            >
                                Enviar novamente
                            </button>
                        </div>

                        <div className="mt-[40px] flex flex-col items-center gap-6">

                            <Button
                                onClick={() => setStep(3)}
                                className="
                                w-[215px]
                                h-[39px]
                                rounded-[9px]
                                bg-[#2C7E7B]
                                text-[#F0F4F8]
                                text-[20px]
                                font-normal
                                shadow-[0_-1px_6.1px_rgba(0,0,0,0.41)]
                            "
                            >
                                Continuar &gt;&gt;
                            </Button>

                            <Link
                                to="/"
                                className="
                                text-[16px]
                                font-normal
                                text-[#1A535C]
                                underline
                                underline-offset-[3px]
                            "
                            >
                                Cancelar Operação
                            </Link>

                        </div>
                    </div>
                )}

                {/* Formulário 3 */}
                {step === 3 && (
                    <div >
                        <h1 className="w-[515px] text-[32px] font-semibold text-[rgba(45,45,45,0.87)]">
                            Vamos redefinir a senha
                        </h1>
                        <p className="mt-4 w-[515px] text-[20px] font-light text-black">
                            Digite abaixo a <span className="font-medium">nova</span> senha.
                        </p>

                        <label className="mb-1 block text-[24px] font-light text-black">
                            Senha
                        </label>

                        <div className="relative">
                            <Input
                                type="password"
                                placeholder="Digite a nova senha"
                                className="
                                h-[56px]
                                rounded-[9px]
                                border-[#1A535C]
                                pr-12
                                pl-[8px]
                                text-[15px]
                                font-light
                                placeholder:text-black/60
                            "
                            />

                            <EyeOff
                                className="
                                absolute
                                right-3
                                top-1/2
                                h-6
                                w-6
                                -translate-y-1/2
                                text-[#1A535C]
                            "
                            />
                        </div>



                        <div className="relative mt-4">
                            <label className="mb-1 block text-[24px] font-light text-black">
                                Digite Novamente
                            </label>
                            <Input
                                type="password"
                                placeholder="Digite novamente a nova senha"
                                className="
                                h-[56px]
                                rounded-[9px]
                                border-[#1A535C]
                                pr-12
                                pl-[8px]
                                text-[15px]
                                font-light
                                placeholder:text-black/60
                            "
                            />

                            <EyeOff className=" absolute right-3 top-3/4 h-6 w-6 -translate-y-3/4 text-[#1A535C] " />
                        </div>

                        <div className="mt-5 flex justify-center gap-4">
                            <Button onClick={() => setStep(4)} className="
                                w-[215px]
                                h-[39px]
                                rounded-[9px]
                                bg-[#2C7E7B]
                                text-[#F0F4F8]
                                text-[20px]
                                font-normal
                                shadow-[0_-1px_6.1px_rgba(0,0,0,0.41)]
                            ">
                                Continuar &gt;&gt;
                            </Button>
                        </div>
                    </div>
                )}

                {/* Formulário 4 */}
                {step === 4 && (
                    <div
                        className="
                    flex
                    flex-col
                    items-center
                    gap-[10px]
                    text-center
                "
                    >
                        <img
                            src="/sucess.svg"
                            alt="Sucesso"
                            className="w-[71px] h-[75px]"
                        />

                        <h1 className="text-[32px] font-semibold text-[rgba(45,45,45,0.87)]">
                            Sucesso!
                        </h1>

                        <p className="max-w-[515px] text-[16px] font-normal text-[rgba(45,45,45,0.87)]">
                            Redefinimos sua senha com sucesso!
                        </p>

                        <Button
                            asChild
                            className="
                        w-[269px]
                        h-[42px]
                        rounded-[9px]
                        bg-[#2C7E7B]
                        text-[16px]
                        font-normal
                        text-[#F0F4F8]
                        shadow-[0_-1px_6.1px_rgba(0,0,0,0.41)]
                    "
                        >
                            <Link to="/login">
                                Acessar minha conta
                            </Link>
                        </Button>
                    </div>
                )}

            </section>

        </main>
    );
}
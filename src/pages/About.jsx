import { Link } from "react-router-dom";
import {
  Camera,
  Video,
  Eye,
  MapPin,
  ShieldCheck,
  Sparkles,
  Building2,
  Search,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export function About() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <ProblemSection />
      <DifferentiatorsSection />
      <HowItWorksSection />
      <MissionSection />
      <HistorySection />
      <TeamSection />
      <FinalCTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Anúncios que Mostram tudo
          <br />
          Minimiza surpresa na visita.
        </h1>
        <p className="mt-6 max-w-2xl text-lg opacity-90 md:text-xl">
          O Aluguel360 força um padrão de qualidade no que é publicado: foto
          por cômodo, vídeo curto do imóvel e localização exata no mapa. <br />
          Proprietário anuncia melhor, inquilino decide com confiança.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-light px-6 py-3 text-sm font-semibold text-primary transition hover:opacity-90"
          >
            Explorar imóveis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-light/40"
          >
            Quero anunciar
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
            O problema
          </p>
          <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
            Anúncio genérico não aluga imóvel bom.
          </h2>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            A maioria das plataformas aceita três fotos ruins, uma descrição
            vaga e um endereço aproximado. O inquilino agenda visitas
            frustrantes; o proprietário perde tempo com contatos
            desqualificados.
          </p>
          <p>
            No Aluguel360 o padrão é outro: o cadastro só é concluído quando o
            imóvel está de fato representado — cômodo por cômodo, com vídeo e
            pino ajustado no mapa. Menos ruído, mais visitas que fecham.
          </p>
        </div>
      </div>
    </section>
  );
}

function DifferentiatorsSection() {
  const items = [
    {
      icon: Camera,
      title: "Foto obrigatória por cômodo",
      text: "Slots de upload gerados dinamicamente a partir do número de cômodos declarados. Nada de anúncio com uma sala e adivinhação.",
    },
    {
      icon: Video,
      title: "Vídeo do imóvel",
      text: "Até 1 minuto para percorrer o espaço. É o mais próximo de uma visita virtual sem precisar sair de casa.",
    },
    {
      icon: Eye,
      title: "Preview ao vivo do anúncio",
      text: "Enquanto você preenche o cadastro, vê exatamente como o anúncio vai aparecer para o inquilino.",
    },
    {
      icon: MapPin,
      title: "Mapa interativo com pino ajustável",
      text: "Localização precisa, arrastada até o ponto exato do imóvel — não uma bolha genérica no bairro.",
    },
  ];
  return (
    <section className="bg-accent">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
            O que nos diferencia
          </p>
          <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
            Qualidade forçada, não sugerida.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const anunciante = [
    "Tipo do imóvel & cômodos",
    "Fotos & vídeo",
    "Endereço no mapa",
    "Preços e garantias",
    "Título & descrição",
    "Revisão e publicação",
  ];
  const inquilino = [
    "Buscar por região e filtros",
    "Ver o imóvel completo — fotos, vídeo e mapa",
    "Contatar o proprietário direto",
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
          Como funciona
        </p>
        <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
          Dois lados, um fluxo claro.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Para quem anuncia
            </h3>
          </div>
          <ol className="mt-6 space-y-3">
            {anunciante.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary-foreground">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Para quem procura
            </h3>
          </div>
          <ol className="mt-6 space-y-3">
            {inquilino.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-secondary/15 text-sm font-semibold text-secondary">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            Contato direto com o proprietário, sem intermediários.
          </div>
        </div>
      </div>

      <p className="mt-6 rounded-2xl bg-accent px-5 py-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Imóvel</strong> é a unidade física
        que o proprietário cadastra uma vez.{" "}
        <strong className="text-foreground">Anúncio</strong> é a publicação
        desse imóvel — pode ser pausada, editada e republicada sem refazer o
        cadastro.
      </p>
    </section>
  );
}

function MissionSection() {
  const cards = [
    {
      title: "Missão",
      text: "Elevar o padrão dos anúncios de locação para que proprietário e inquilino cheguem à visita já alinhados.",
    },
    {
      title: "Visão",
      text: "Ser a referência quando alguém quer alugar sem perder um sábado inteiro visitando imóvel que não bate com o anúncio.",
    },
    {
      title: "Valores",
      text: "Transparência sobre o imóvel, respeito ao tempo do usuário e um fluxo de cadastro que orienta em vez de punir.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-border bg-card p-7"
          >
            <h3 className="text-lg font-semibold text-primary">{c.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HistorySection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
      <div className="rounded-3xl bg-primary p-10 text-primary-foreground md:p-14">
        <div className="flex items-center gap-2 text-sm opacity-80">
          <ShieldCheck className="h-4 w-4" />
          História do projeto
        </div>
        <h2 className="mt-4 text-3xl font-bold md:text-4xl">
          Nasceu na academia, feito para o mundo real.
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed opacity-90 md:text-lg">
          O Aluguel360 começou como projeto acadêmico com um recorte claro:
          aplicar boas práticas de desenvolvimento, metodologias ágeis e
          design centrado no usuário em um problema concreto — a baixa
          qualidade dos anúncios de imóvel. Cada decisão de produto é
          revisitada com base em uso real, e o fluxo de cadastro é o resultado
          de várias iterações até chegar ao padrão que a plataforma exige
          hoje.
        </p>
      </div>
    </section>
  );
}

function TeamSection() {
  const team = [
    { name: "Matias Martins", role: "Product Owner" },
    { name: "Weslley Ferreira", role: "Scrum Master" },
    { name: "Gisele Gomes", role: "Desenvolvedora" },
    { name: "Isabel Nunes", role: "Desenvolvedora" },
    { name: "Francieli Pinheiro", role: "Desenvolvedora" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
          Equipe
        </p>
        <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
          Quem faz o Aluguel360.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Time pequeno, papéis definidos, ciclo ágil. Cada pessoa abaixo
          responde por uma parte específica do produto.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {team.map((m) => {
          const initials = m.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("");
          return (
            <div
              key={m.name}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-primary-foreground">
                {initials}
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {m.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-3xl bg-primary p-12 text-center text-primary-foreground md:p-16">
        <h2 className="text-3xl font-bold md:text-4xl">
          Pronto para encontrar (ou anunciar) o próximo lar?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl opacity-90">
          Comece pela busca ou publique seu imóvel seguindo o padrão que faz
          diferença na hora da visita.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-light px-6 py-3 text-sm font-semibold text-primary transition hover:opacity-90"
          >
            Explorar imóveis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-light/40"
          >
            Quero anunciar
          </Link>
        </div>
      </div>
    </section>
  );
}

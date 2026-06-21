export function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="bg-[#356F75] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Sobre o Aluguel360
          </h1>

          <p className="max-w-3xl mx-auto text-lg opacity-90">
            O Aluguel360 nasceu com o propósito de conectar
            proprietários e inquilinos de forma simples, rápida e
            segura, oferecendo uma experiência moderna na busca
            e divulgação de imóveis.
          </p>
        </div>
      </section>

      {/* APRESENTAÇÃO */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-md p-10">
          <h2 className="text-3xl font-bold text-[#356F75] mb-6">
            Quem Somos
          </h2>

          <p className="text-gray-600 leading-relaxed">
            O Aluguel360 é uma plataforma desenvolvida para facilitar
            a conexão entre proprietários e pessoas em busca de imóveis.
            Nosso objetivo é tornar o processo de busca, divulgação e
            locação mais simples, acessível e eficiente, utilizando
            tecnologia para aproximar oportunidades e pessoas.
          </p>
        </div>
      </section>

      {/* MISSÃO VISÃO VALORES */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[#356F75] mb-4">
              Nossa Missão
            </h2>

            <p className="text-gray-600">
              Facilitar o processo de locação e busca de imóveis,
              aproximando pessoas e oportunidades por meio de
              uma plataforma moderna e intuitiva.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[#356F75] mb-4">
              Nossa Visão
            </h2>

            <p className="text-gray-600">
              Ser referência em soluções digitais para aluguel
              de imóveis, oferecendo praticidade, confiança e
              inovação para nossos usuários.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[#356F75] mb-4">
              Nossos Valores
            </h2>

            <p className="text-gray-600">
              Transparência, inovação, segurança, acessibilidade,
              colaboração e foco na melhor experiência para o usuário.
            </p>
          </div>
        </div>
      </section>

      {/* HISTÓRIA */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-[#356F75] text-white rounded-3xl p-10">
          <h2 className="text-3xl font-bold mb-6">
            História do Projeto
          </h2>

          <p className="leading-relaxed opacity-90">
            O Aluguel360 surgiu como um projeto acadêmico com o objetivo
            de aplicar boas práticas de desenvolvimento de software,
            metodologias ágeis e design centrado no usuário.
            A proposta nasceu da necessidade de simplificar a forma
            como proprietários e inquilinos se conectam, oferecendo
            uma solução moderna, intuitiva e acessível para a busca
            e divulgação de imóveis.
          </p>
        </div>
      </section>

      {/* EQUIPE */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-center text-[#356F75] mb-4">
          Nossa Equipe
        </h2>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          O Aluguel360 foi desenvolvido por uma equipe comprometida
          em criar uma experiência moderna, intuitiva e acessível
          para conectar proprietários e inquilinos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <h3 className="font-semibold text-lg">
              Matias Martins
            </h3>
            <p className="text-gray-600 text-sm">
              Product Owner (PO)
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <h3 className="font-semibold text-lg">
              Gisele Gomes
            </h3>
            <p className="text-gray-600 text-sm">
              Desenvolvedora
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <h3 className="font-semibold text-lg">
              Isabel Nunes
            </h3>
            <p className="text-gray-600 text-sm">
              Desenvolvedora
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <h3 className="font-semibold text-lg">
              Francieli Pinheiro
            </h3>
            <p className="text-gray-600 text-sm">
              Desenvolvedora
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <h3 className="font-semibold text-lg">
              Weslley Ferreira
            </h3>
            <p className="text-gray-600 text-sm">
              Scrum Master
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-[#356F75] rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Encontre seu próximo lar
          </h2>

          <p className="max-w-2xl mx-auto mb-8 opacity-90">
            Estamos aqui para conectar pessoas aos imóveis ideais
            de forma rápida, segura e eficiente.
          </p>

          <button className="bg-[#58D4D2] hover:opacity-90 px-8 py-3 rounded-xl font-semibold transition">
            Explorar Imóveis
          </button>
        </div>
      </section>
    </div>
  );
}
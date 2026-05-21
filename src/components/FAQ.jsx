import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const faqs = [
  {
    q: 'A instalação pode danificar meu telhado ou causar goteiras?',
    a: 'Não. Todos os nossos projetos seguem um protocolo rigoroso de impermeabilização e fixação estrutural. Utilizamos suportes certificados com vedação de alta durabilidade, e nossa equipe técnica — formada com padrão aeronáutico — inspeciona cada ponto de fixação. Você receberá um laudo técnico garantindo a integridade do telhado.',
  },
  {
    q: 'Em quanto tempo o sistema se paga (Payback)?',
    a: 'Para residências, o payback médio fica entre 3 e 5 anos. Para empresas e produtores rurais com alto consumo, esse prazo pode ser ainda menor. Após o payback, você gerou economia pura por mais de 20 anos — a vida útil dos painéis.',
  },
  {
    q: 'A BS POWER resolve a burocracia com a concessionária de energia?',
    a: 'Sim, completamente. Cuidamos de todo o processo de homologação junto à concessionária local, desde o protocolo do projeto até a vistoria e liberação do medidor bidirecional. Você não precisa se preocupar com nenhum trâmite técnico ou burocrático.',
  },
  {
    q: 'Vocês oferecem linhas de financiamento?',
    a: 'Sim. Trabalhamos com as principais linhas de crédito disponíveis no mercado, incluindo financiamentos via Banco do Brasil, Sicoob e outras instituições parceiras com taxas favoráveis para energia solar. Podemos orientar você sobre a melhor opção para o seu perfil financeiro.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="faq-section">
      <div className="container">
        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="k">Dúvidas frequentes</div>
          <h2>Tudo que você precisa saber antes de decidir.</h2>
        </motion.div>

        <div className="faq-list">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={item.q}
                className={`faq-item${isOpen ? ' faq-item--open' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
              >
                <button
                  className="faq-trigger"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-body"
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

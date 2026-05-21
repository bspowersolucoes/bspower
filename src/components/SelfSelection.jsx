import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const WA_RESIDENCIA = 'https://wa.me/5577999999999?text=Ol%C3%A1%2C%20gostaria%20de%20um%20estudo%20solar%20para%20minha%20resid%C3%AAncia'
const WA_NEGOCIO = 'https://wa.me/5577999999999?text=Ol%C3%A1%2C%20sou%20empres%C3%A1rio%2Fprodutor%20rural%20e%20quero%20um%20estudo%20de%20viabilidade'

const cards = [
  {
    icon: '🏠',
    title: 'Para sua Casa',
    items: [
      { icon: '💡', text: 'Fim dos sustos na conta de luz: Transforme sua fatura em uma taxa mínima previsível.' },
      { icon: '🛡️', text: 'Segurança absoluta para o seu lar: Equipamentos de ponta e instalação impecável sem goteiras.' },
      { icon: '📈', text: 'Valorização imediata do imóvel: Sua casa passa a valer mais no mercado instantaneamente.' },
    ],
    cta: 'Simular para minha Casa',
    href: WA_RESIDENCIA,
  },
  {
    icon: '🏭',
    title: 'Para sua Empresa / Fazenda',
    items: [
      { icon: '💰', text: 'Payback Acelerado e Comprovado: Dimensionamento focado estritamente na rentabilidade do seu negócio.' },
      { icon: '🔒', text: 'Blindagem de Caixa (Hedge): Imunidade contra a inflação do setor elétrico.' },
      { icon: '⚙️', text: 'Operação Zero Risco: Projetos compatibilizados com seu padrão de entrada, garantindo integridade dos maquinários.' },
    ],
    cta: 'Simular para meu Negócio',
    href: WA_NEGOCIO,
  },
]

export default function SelfSelection() {
  return (
    <section className="self-selection">
      <div className="container">
        <motion.div
          className="self-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="k">Escolha o seu perfil</div>
          <h2>Qual é o seu objetivo?</h2>
        </motion.div>

        <div className="self-cards">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className="self-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.12 }}
            >
              <div className="self-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <ul className="self-list">
                {card.items.map((item) => (
                  <li key={item.text}>
                    <span className="self-item-icon">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <a className="btn primary self-btn" href={card.href} target="_blank" rel="noreferrer">
                {card.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

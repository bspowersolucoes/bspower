import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const miniItems = [
  { label: 'Engenharia', sub: 'Critério técnico' },
  { label: 'Suporte', sub: 'Atendimento consultivo' },
  { label: 'Segurança', sub: 'Boas práticas' },
  { label: 'Economia', sub: 'Retorno financeiro' },
]

export default function About() {
  return (
    <section id="quem-somos" className="section-alt">
      <div className="container about">
        <motion.div
          className="panel"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="k">Quem somos</div>
          <h2 style={{ color: '#1d4ed8', fontSize: 'clamp(22px, 2.8vw, 34px)', lineHeight: 1.15 }}>
            A Experiência por Trás<br />da Engenharia
          </h2>
          <p style={{ textAlign: 'justify' }}>
            A BS POWER é liderada por <strong>Fábio Brasil Foly</strong>, cuja trajetória
            de quase três décadas na Força Aérea Brasileira moldou um padrão de excelência
            inegociável. Com formação pela{' '}
            <em>Escola de Especialistas de Aeronáutica (EEAR)</em> e em fase de conclusão
            de <em>Engenharia Elétrica (UFOB)</em>, Fábio aplica o rigor técnico de sistemas
            de <strong>RADARES e Satélites</strong> em cada projeto solar.
          </p>
        </motion.div>

        <motion.div
          className="panel"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          <h2 style={{ color: '#dc2626' }}>Mais que painéis solares!</h2>
          <p>
            Um sistema fotovoltaico bem feito precisa considerar telhado, orientação,
            sombreamento, corrente, tensão, proteção, padrão de entrada e regras da
            concessionária.
          </p>
          <div className="mini-grid">
            {miniItems.map((item, i) => (
              <motion.div
                className="mini"
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.08 }}
              >
                <strong>{item.label}</strong>
                <span>{item.sub}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

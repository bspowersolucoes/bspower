import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const services = [
  {
    icon: '☀',
    title: 'Projeto fotovoltaico',
    desc: 'Dimensionamento do sistema, análise de consumo, escolha de equipamentos e compatibilização com a rede elétrica.',
  },
  {
    icon: '🛡',
    title: 'Proteção e segurança',
    desc: 'Atenção a cabos, disjuntores, DPS, string box, aterramento e boas práticas de instalação elétrica.',
  },
  {
    icon: '📈',
    title: 'Viabilidade econômica',
    desc: 'Estimativa de geração, economia mensal, retorno do investimento e impacto na conta de energia.',
  },
]

export default function Services() {
  return (
    <section id="servicos">
      <div className="container">
        <motion.div
          className="head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
        >
          <div>
            <div className="k">Soluções</div>
            <h2>Energia solar do estudo à instalação.</h2>
          </div>
          <p>
            Atuação completa para transformar consumo de energia em economia,
            previsibilidade e valorização do imóvel.
          </p>
        </motion.div>

        <div className="cards">
          {services.map((s, i) => (
            <motion.article
              className="card"
              key={s.title}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.12 }}
            >
              <div className="ico">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

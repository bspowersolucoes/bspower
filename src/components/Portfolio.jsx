import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const projects = [
  {
    img: '/portfolio-1.jpeg',
    alt: 'Projeto solar',
    label: 'Usina solar · Bom Jesus da Lapa',
    title: 'Sistema em telhado metálico',
    desc: 'Projeto com foco em economia mensal e rentabilidade para o Hotel Imperial.',
  },
  {
    img: '/portfolio-2.jpeg',
    alt: 'Instalação solar',
    label: 'Escola',
    title: 'Energia Sustentável',
    desc: 'Redução de custos, sustentabilidade e conforto térmico para toda a comunidade.',
  },
  {
    img: '/portfolio-3.jpeg',
    alt: 'Usina solar',
    label: 'Empreendimento',
    title: 'Otimização da Operação',
    desc: 'Solução para consumo local e remoto, otimizando a operação do cliente.',
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container">
        <motion.div
          className="head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
        >
          <div>
            <div className="k">Portfólio</div>
            <h2>Projetos em destaque</h2>
          </div>
          <p>
            Instalações reais, dimensionamento preciso e resultados mensuráveis
            em cada obra entregue.
          </p>
        </motion.div>

        <div className="portfolio-canvas">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              className="portfolio-card"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.22 } }}
            >
              <img src={p.img} alt={p.alt} />
              <div className="portfolio-card-body">
                <small>{p.label}</small>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

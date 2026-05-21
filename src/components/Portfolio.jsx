import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const projects = [
  {
    img: '/portfolio-1.jpeg',
    alt: 'Projeto solar',
    label: 'Usina solar · Bom Jesus da Lapa',
    title: 'Sistema em telhado metálico',
    desc: 'Projeto com foco em economia mensal e rentabilidade para o Hotel Imperial.',
    // foreground — moves fastest, slight left drift
    speedY: -220,
    speedX: -18,
    offsetTop: 0,
  },
  {
    img: '/portfolio-2.jpeg',
    alt: 'Instalação solar',
    label: 'Escola',
    title: 'Energia Sustentável',
    desc: 'Redução de custos, sustentabilidade e conforto térmico para toda a comunidade.',
    // midground
    speedY: -120,
    speedX: 14,
    offsetTop: 80,
  },
  {
    img: '/portfolio-3.jpeg',
    alt: 'Usina solar',
    label: 'Empreendimento',
    title: 'Otimização da Operação',
    desc: 'Solução para consumo local e remoto, otimizando a operação do cliente.',
    // background — slowest
    speedY: -55,
    speedX: -8,
    offsetTop: 40,
  },
]

function ParallaxCard({ project, index }) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [0, project.speedY])
  const rawX = useTransform(scrollYProgress, [0, 1], [0, project.speedX])

  const y = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.8 })
  const x = useSpring(rawX, { stiffness: 80, damping: 20, mass: 0.8 })

  return (
    // Outer div: ref + parallax motion
    <motion.div ref={ref} style={{ y, x, marginTop: project.offsetTop }}>
      {/* Inner div: entrance animation */}
      <motion.article
        className="portfolio-card"
        initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease, delay: index * 0.15 }}
        whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.25 } }}
      >
        <img src={project.img} alt={project.alt} />
        <div className="portfolio-card-body">
          <small>{project.label}</small>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
        </div>
      </motion.article>
    </motion.div>
  )
}

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
            <h2>Projetos em destaque.</h2>
          </div>
          <p>
            Instalações reais, dimensionamento preciso e resultados mensuráveis
            em cada obra entregue.
          </p>
        </motion.div>

        <div className="portfolio-canvas">
          {projects.map((p, i) => (
            <ParallaxCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

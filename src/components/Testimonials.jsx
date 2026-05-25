import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const testimonials = [
  {
    name: 'João Silva',
    company: 'Residência Particular',
    tag: 'Residencial',
    text: 'A equipe da BS POWER entregou exatamente o que prometeu. Rigor técnico, instalação impecável e economia visível já na primeira fatura.',
  },
  {
    name: 'Maria Oliveira',
    company: 'Residência Particular',
    tag: 'Residencial',
    text: 'Processo muito transparente do início ao fim. Desde o estudo de viabilidade até a ativação do sistema, fui informada em cada etapa.',
  },
  {
    name: 'Empresa XYZ',
    company: 'Comércio Local',
    tag: 'Comercial',
    text: 'Reduzimos nossa conta de energia em mais de 80%. A BS POWER dimensionou o sistema perfeitamente para nossa demanda operacional.',
  },
]

function Stars() {
  return (
    <div className="testimonial-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ffc533" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="section-alt" id="depoimentos">
      <div className="container">
        <motion.div
          className="head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
        >
          <div>
            <div className="k">Depoimentos</div>
            <h2>O que nossos clientes dizem</h2>
          </div>
          <p>Resultados reais, clientes satisfeitos e projetos que falam por si.</p>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="testimonial-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.12 }}
            >
              <Stars />
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-footer">
                <div>
                  <strong>{t.name}</strong>
                  <span className="testimonial-company">{t.company}</span>
                </div>
                <span className={`testimonial-tag${t.tag === 'Comercial' ? ' testimonial-tag--comercial' : ''}`}>
                  {t.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]
const WA_BILL = 'https://wa.me/5577999999999?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20quero%20enviar%20minha%20conta%20de%20luz%20para%20receber%20um%20projeto%20solar!'

export default function CtaSection() {
  return (
    <section>
      <div className="container">
        <motion.div
          className="cta-box"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
        >
          <div>
            <h2>Quer saber exatamente quanto você vai economizar?</h2>
            <p className="lead">
              Mande uma foto da sua conta de luz e nós fazemos toda a matemática por você.
              Entregaremos um estudo de viabilidade sem compromisso.
            </p>
          </div>
          <a className="btn primary" href={WA_BILL} target="_blank" rel="noreferrer">
            💬 Enviar foto da conta de luz
          </a>
        </motion.div>
      </div>
    </section>
  )
}

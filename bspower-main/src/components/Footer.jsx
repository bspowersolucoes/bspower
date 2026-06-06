import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="container foot">
        <div>
          <img src="/logo-footer.jpeg" alt="BS POWER" />
          <p>
            BS POWER — Sua Energia, nosso compromisso.<br />
            Energia solar fotovoltaica em Bom Jesus da Lapa e região.
          </p>
        </div>
        <div>
          <p><b>Contato</b></p>
          <p>
            <a href="#calculadora">Calculadora solar</a><br />
            <a href="#servicos">Serviços</a><br />
            <a href="https://wa.me/5577999999999" target="_blank" rel="noreferrer">
              WhatsApp comercial
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

const WA_ANALYSIS = 'https://wa.me/5577999999999?text=Ol%C3%A1%2C%20quero%20enviar%20minha%20conta%20de%20energia%20para%20an%C3%A1lise%20gratuita'

const ease = [0.22, 1, 0.36, 1]

function CountUp({ end, suffix, duration = 1.5 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const startTime = performance.now()
    let frame
    const tick = (now) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setCount(end)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="grid">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            <motion.div
              className="badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
            >
              <Zap size={13} /> Engenharia solar em Bom Jesus da Lapa
            </motion.div>
            <h1>
              Reduza até 95% da sua conta de luz
            </h1>
            <h3 className='subheadline'>Engenharia Solar de Alta Precisão.</h3>
            <p>
              Da sua casa à sua empresa, a BS POWER aplica o rigor técnico da aeronáutica
              para entregar sistemas solares ultrasseguros, eficientes e à prova de surpresas.
              A sua energia é o nosso compromisso.
            </p>
            <motion.div
              className="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.25 }}
            >
              <a className="btn primary" href={WA_ANALYSIS} target="_blank" rel="noreferrer">
                Enviar minha conta para análise gratuita
              </a>
              <a className="btn secondary" href="#calculadora">
                Ver calculadora solar
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-img"
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.15 }}
          >
            <img src="/hero.jpeg" alt="Sistema solar BS POWER" />
          </motion.div>
        </div>

        <motion.div
          className="stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
        >
          {[
            { end: 30,  suffix: '+', label: 'Anos de experiência técnica' },
            { end: 150, suffix: '+', label: 'kWp instalados' },
            { end: 4,   suffix: '+', label: 'Projetos de alto porte' },
            { end: 100, suffix: '%', label: 'Foco no cliente' },
          ].map((s) => (
            <div className="stat" key={s.label}>
              <strong><CountUp end={s.end} suffix={s.suffix} /></strong>
              <span>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

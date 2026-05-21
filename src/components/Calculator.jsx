import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const CONSUMO = { min: 50, max: 3000, step: 10, default: 800 }
const TARIFA  = { min: 0.5, max: 2.0,  step: 0.01, default: 0.95 }

function brl(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function pct(value, min, max) {
  return ((value - min) / (max - min)) * 100
}

function Slider({ label, value, min, max, step, unit, display, onChange }) {
  const progress = pct(value, min, max)
  return (
    <div className="slider-group">
      <div className="slider-header">
        <label>{label}</label>
        <span className="slider-value">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--yellow) 0%, var(--yellow) ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
        }}
      />
      <div className="slider-range">
        <span>{unit === 'kwh' ? `${min} kWh` : `R$ ${min.toFixed(2)}`}</span>
        <span>{unit === 'kwh' ? `${max} kWh` : `R$ ${max.toFixed(2)}`}</span>
      </div>
    </div>
  )
}

export default function Calculator() {
  const [consumo, setConsumo] = useState(CONSUMO.default)
  const [tarifa,  setTarifa]  = useState(TARIFA.default)
  const [result,  setResult]  = useState({})

  useEffect(() => {
    const c = Math.max(0, consumo)
    const t = Math.max(0, tarifa)
    setResult({
      kwp:     (c / 120).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' kWp',
      economia: brl(c * t),
      geracao:  c.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' kWh',
      area:     (c / 120 * 5).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' m²',
    })
  }, [consumo, tarifa])

  return (
    <section id="calculadora">
      <div className="container calc">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="k">Calculadora solar</div>
          <h2>Faça uma estimativa rápida.</h2>
          <p className="lead">
            Mova os controles para ajustar o consumo e a tarifa. O resultado é uma
            estimativa inicial; o projeto final depende de análise técnica.
          </p>
        </motion.div>

        <motion.div
          className="panel calc-form"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          <Slider
            label="Consumo médio mensal"
            value={consumo}
            min={CONSUMO.min}
            max={CONSUMO.max}
            step={CONSUMO.step}
            unit="kwh"
            display={`${consumo.toLocaleString('pt-BR')} kWh`}
            onChange={setConsumo}
          />
          <Slider
            label="Tarifa aproximada"
            value={tarifa}
            min={TARIFA.min}
            max={TARIFA.max}
            step={TARIFA.step}
            unit="brl"
            display={`R$ ${tarifa.toFixed(2)}/kWh`}
            onChange={setTarifa}
          />

          <div className="result">
            {[
              { label: 'Sistema estimado', value: result.kwp },
              { label: 'Economia mensal',  value: result.economia },
              { label: 'Geração mensal',   value: result.geracao },
              { label: 'Área aproximada',  value: result.area },
            ].map((r) => (
              <div key={r.label}>
                <span>{r.label}</span>
                <strong>{r.value}</strong>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

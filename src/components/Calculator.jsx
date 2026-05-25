import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Chart, registerables } from 'chart.js'
import { MapPin, Zap, SlidersHorizontal, BarChart2, Sun, AlertTriangle } from 'lucide-react'
import ESTADOS from '../data/estados.json'
import MUNICIPIOS from '../data/municipios.json'
import IRRADIACAO_BA from '../data/irradiacao_bahia.json'

Chart.register(...registerables)

const ease = [0.22, 1, 0.36, 1]

const TAXA_MINIMA = { mono: 30, bi: 50, tri: 100, ignorar: 0 }
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const DIAS_POR_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const NOMES_FASE = { mono: 'Monofásico', bi: 'Bifásico', tri: 'Trifásico', ignorar: 'Ignorada' }

// ── Sizing logic — ported from solarcalc/js/sizing.js ────────────────────────
function calcularDimensionamento({ geracaoDesejadaKwhMes, potenciaModuloW, irradiacaoMediaDiaria, diasMes, perdasPercent, margemPercent, tipoLigacao }) {
  if (geracaoDesejadaKwhMes <= 0) throw new Error('A geração desejada deve ser maior que zero.')
  if (potenciaModuloW <= 0)        throw new Error('A potência do módulo deve ser maior que zero.')
  if (irradiacaoMediaDiaria <= 0) throw new Error('A irradiação média diária deve ser maior que zero.')
  if (diasMes <= 0)               throw new Error('Os dias do mês devem ser maior que zero.')

  const taxa              = TAXA_MINIMA[tipoLigacao] ?? 0
  const geracaoAjustada   = Math.max(geracaoDesejadaKwhMes - taxa, 1)
  const potenciaModuloKw  = potenciaModuloW / 1000
  const fatorPerdas       = 1 - perdasPercent / 100
  const potNecessariaKwp  = geracaoAjustada / (irradiacaoMediaDiaria * diasMes * fatorPerdas)
  const qtdBase           = Math.ceil(potNecessariaKwp / potenciaModuloKw)
  const qtdComMargem      = Math.ceil(qtdBase * (1 + margemPercent / 100))
  const potenciaTotalKwp  = qtdComMargem * potenciaModuloKw
  const geracaoEstimada   = potenciaTotalKwp * irradiacaoMediaDiaria * diasMes * fatorPerdas

  return {
    quantidadeModulos:     qtdComMargem,
    potenciaTotalKwp:      parseFloat(potenciaTotalKwp.toFixed(2)),
    geracaoEstimadaKwhMes: parseFloat(geracaoEstimada.toFixed(2)),
    geracaoEstimadaKwhAno: parseFloat((geracaoEstimada * 12).toFixed(2)),
    geracaoAjustada,
    taxaDescontada:        taxa,
    margemAplicadaPercent: margemPercent,
    perdasPercent,
  }
}

// ── PVGIS fetch — ported from solarcalc/js/pvgis.js ──────────────────────────
async function fetchIrradiation(lat, lon) {
  const params    = new URLSearchParams({ lat, lon, peakpower: 1, loss: 0, outputformat: 'json' })
  const targetUrl = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?${params}`
  const proxyUrl  = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
  const res = await fetch(proxyUrl)
  if (!res.ok) throw new Error(`PVGIS HTTP ${res.status}`)
  const data = await res.json()
  const monthly = data.outputs.monthly.fixed
  const irrs = monthly.map(m => m['H(i)_d']).filter(v => v != null)
  if (!irrs.length) throw new Error('Dados de irradiação não encontrados na resposta PVGIS.')
  const media = irrs.reduce((a, b) => a + b, 0) / irrs.length
  return { irradiacaoMediaDiaria: parseFloat(media.toFixed(3)), mensal: irrs, fonte: 'pvgis' }
}

// ── Autocomplete ──────────────────────────────────────────────────────────────
function Autocomplete({ placeholder, disabled, items, onSelect }) {
  const [query,     setQuery]     = useState('')
  const [open,      setOpen]      = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const wrapRef = useRef(null)

  const filtered = query.trim()
    ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())).slice(0, 80)
    : items.slice(0, 80)

  useEffect(() => {
    function onOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  function pick(item) {
    setQuery(item.label)
    setOpen(false)
    setActiveIdx(-1)
    onSelect(item)
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown')                    { setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); e.preventDefault() }
    else if (e.key === 'ArrowUp')                 { setActiveIdx(i => Math.max(i - 1, 0)); e.preventDefault() }
    else if (e.key === 'Enter' && activeIdx >= 0) pick(filtered[activeIdx])
    else if (e.key === 'Escape')                  setOpen(false)
  }

  return (
    <div className="calc-autocomplete-wrap" ref={wrapRef}>
      <input
        className="calc-input"
        value={query}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {open && filtered.length > 0 && (
        <div className="calc-dropdown">
          {filtered.map((item, i) => (
            <div
              key={item.label}
              className={`calc-dropdown-item${i === activeIdx ? ' active' : ''}`}
              onMouseDown={() => pick(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Irradiation chart — ported from solarcalc/js/chart-irr.js ────────────────
function IrradiationChart({ mensal, media }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: MESES,
        datasets: [{
          data:            mensal,
          backgroundColor: mensal.map(v => v >= media ? 'rgba(255,197,51,0.85)' : 'rgba(255,197,51,0.3)'),
          borderColor:     mensal.map(v => v >= media ? '#ffc533'               : 'rgba(255,197,51,0.5)'),
          borderWidth: 1,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${Number(ctx.raw).toFixed(2)} kWh/m²/dia` } },
        },
        scales: {
          y: {
            title: { display: true, text: 'kWh/m²/dia', color: '#6b7280' },
            grid: { color: 'rgba(0,0,0,0.06)' },
          },
          x: { grid: { display: false } },
        },
      },
    })

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null } }
  }, [mensal, media])

  return (
    <div style={{ height: 200, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

// ── Monthly generation chart ──────────────────────────────────────────────────
function GenerationChart({ potenciaTotalKwp, irradiacaoMensal, perdasPercent, geracaoPretendida }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const fatorPerdas   = 1 - perdasPercent / 100
    const geracaoMensal = irradiacaoMensal.map((irrDia, idx) =>
      Math.round(potenciaTotalKwp * irrDia * DIAS_POR_MES[idx] * fatorPerdas)
    )

    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: MESES,
        datasets: [
          {
            label: 'Geração Estimada (kWh)',
            data: geracaoMensal,
            backgroundColor: 'rgba(255, 197, 51, 0.8)',
            borderColor: '#ffc533',
            borderWidth: 2,
            borderRadius: 6,
            order: 2,
          },
          {
            label: 'Consumo Pretendido',
            data: Array(12).fill(Math.round(geracaoPretendida)),
            type: 'line',
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [6, 3],
            pointRadius: 0,
            tension: 0,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { color: '#6b7280', usePointStyle: true, padding: 16 },
          },
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw} kWh` } },
        },
        scales: {
          y: {
            title: { display: true, text: 'kWh/mês', color: '#6b7280' },
            grid: { color: 'rgba(0,0,0,0.06)' },
          },
          x: { grid: { display: false } },
        },
      },
    })

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null } }
  }, [potenciaTotalKwp, irradiacaoMensal, perdasPercent, geracaoPretendida])

  return (
    <div style={{ height: 300, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Calculator() {
  const [estado,     setEstado]     = useState(null)
  const [cidade,     setCidade]     = useState(null)
  const [irr,        setIrr]        = useState(null)
  const [irrLoading, setIrrLoading] = useState(false)
  const [irrError,   setIrrError]   = useState(null)

  const [fase,      setFase]      = useState(null)
  const [geracao,   setGeracao]   = useState('')
  const [potModulo, setPotModulo] = useState('545')
  const [perdas,    setPerdas]    = useState('20')
  const [margem,    setMargem]    = useState('5')
  const [dias,      setDias]      = useState('30')

  const [result,    setResult]    = useState(null)
  const [calcError, setCalcError] = useState(null)
  const resultRef = useRef(null)

  const estadoItems = ESTADOS.map(e => ({ label: `${e.estado} (${e.uf})`, data: e }))
  const cidadeItems = estado ? (MUNICIPIOS[estado.uf] || []).map(c => ({ label: c.nome, data: c })) : []

  function handleEstadoSelect(item) {
    setEstado(item.data)
    setCidade(null)
    setIrr(null)
    setIrrError(null)
    setResult(null)
    setCalcError(null)
  }

  async function handleCidadeSelect(item) {
    setCidade(item.data)
    setIrr(null)
    setIrrError(null)
    setResult(null)
    setCalcError(null)
    setIrrLoading(true)

    // Offline Bahia data (priority, ported from app.js)
    if (estado.uf === 'BA' && IRRADIACAO_BA[item.data.nome]) {
      const d = IRRADIACAO_BA[item.data.nome]
      setIrr({ irradiacaoMediaDiaria: d.irradiacaoMediaDiaria, mensal: d.mensal, fonte: 'offline' })
      setIrrLoading(false)
      return
    }

    // PVGIS fallback for other states
    try {
      const data = await fetchIrradiation(item.data.lat, item.data.lon)
      setIrr(data)
    } catch (err) {
      setIrrError('Não foi possível buscar dados de irradiação. Verifique sua conexão.')
    } finally {
      setIrrLoading(false)
    }
  }

  function calcular() {
    setCalcError(null)
    setResult(null)

    if (!estado || !cidade)  return setCalcError('Selecione o estado e o município.')
    if (!irr)                return setCalcError('Aguarde o carregamento dos dados de irradiação.')
    if (!fase)               return setCalcError('Selecione o tipo de ligação.')

    const geracaoNum = parseFloat(geracao)
    const potNum     = parseFloat(potModulo)
    const perdasNum  = parseFloat(perdas)
    const margemNum  = parseFloat(margem)
    const diasNum    = parseInt(dias)

    if (!geracaoNum || geracaoNum <= 0)                    return setCalcError('Informe a geração pretendida em kWh/mês.')
    if (!potNum || potNum <= 0)                            return setCalcError('Informe a potência do módulo em Wp.')
    if (isNaN(perdasNum) || perdasNum < 0 || perdasNum >= 100) return setCalcError('Perdas inválidas — informe um valor entre 0 e 99%.')
    if (isNaN(margemNum) || margemNum < 0 || margemNum >= 100) return setCalcError('Margem inválida — informe um valor entre 0 e 99%.')
    if (!diasNum || diasNum <= 0 || diasNum > 31)          return setCalcError('Dias do mês inválidos — informe um valor entre 1 e 31.')

    try {
      const r = calcularDimensionamento({
        geracaoDesejadaKwhMes: geracaoNum,
        potenciaModuloW:       potNum,
        irradiacaoMediaDiaria: irr.irradiacaoMediaDiaria,
        diasMes:               diasNum,
        perdasPercent:         perdasNum,
        margemPercent:         margemNum,
        tipoLigacao:           fase,
      })
      setResult(r)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } catch (err) {
      setCalcError(err.message)
    }
  }

  const faseBtns = [
    { key: 'mono',    label: 'Monofásico',   sub: 'Taxa mín. 30 kWh' },
    { key: 'bi',      label: 'Bifásico',     sub: 'Taxa mín. 50 kWh' },
    { key: 'tri',     label: 'Trifásico',    sub: 'Taxa mín. 100 kWh' },
    { key: 'ignorar', label: 'Ignorar taxa', sub: '100% da geração' },
  ]

  return (
    <section id="calculadora">
      <div className="container">
        <motion.div
          className="head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
        >
          <div>
            <div className="k">Calculadora solar</div>
            <h2>Dimensione seu sistema <br/> FV</h2>
          </div>
          <p>
            Informe sua localização, consumo pretendido e os parâmetros técnicos para obter um
            dimensionamento preciso com dados reais de irradiação solar.
          </p>
        </motion.div>

        <motion.div
          className="panel calc-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          {/* ── 1. Localização ── */}
          <div className="calc-section">
            <p className="calc-section-label"><MapPin size={15} /> Localização</p>
            <div className="calc-row">
              <div className="calc-field">
                <label>Estado</label>
                <Autocomplete
                  placeholder="Digite ou selecione o estado..."
                  disabled={false}
                  items={estadoItems}
                  onSelect={handleEstadoSelect}
                />
              </div>
              <div className="calc-field">
                <label>Município</label>
                <Autocomplete
                  key={estado ? estado.uf : '__none__'}
                  placeholder={estado ? 'Digite o município...' : 'Selecione um estado primeiro...'}
                  disabled={!estado}
                  items={cidadeItems}
                  onSelect={handleCidadeSelect}
                />
              </div>
            </div>
            {irrLoading && (
              <div className="calc-irr-status loading">
                <span className="calc-spinner" /> Buscando dados de irradiação via PVGIS...
              </div>
            )}
            {irrError && <div className="calc-irr-status error"><AlertTriangle size={15} /> {irrError}</div>}
            {irr && (
              <>
                <div className="calc-irr-status ok">
                  <Sun size={15} /> Dados de irradiação carregados para <strong>{cidade?.nome}</strong>
                  <span className={`calc-fonte-badge${irr.fonte === 'pvgis' ? ' pvgis' : ''}`}>
                    {irr.fonte === 'offline' ? 'dados locais BA' : 'PVGIS'}
                  </span>
                </div>
                {irr.mensal?.length === 12 && (
                  <div className="calc-irr-chart-card">
                    <div className="calc-irr-chart-header">
                      <div>
                        <strong className="calc-irr-city">{cidade?.nome}, {estado?.uf}</strong>
                        <span className="calc-irr-coords">
                          Lat: {cidade?.lat?.toFixed(4)} | Lon: {cidade?.lon?.toFixed(4)}
                        </span>
                      </div>
                      <div className="calc-irr-avg">
                        <span className="calc-irr-avg-val">{irr.irradiacaoMediaDiaria.toFixed(2)}</span>
                        <span className="calc-irr-avg-label">kWh/m²/dia (média anual)</span>
                      </div>
                    </div>
                    <IrradiationChart mensal={irr.mensal} media={irr.irradiacaoMediaDiaria} />
                    <p className="calc-irr-chart-note">
                      Barras escuras = meses com irradiação acima da média anual
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── 2. Tipo de ligação ── */}
          <div className="calc-section">
            <p className="calc-section-label"><Zap size={15} /> Tipo de Ligação</p>
            <div className="calc-fase-grid">
              {faseBtns.map(b => (
                <button
                  key={b.key}
                  className={`calc-fase-btn${fase === b.key ? ' selected' : ''}`}
                  onClick={() => setFase(b.key)}
                >
                  <span className="calc-fase-label">{b.label}</span>
                  <span className="calc-fase-sub">{b.sub}</span>
                </button>
              ))}
            </div>
            {fase && fase !== 'ignorar' && (
              <p className="calc-taxa-info">
                Taxa mínima de <strong>{TAXA_MINIMA[fase]} kWh</strong> ({NOMES_FASE[fase]}) será descontada da geração pretendida.
              </p>
            )}
          </div>

          {/* ── 3. Parâmetros ── */}
          <div className="calc-section">
            <p className="calc-section-label"><SlidersHorizontal size={15} /> Parâmetros de Cálculo</p>
            <div className="calc-row">
              <div className="calc-field">
                <label htmlFor="c-geracao">Geração pretendida</label>
                <div className="calc-input-unit-wrap">
                  <input id="c-geracao" type="number" className="calc-input" placeholder="Ex: 500" min="1" value={geracao} onChange={e => setGeracao(e.target.value)} />
                  <span>kWh/mês</span>
                </div>
              </div>
              <div className="calc-field">
                <label htmlFor="c-potmodulo">Potência do módulo</label>
                <div className="calc-input-unit-wrap">
                  <input id="c-potmodulo" type="number" className="calc-input" placeholder="Ex: 545" min="1" value={potModulo} onChange={e => setPotModulo(e.target.value)} />
                  <span>Wp</span>
                </div>
              </div>
            </div>
            <div className="calc-row">
              <div className="calc-field">
                <label htmlFor="c-perdas">Perdas do sistema</label>
                <div className="calc-input-unit-wrap">
                  <input id="c-perdas" type="number" className="calc-input" placeholder="Ex: 20" min="0" max="99" value={perdas} onChange={e => setPerdas(e.target.value)} />
                  <span>%</span>
                </div>
              </div>
              <div className="calc-field">
                <label htmlFor="c-margem">Margem de segurança</label>
                <div className="calc-input-unit-wrap">
                  <input id="c-margem" type="number" className="calc-input" placeholder="Ex: 5" min="0" max="99" value={margem} onChange={e => setMargem(e.target.value)} />
                  <span>%</span>
                </div>
              </div>
            </div>
            <div className="calc-row half">
              <div className="calc-field">
                <label htmlFor="c-dias">Dias do mês de referência</label>
                <div className="calc-input-unit-wrap">
                  <input id="c-dias" type="number" className="calc-input" placeholder="Ex: 30" min="1" max="31" value={dias} onChange={e => setDias(e.target.value)} />
                  <span>dias</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Calculate ── */}
          <div className="calc-section" style={{ borderBottom: 'none' }}>
            <button className="btn primary calc-btn-full" onClick={calcular}>
              Calcular Dimensionamento
            </button>
            {calcError && <p className="calc-error">{calcError}</p>}
          </div>
        </motion.div>

        {/* ── Results ── */}
        {result && (
          <motion.div
            ref={resultRef}
            className="calc-results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="calc-section-label" style={{ marginBottom: 20 }}>Resultado do Dimensionamento</p>

            <div className="calc-result-grid">
              {[
                { label: 'Módulos necessários', value: result.quantidadeModulos,                  unit: 'un',      hi: true  },
                { label: 'Potência total',       value: result.potenciaTotalKwp.toFixed(2),        unit: 'kWp',     hi: true  },
                { label: 'Geração estimada',     value: Math.round(result.geracaoEstimadaKwhMes),  unit: 'kWh/mês', hi: false },
                { label: 'Geração anual est.',   value: Math.round(result.geracaoEstimadaKwhAno),  unit: 'kWh/ano', hi: false },
              ].map(r => (
                <div key={r.label} className={`calc-result-card${r.hi ? ' highlight' : ''}`}>
                  <span className="calc-result-label">{r.label}</span>
                  <strong className="calc-result-value">
                    {r.value}<span className="calc-result-unit">{r.unit}</span>
                  </strong>
                </div>
              ))}
            </div>

            <div className="panel calc-detail">
              {[
                ['Geração pretendida',           `${parseFloat(geracao)} kWh/mês`],
                ['Taxa mínima descontada',        result.taxaDescontada > 0 ? `${result.taxaDescontada} kWh (${NOMES_FASE[fase]})` : 'Não considerada'],
                ['Geração projetada (ajustada)',  `${result.geracaoAjustada} kWh/mês`],
                ['Irradiação média diária',       `${irr.irradiacaoMediaDiaria.toFixed(3)} kWh/m²/dia`],
                ['Perdas consideradas',           `${result.perdasPercent}%`],
                ['Margem de segurança',           `${result.margemAplicadaPercent}%`],
                ['Potência do módulo',            `${potModulo} Wp`],
              ].map(([lbl, val]) => (
                <div key={lbl} className="calc-detail-row">
                  <span>{lbl}</span>
                  <strong>{val}</strong>
                </div>
              ))}
            </div>

            {irr.mensal?.length === 12 && (
              <div className="panel" style={{ marginTop: 20 }}>
                <p className="calc-section-label" style={{ marginBottom: 16 }}><BarChart2 size={15} /> Geração Estimada por Mês (kWh)</p>
                <GenerationChart
                  potenciaTotalKwp={result.potenciaTotalKwp}
                  irradiacaoMensal={irr.mensal}
                  perdasPercent={result.perdasPercent}
                  geracaoPretendida={parseFloat(geracao)}
                />
                <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
                  Barras amarelas = geração estimada · <span style={{ color: '#ef4444' }}>linha vermelha tracejada</span> = consumo pretendido
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}

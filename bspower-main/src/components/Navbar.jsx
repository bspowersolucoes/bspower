import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const WA = 'https://wa.me/5577999999999?text=Ol%C3%A1%2C%20quero%20um%20estudo%20de%20viabilidade%20solar'

const NAV_LINKS = [
  { href: '#servicos',    label: 'Serviços'    },
  { href: '#quem-somos', label: 'Quem somos'  },
  { href: '#calculadora', label: 'Calculadora' },
  { href: '#portfolio',  label: 'Portfólio'   },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const openWhatsapp = () => window.open(WA, '_blank')
  const close = () => setOpen(false)

  return (
    <header className="topbar">
      <div className="container">
        <nav>
          <a className="nav-logo" href="#inicio" onClick={close}>
            <img src="/logo.jpeg" alt="BS POWER" />
          </a>

          <div className="nav-links">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>

          <div className="btn primary nav-cta" onClick={openWhatsapp}>
            Falar com consultor
          </div>

          <button
            className="hamb"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {open && (
          <div className="mobile-menu">
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="mobile-menu-link"
                onClick={close}
              >
                {l.label}
              </a>
            ))}
            <div
              className="btn primary mobile-menu-cta"
              onClick={() => { openWhatsapp(); close() }}
            >
              Falar com consultor
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

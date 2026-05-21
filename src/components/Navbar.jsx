const WA = 'https://wa.me/5577999999999?text=Ol%C3%A1%2C%20quero%20um%20estudo%20de%20viabilidade%20solar'

export default function Navbar() {
  const openWhatsapp = () => {
    window.open(WA, '_blank');
  };

  return (
    <header className="topbar">
      <div className="container">
        <nav>
          <a className="nav-logo" href="#inicio">
            <img src="/logo.jpeg" alt="BS POWER" />
          </a>
          <div className="nav-links">
            <a href="#servicos">Serviços</a>
            <a href="#quem-somos">Quem somos</a>
            <a href="#calculadora">Calculadora</a>
            <a href="#portfolio">Portfólio</a>
            <div className="btn primary" onClick={openWhatsapp}>
              Falar com consultor
            </div>
          </div>
          <a className="hamb" href="#servicos">☰</a>
        </nav>
      </div>
    </header>
  )
}

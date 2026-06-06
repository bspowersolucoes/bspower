import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SelfSelection from './components/SelfSelection'
import About from './components/About'
import Services from './components/Services'
import Calculator from './components/Calculator'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SelfSelection />
        <About />
        <Services />
        <Calculator />
        <Portfolio />
        <Testimonials />
        <FAQ />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}

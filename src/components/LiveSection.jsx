export default function LiveSection() {
  return (
    <div className="live-section">
      <div className="live-inner">
        <h2>📡 Ao Vivo</h2>
        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/U22YdVNZG7Y?autoplay=1&mute=1"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title="BS POWER ao vivo"
          />
        </div>
      </div>
    </div>
  )
}

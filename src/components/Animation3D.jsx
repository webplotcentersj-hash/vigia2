import React, { useEffect, useRef } from 'react'
import './Animation3D.css'

const Animation3D = ({ animationUrl }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && animationUrl) {
      // Aquí se integraría la animación 3D real generada por Gemini VEO
      // Por ahora mostramos un efecto visual 3D con CSS
    }
  }, [animationUrl])

  if (!animationUrl) return null

  return (
    <div className="animation-3d-container">
      <div className="animation-frame" ref={containerRef}>
        <div className="hologram-effect">
          <img src={animationUrl} alt="Animación 3D" className="hologram-image" />
          <div className="hologram-grid"></div>
          <div className="hologram-scan"></div>
        </div>
        <div className="animation-label">ANIMACIÓN 3D GENERADA</div>
      </div>
    </div>
  )
}

export default Animation3D


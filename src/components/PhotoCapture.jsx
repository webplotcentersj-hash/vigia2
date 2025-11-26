import React, { useEffect, useRef } from 'react'
import './PhotoCapture.css'

const PhotoCapture = ({ photo }) => {
  const imgRef = useRef(null)

  useEffect(() => {
    if (photo && imgRef.current) {
      imgRef.current.src = photo
    }
  }, [photo])

  if (!photo) return null

  return (
    <div className="photo-capture">
      <div className="photo-frame">
        <img ref={imgRef} alt="Captura" className="captured-photo" />
        <div className="photo-label">FOTO CAPTURADA</div>
      </div>
    </div>
  )
}

export default PhotoCapture


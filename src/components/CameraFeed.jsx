import React, { useEffect, useRef, useState } from 'react'
import './CameraFeed.css'

const CameraFeed = ({ onMotionDetected, status, onPhotoCapture }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [error, setError] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const photoCaptureTimeoutRef = useRef(null)

  useEffect(() => {
    // Iniciar cámara automáticamente al montar el componente
    startCamera()

    return () => {
      stopCamera()
    }
  }, [])

  // Reiniciar cámara si se pierde la conexión
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isActive) {
        startCamera()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isActive])

  useEffect(() => {
    if (status === 'standby' && isActive) {
      startMotionDetection()
    } else {
      stopMotionDetection()
    }

    // Capturar foto cuando está en modo scanning
    if (status === 'scanning' && videoRef.current && onPhotoCapture) {
      photoCaptureTimeoutRef.current = setTimeout(() => {
        capturePhoto()
      }, 2000) // Esperar 2 segundos después de iniciar el escaneo
    }

    return () => {
      if (photoCaptureTimeoutRef.current) {
        clearTimeout(photoCaptureTimeoutRef.current)
      }
    }
  }, [status, isActive, onPhotoCapture])

  const startCamera = async () => {
    try {
      // Detener cámara anterior si existe
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }

      const constraints = {
        video: {
          facingMode: 'user', // Cámara frontal
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        const video = videoRef.current
        video.srcObject = stream
        
        // Función para iniciar reproducción
        const startPlayback = () => {
          video.play()
            .then(() => {
              setIsActive(true)
              setError(null)
            })
            .catch(err => {
              console.error('Error al reproducir video:', err)
              setError('Error al reproducir video: ' + err.message)
              setIsActive(false)
            })
        }
        
        // Esperar a que el video esté listo
        if (video.readyState >= 2) {
          // Video ya está cargado
          startPlayback()
        } else {
          // Esperar al evento loadedmetadata
          const handleLoadedMetadata = () => {
            startPlayback()
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
          }
          video.addEventListener('loadedmetadata', handleLoadedMetadata)
          
          // Fallback después de 1 segundo
          setTimeout(() => {
            if (video.readyState >= 2 && video.paused) {
              startPlayback()
            }
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
          }, 1000)
        }
      }
    } catch (err) {
      setError('Error al acceder a la cámara: ' + err.message)
      console.error('Error de cámara:', err)
      setIsActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setIsActive(false)
  }

  const startMotionDetection = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    // Detener detección anterior si existe
    stopMotionDetection()

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Esperar a que el video esté listo
    const setupCanvas = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        startDetection()
      } else {
        setTimeout(setupCanvas, 100)
      }
    }

    const startDetection = () => {
      let lastFrame = null
      let motionThreshold = 25 // Sensibilidad ajustada
      let consecutiveMotionFrames = 0
      const requiredFrames = 3 // Menos frames para ser más sensible
      let isDetecting = true

      const detectMotion = () => {
        if (!isDetecting || !video || video.readyState !== video.HAVE_ENOUGH_DATA) {
          if (isDetecting) {
            animationFrameRef.current = requestAnimationFrame(detectMotion)
          }
          return
        }

        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height)

          if (lastFrame) {
            const motion = calculateMotion(lastFrame, currentFrame)
            
            if (motion > motionThreshold) {
              consecutiveMotionFrames++
              if (consecutiveMotionFrames >= requiredFrames) {
                isDetecting = false
                onMotionDetected()
                return
              }
            } else {
              consecutiveMotionFrames = Math.max(0, consecutiveMotionFrames - 1)
            }
          }

          lastFrame = currentFrame
          animationFrameRef.current = requestAnimationFrame(detectMotion)
        } catch (err) {
          console.error('Error en detección de movimiento:', err)
          isDetecting = false
        }
      }

      detectMotion()
    }

    setupCanvas()
  }

  const calculateMotion = (frame1, frame2) => {
    let diff = 0
    const data1 = frame1.data
    const data2 = frame2.data

    for (let i = 0; i < data1.length; i += 4) {
      const r1 = data1[i]
      const g1 = data1[i + 1]
      const b1 = data1[i + 2]
      
      const r2 = data2[i]
      const g2 = data2[i + 1]
      const b2 = data2[i + 2]

      const pixelDiff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)
      diff += pixelDiff
    }

    return diff / (data1.length / 4)
  }

  const stopMotionDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    // Dibujar el frame actual en el canvas
    ctx.save()
    ctx.scale(-1, 1) // Voltear horizontalmente para que coincida con el video
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()

    // Convertir a imagen
    const photoData = canvas.toDataURL('image/jpeg', 0.9)
    
    if (onPhotoCapture) {
      onPhotoCapture(photoData)
    }
  }

  return (
    <div className="camera-feed-container">
      <div className="camera-wrapper">
        {!isActive && !error && (
          <div className="camera-loading">
            <div className="loading-spinner"></div>
            <p>Cargando cámara...</p>
          </div>
        )}
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          playsInline
          muted
          style={{ 
            display: isActive ? 'block' : 'none',
            opacity: isActive ? 1 : 0
          }}
        />
        <canvas ref={canvasRef} className="motion-canvas" />
        {status === 'scanning' && (
          <div className="scanning-overlay">
            <div className="scan-line"></div>
            <p>ESCANEANDO...</p>
          </div>
        )}
        {status === 'alerting' && (
          <div className="alert-overlay">
            <div className="alert-pulse"></div>
            <p>¡MOVIMIENTO DETECTADO!</p>
          </div>
        )}
      </div>
      {error && <div className="camera-error">{error}</div>}
    </div>
  )
}

export default CameraFeed


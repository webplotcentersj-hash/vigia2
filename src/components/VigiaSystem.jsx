import React, { useState, useEffect, useRef, useCallback } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import CameraFeed from './CameraFeed'
import StatusDisplay from './StatusDisplay'
import PhotoCapture from './PhotoCapture'
import Animation3D from './Animation3D'
import VoiceChat from './VoiceChat'
import './VigiaSystem.css'

const VigiaSystem = () => {
  const [status, setStatus] = useState('standby') // standby, detecting, alerting, scanning, identified, chatting
  const [motionDetected, setMotionDetected] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [animationUrl, setAnimationUrl] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [geminiAI, setGeminiAI] = useState(null)
  const [error, setError] = useState(null)
  
  const alarmAudioRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Inicializar sistema de análisis
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        setGeminiAI(genAI)
      } catch (err) {
        console.warn('Error al inicializar sistema de análisis:', err.message)
        // Continuar sin API key - la app funcionará en modo demo
      }
    }
    // Si no hay API key, la app funcionará igual pero sin funciones de IA avanzadas

    // Asegurar que el sistema inicie en modo vigilancia
    setStatus('standby')
    
    // El sonido de alarma se generará sintéticamente cuando sea necesario

    // Inicializar reconocimiento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'es-ES'
    }

    return () => {
      if (alarmAudioRef.current) {
        alarmAudioRef.current.pause()
        alarmAudioRef.current = null
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const playAlarmSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Crear múltiples osciladores para un sonido más complejo
      for (let i = 0; i < 3; i++) {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 600 + (i * 200)
        oscillator.type = i === 0 ? 'sine' : 'square'
        
        const startTime = audioContext.currentTime + (i * 0.1)
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + 0.5)
      }
    } catch (err) {
      console.error('Error al reproducir alarma sintética:', err)
    }
  }, [])

  const handleMotionDetected = useCallback(async () => {
    if (status !== 'standby') return
    
    setMotionDetected(true)
    setStatus('alerting')
    
    // Reproducir alarma sintética
    playAlarmSound()

    // Esperar un momento y luego hablar con Gemini
    setTimeout(async () => {
      await speakWithGemini('PARE TIENE QUE IDENTIFICARSE')
      setStatus('scanning')
    }, 2000)
  }, [status, playAlarmSound])

  const speakWithGemini = useCallback(async (text) => {
    try {
      // Usar Web Speech API para síntesis de voz
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      window.speechSynthesis.speak(utterance)
    } catch (err) {
      console.error('Error en síntesis de voz:', err)
    }
  }, [])

  const handlePhotoCaptured = useCallback(async (photoData) => {
    setPhoto(photoData)
    setStatus('generating')
    
    // Generar animación 3D con Gemini VEO
    await generateAnimation3D(photoData)
  }, [])

  const generateProcessedImage = useCallback((imageData, description = '') => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = img.width
        canvas.height = img.height
        
        // Dibujar imagen original
        ctx.drawImage(img, 0, 0)
        
        // Aplicar filtros de prófugo de la justicia
        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageDataObj.data
        
        // Ajustar colores: más oscuro, más rojo, más contraste
        for (let i = 0; i < data.length; i += 4) {
          // Reducir brillo general
          data[i] = Math.min(255, data[i] * 0.7) // R
          data[i + 1] = Math.min(255, data[i + 1] * 0.5) // G
          data[i + 2] = Math.min(255, data[i + 2] * 0.5) // B
          
          // Aplicar tinte rojizo
          data[i] = Math.min(255, data[i] * 1.2 + 20)
          data[i + 1] = Math.max(0, data[i + 1] * 0.8)
          data[i + 2] = Math.max(0, data[i + 2] * 0.8)
        }
        
        ctx.putImageData(imageDataObj, 0, 0)
        
        // Agregar marco rojo de advertencia
        ctx.strokeStyle = '#ff0000'
        ctx.lineWidth = 8
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)
        
        // Agregar segundo marco interno
        ctx.strokeStyle = '#ff4444'
        ctx.lineWidth = 4
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)
        
        // Agregar texto "PRÓFUGO" en la parte superior
        ctx.fillStyle = '#ff0000'
        ctx.font = 'bold 40px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.shadowColor = '#000000'
        ctx.shadowBlur = 10
        ctx.fillText('PRÓFUGO', canvas.width / 2, 30)
        
        // Agregar texto "BUSCADO" en la parte inferior
        ctx.fillText('BUSCADO', canvas.width / 2, canvas.height - 70)
        
        // Agregar efecto de escaneo (líneas horizontales)
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)'
        ctx.lineWidth = 2
        for (let y = 0; y < canvas.height; y += 20) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
        
        // Convertir a imagen
        const processedImageUrl = canvas.toDataURL('image/jpeg', 0.9)
        resolve(processedImageUrl)
      }
      img.src = imageData
    })
  }, [])

  const generateAnimation3D = useCallback(async (photoData) => {
    try {
      setStatus('generating')
      
      let processedImageUrl = photoData
      let geminiDescription = ''
      
      // Si hay Gemini AI disponible, procesar la imagen
      if (geminiAI) {
        try {
          const model = geminiAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
          
          // Convertir base64 a formato que Gemini pueda procesar
          const base64Data = photoData.split(',')[1]
          const mimeType = photoData.split(',')[0].split(':')[1].split(';')[0]
          
          // Crear partes para Gemini con imagen y texto
          const parts = [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            {
              text: `Analiza esta imagen de una persona capturada por el sistema de seguridad VIGIA. Describe cómo se vería esta persona en una imagen estilo prófugo de la justicia con efectos visuales de alerta roja, marcos de advertencia, y estilo de identificación criminal futurista.`
            }
          ]
          
          // Procesar imagen con Gemini
          const result = await model.generateContent(parts)
          const response = await result.response
          geminiDescription = response.text()
          
          console.log('Descripción generada por Gemini:', geminiDescription)
          
        } catch (err) {
          console.warn('Error al procesar imagen con Gemini:', err)
        }
      }
      
      // Generar imagen procesada con efectos visuales
      processedImageUrl = await generateProcessedImage(photoData, geminiDescription)
      
      // Usar la imagen procesada
      setAnimationUrl(processedImageUrl)
      
      setTimeout(async () => {
        setStatus('identified')
        await speakWithGemini('Análisis completado. Acceso denegado.')
        // Iniciar conversación automáticamente después de hablar
        setTimeout(() => {
          setIsListening(true)
          setStatus('chatting')
          speakWithGemini('Puedes hablar conmigo ahora.')
        }, 2000)
      }, 4000)
      
    } catch (err) {
      console.error('Error al procesar datos:', err)
      // Generar imagen procesada básica sin Gemini
      try {
        const processedImageUrl = await generateProcessedImage(photoData)
        setAnimationUrl(processedImageUrl)
      } catch (err2) {
        setAnimationUrl(photoData)
      }
      setTimeout(async () => {
        setStatus('identified')
        await speakWithGemini('Acceso denegado.')
        // Iniciar conversación automáticamente después de hablar
        setTimeout(() => {
          setIsListening(true)
          setStatus('chatting')
          speakWithGemini('Puedes hablar conmigo ahora.')
        }, 2000)
      }, 3000)
    }
  }, [geminiAI, speakWithGemini, generateProcessedImage])

  const handleStartVoiceChat = () => {
    setIsListening(true)
    setStatus('chatting')
  }

  const handleStopVoiceChat = () => {
    setIsListening(false)
    if (status === 'chatting') {
      setStatus('identified')
    }
  }

  const resetSystem = () => {
    setStatus('standby')
    setMotionDetected(false)
    setPhoto(null)
    setAnimationUrl(null)
    setIsListening(false)
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause()
      alarmAudioRef.current.currentTime = 0
    }
  }

  return (
    <div className="vigia-system">
      <StatusDisplay status={status} motionDetected={motionDetected} />
      
      <div className="main-content">
        <CameraFeed 
          onMotionDetected={handleMotionDetected}
          status={status}
          onPhotoCapture={handlePhotoCaptured}
        />
        
        {photo && (
          <PhotoCapture photo={photo} />
        )}
        
        {animationUrl && status === 'identified' && (
          <Animation3D animationUrl={animationUrl} />
        )}
      </div>

      {(status === 'identified' || status === 'chatting') && (
        <VoiceChat
          geminiAI={geminiAI}
          isListening={isListening}
          onStart={handleStartVoiceChat}
          onStop={handleStopVoiceChat}
          onSpeak={speakWithGemini}
        />
      )}

      {status !== 'standby' && (
        <button className="reset-btn" onClick={resetSystem}>
          Reiniciar Sistema
        </button>
      )}

      {error && error.includes('Error') && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  )
}

export default VigiaSystem


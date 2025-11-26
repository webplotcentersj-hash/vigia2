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

  const generateAnimation3D = useCallback(async (photoData) => {
    try {
      setStatus('generating')
      
      let processedImageUrl = photoData
      
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
              text: `Transforma esta imagen de una persona capturada por el sistema de seguridad VIGIA en una imagen estilo prófugo de la justicia. La imagen debe tener:
- Efectos visuales de alerta roja
- Marcos de advertencia alrededor de la persona
- Estilo de identificación criminal futurista
- Efectos de escaneo y datos biométricos
- Diseño que indique que es un prófugo buscado
- Ambiente oscuro y siniestro
- Colores rojos y negros predominantes

Describe cómo se vería esta imagen transformada con estos efectos.`
            }
          ]
          
          // Procesar imagen con Gemini
          const result = await model.generateContent(parts)
          const response = await result.response
          const description = response.text()
          
          console.log('Descripción generada por Gemini:', description)
          
          // La imagen procesada será la original con efectos CSS mejorados
          // En el futuro se podría usar Gemini Imagen para generar una nueva imagen
          processedImageUrl = photoData
          
        } catch (err) {
          console.warn('Error al procesar imagen con Gemini:', err)
          // Continuar con la imagen original
          processedImageUrl = photoData
        }
      }
      
      // Usar la foto con efectos visuales de prófugo
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
      setAnimationUrl(photoData)
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
  }, [geminiAI, speakWithGemini])

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


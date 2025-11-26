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
    // Inicializar Gemini AI
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
    if (!apiKey) {
      setError('Por favor configura VITE_GEMINI_API_KEY en tu archivo .env')
      // Continuar sin API key para permitir que la app funcione en modo demo
    } else {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        setGeminiAI(genAI)
      } catch (err) {
        setError('Error al inicializar Gemini AI: ' + err.message)
      }
    }

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
    if (!geminiAI) {
      setError('Gemini AI no está inicializado')
      return
    }

    try {
      setStatus('generating')
      
      // Nota: Gemini VEO actualmente requiere usar la API de imágenes
      // Aquí simulamos la generación de animación 3D
      // En producción, usarías la API de VEO de Gemini cuando esté disponible
      
      const model = geminiAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
      
      // Convertir la imagen base64 a formato que Gemini pueda procesar
      const base64Data = photoData.split(',')[1]
      
      // Crear prompt para generar animación 3D
      const prompt = `Esta es una imagen de una persona capturada por el sistema de seguridad VIGIA. Genera una descripción detallada de cómo se vería esta persona en una animación 3D holográfica futurista. La animación debe mostrar a la persona en un entorno de realidad aumentada con efectos visuales avanzados.`
      
      // Por ahora, usamos la foto como base para la animación con efectos visuales
      // En producción, integrarías con Gemini VEO API cuando esté disponible
      setAnimationUrl(photoData) // Usar la foto como placeholder con efectos CSS
      
      setTimeout(() => {
        setStatus('identified')
        speakWithGemini('Identificación completada. Bienvenido a PLOT CENTER.')
      }, 3000)
      
    } catch (err) {
      console.error('Error al generar animación:', err)
      setError('Error al generar animación 3D: ' + err.message)
      setStatus('identified')
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

      {status === 'identified' && (
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

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  )
}

export default VigiaSystem


import React, { useState, useEffect, useRef } from 'react'
import './VoiceChat.css'

const VoiceChat = ({ geminiAI, isListening, onStart, onStop, onSpeak }) => {
  const [messages, setMessages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'es-ES'

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript
        setMessages(prev => [...prev, { type: 'user', text: transcript }])
        await processUserMessage(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error)
        setIsProcessing(false)
      }

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Reiniciar si aún está en modo escucha
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              recognitionRef.current.start()
            }
          }, 100)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (synthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isListening])

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.start()
    } else if (!isListening && recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const processUserMessage = async (userMessage) => {
    if (!geminiAI) {
      const errorMsg = 'Gemini AI no está disponible'
      setMessages(prev => [...prev, { type: 'system', text: errorMsg }])
      return
    }

    setIsProcessing(true)

    try {
      const model = geminiAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
      
      const prompt = `Eres VIGIA, un sistema de seguridad avanzado de PLOT CENTER. Eres profesional pero amigable. El usuario dijo: "${userMessage}". Responde brevemente en español de manera natural y conversacional.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      setMessages(prev => [...prev, { type: 'vigia', text }])
      
      // Hablar la respuesta
      if (onSpeak) {
        onSpeak(text)
      }
    } catch (error) {
      console.error('Error al procesar mensaje:', error)
      const errorMsg = 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.'
      setMessages(prev => [...prev, { type: 'system', text: errorMsg }])
      if (onSpeak) {
        onSpeak(errorMsg)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="voice-chat">
      <div className="voice-chat-header">
        <h3>Chat con VIGIA</h3>
        <div className="voice-controls">
          {!isListening ? (
            <button className="voice-btn start-btn" onClick={onStart}>
              🎤 Iniciar Chat
            </button>
          ) : (
            <button className="voice-btn stop-btn" onClick={onStop}>
              ⏹ Detener
            </button>
          )}
        </div>
      </div>

      {isListening && (
        <div className="listening-indicator">
          <div className="listening-pulse"></div>
          <span>Escuchando...</span>
        </div>
      )}

      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <span>Procesando...</span>
        </div>
      )}

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VoiceChat


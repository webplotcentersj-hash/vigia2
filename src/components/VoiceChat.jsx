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
        if (isListening && recognitionRef.current) {
          // Reiniciar automáticamente si aún está en modo escucha
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              try {
                recognitionRef.current.start()
              } catch (err) {
                // Si hay error, esperar un poco más antes de reintentar
                if (err.name !== 'AbortError') {
                  console.warn('Error al reiniciar reconocimiento:', err)
                  setTimeout(() => {
                    if (isListening && recognitionRef.current) {
                      try {
                        recognitionRef.current.start()
                      } catch (err2) {
                        console.warn('Error al reiniciar reconocimiento (segundo intento):', err2)
                      }
                    }
                  }, 1000)
                }
              }
            }
          }, 500)
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
      const errorMsg = 'Sistema de análisis no disponible. Por favor configura la API key de Gemini.'
      setMessages(prev => [...prev, { type: 'system', text: errorMsg }])
      if (onSpeak) {
        onSpeak('Lo siento, el sistema de análisis no está disponible.')
      }
      return
    }

    setIsProcessing(true)

    try {
      const model = geminiAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
      
      const prompt = `Eres VIGIA, un sistema de seguridad avanzado y futurista de PLOT CENTER. Eres un sistema de seguridad tipo nave espacial con inteligencia artificial avanzada.

CONTEXTO:
- Acabas de identificar a una persona como prófugo de la justicia
- El acceso fue denegado
- Estás en modo de comunicación con la persona identificada

PERSONALIDAD:
- Profesional pero con personalidad tecnológica
- Directo y eficiente
- Usa lenguaje técnico pero comprensible
- Mantén un tono serio pero no agresivo
- Responde como un sistema de seguridad avanzado

El usuario dijo: "${userMessage}"

Responde en español de manera:
- Breve y directa (máximo 2-3 oraciones)
- Con estilo tecnológico/futurista
- Relevante al contexto de seguridad
- Mantén la coherencia con tu rol de sistema de seguridad`

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
      const errorMsg = 'Error en el sistema de comunicación. Intenta nuevamente.'
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
        <h3>Comunicación con VIGIA</h3>
        <div className="voice-controls">
          {isListening && (
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


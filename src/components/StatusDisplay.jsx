import React from 'react'
import './StatusDisplay.css'

const StatusDisplay = ({ status, motionDetected }) => {
  const getStatusText = () => {
    switch (status) {
      case 'standby':
        return 'EN ESPERA'
      case 'detecting':
        return 'DETECTANDO...'
      case 'alerting':
        return '¡ALERTA!'
      case 'scanning':
        return 'ESCANEANDO'
      case 'identified':
        return 'IDENTIFICADO'
      case 'generating':
        return 'GENERANDO ANIMACIÓN...'
      case 'chatting':
        return 'CHAT ACTIVO'
      default:
        return 'SISTEMA ACTIVO'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'standby':
        return '#00ff00'
      case 'alerting':
        return '#ff0000'
      case 'scanning':
        return '#ffaa00'
      case 'identified':
        return '#00aaff'
      case 'generating':
        return '#aa00ff'
      case 'chatting':
        return '#00ffff'
      default:
        return '#ffffff'
    }
  }

  return (
    <div className="status-display">
      <div 
        className="status-indicator"
        style={{ backgroundColor: getStatusColor() }}
      >
        <div className="status-pulse" style={{ borderColor: getStatusColor() }}></div>
      </div>
      <div className="status-text">
        <span className="status-label">ESTADO:</span>
        <span className="status-value">{getStatusText()}</span>
      </div>
    </div>
  )
}

export default StatusDisplay


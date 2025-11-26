import React, { useState, useEffect, useRef } from 'react'
import VigiaSystem from './components/VigiaSystem'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>VIGIA PLOT</h1>
        <p className="subtitle">PLOT CENTER - Sistema de Seguridad</p>
      </header>
      <VigiaSystem />
    </div>
  )
}

export default App



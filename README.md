# VIGIA PLOT - Sistema de Seguridad PLOT CENTER

Aplicación web para tablet que simula un sistema de seguridad con detección de movimiento, identificación y chat de voz usando Gemini AI.

## Características

- 🎥 **Detección de Movimiento**: Usa la cámara frontal para detectar movimiento
- 🔔 **Alarma Sonora**: Reproduce una alarma cuando detecta movimiento
- 🗣️ **Síntesis de Voz**: Gemini AI habla "PARE TIENE QUE IDENTIFICARSE"
- 📸 **Captura de Foto**: Toma una foto cuando la persona se acerca
- 🎬 **Animación 3D**: Genera una animación holográfica 3D usando Gemini VEO
- 💬 **Chat de Voz**: Conversación bidireccional con VIGIA usando Gemini AI

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Crea un archivo `.env` en la raíz del proyecto:
```
VITE_GEMINI_API_KEY=tu_api_key_de_gemini
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:3000`

## Uso

1. La aplicación solicitará acceso a la cámara frontal
2. Cuando detecte movimiento, sonará una alarma
3. VIGIA dirá "PARE TIENE QUE IDENTIFICARSE"
4. Se capturará una foto automáticamente
5. Se generará una animación 3D holográfica
6. Puedes iniciar un chat de voz con VIGIA

## Configuración de Gemini API

1. Obtén tu API key de Google Gemini desde [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un archivo `.env` en la raíz del proyecto:
```
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

## Notas Importantes

- **API Key de Gemini**: Es obligatoria para que funcione la aplicación. Sin ella, algunas funcionalidades no estarán disponibles.
- **Cámara**: La aplicación requiere acceso a la cámara frontal. Asegúrate de permitir el acceso cuando el navegador lo solicite.
- **HTTPS/Localhost**: Para acceder a la cámara, la aplicación debe ejecutarse en HTTPS o localhost (no funciona en HTTP en producción).
- **Navegadores Compatibles**: 
  - Chrome/Edge (recomendado para mejor compatibilidad)
  - Firefox
  - Safari (con limitaciones en reconocimiento de voz)
- **Tablet**: La aplicación está optimizada para tablets con pantalla táctil.
- **Sonido de Alarma**: Se genera sintéticamente usando Web Audio API, no requiere archivos externos.

## Tecnologías

- React 18
- Vite
- Google Generative AI (Gemini)
- Web APIs (MediaDevices, Speech Recognition, Speech Synthesis)


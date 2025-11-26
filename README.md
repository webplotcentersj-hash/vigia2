# VIGIA PLOT - Sistema de Seguridad PLOT CENTER

Aplicación web para tablet que simula un sistema de seguridad con detección de movimiento, identificación y chat de voz usando Gemini AI.

## 🚀 Características

- 🎥 **Detección de Movimiento**: Usa la cámara frontal para detectar movimiento en tiempo real
- 🔔 **Alarma Sonora**: Reproduce una alarma sintética cuando detecta movimiento
- 🗣️ **Síntesis de Voz**: VIGIA dice "PARE TIENE QUE IDENTIFICARSE" usando Web Speech API
- 📸 **Captura de Foto**: Toma una foto automáticamente cuando la persona se acerca
- 🎬 **Animación 3D**: Genera una animación holográfica 3D con efectos visuales avanzados
- 💬 **Chat de Voz**: Conversación bidireccional con VIGIA usando Gemini AI
- 🔄 **Vigilancia Continua**: La app inicia automáticamente en modo vigilancia al abrirse

## 📦 Instalación Local

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

## 🌐 Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Ve a [Vercel](https://vercel.com) y conéctate con tu cuenta de GitHub
2. Importa el repositorio `vigia2`
3. Configura las variables de entorno:
   - `VITE_GEMINI_API_KEY`: Tu API key de Google Gemini
4. Haz clic en "Deploy"
5. ¡Listo! Tu app estará disponible en una URL de Vercel

### Opción 2: Desde CLI

```bash
npm i -g vercel
vercel
```

Sigue las instrucciones y configura `VITE_GEMINI_API_KEY` cuando se solicite.

## ⚙️ Configuración de Gemini API

1. Obtén tu API key de Google Gemini desde [Google AI Studio](https://makersuite.google.com/app/apikey)
2. En Vercel, ve a Settings > Environment Variables
3. Agrega `VITE_GEMINI_API_KEY` con tu API key
4. Redespliega la aplicación

## 📱 Uso

1. **Inicio Automático**: La aplicación inicia automáticamente en modo vigilancia al abrirse
2. **Detección**: Cuando detecta movimiento, suena una alarma
3. **Identificación**: VIGIA dice "PARE TIENE QUE IDENTIFICARSE"
4. **Escaneo**: Se captura una foto automáticamente después de 2 segundos
5. **Animación**: Se genera una animación 3D holográfica
6. **Chat**: Puedes iniciar un chat de voz con VIGIA

## 🔧 Requisitos

- **Navegador**: Chrome, Edge o Firefox (Chrome/Edge recomendado)
- **Cámara**: Cámara frontal disponible
- **Micrófono**: Opcional, solo para chat de voz
- **HTTPS**: Requerido para producción (Vercel lo proporciona automáticamente)

## 📝 Notas Importantes

- **API Key de Gemini**: Es obligatoria para funcionalidades de IA. Sin ella, la app funcionará en modo demo.
- **Cámara**: La aplicación requiere acceso a la cámara frontal. Asegúrate de permitir el acceso.
- **HTTPS**: Vercel proporciona HTTPS automáticamente, necesario para acceder a la cámara.
- **Vigilancia Continua**: La app reinicia automáticamente la cámara si se pierde la conexión.
- **Tablet**: Optimizada para tablets con pantalla táctil.

## 🛠️ Tecnologías

- **React 18**: Framework de UI
- **Vite**: Build tool y dev server
- **Google Generative AI**: Integración con Gemini AI
- **Web APIs**: MediaDevices, Speech Recognition, Speech Synthesis, Web Audio API

## 📄 Estructura del Proyecto

```
vigia2/
├── src/
│   ├── components/
│   │   ├── VigiaSystem.jsx      # Componente principal del sistema
│   │   ├── CameraFeed.jsx       # Detección de movimiento y cámara
│   │   ├── StatusDisplay.jsx    # Indicador de estado
│   │   ├── PhotoCapture.jsx     # Visualización de foto capturada
│   │   ├── Animation3D.jsx       # Animación holográfica 3D
│   │   └── VoiceChat.jsx         # Chat de voz con Gemini
│   ├── App.jsx
│   └── main.jsx
├── public/
├── vercel.json                   # Configuración de Vercel
├── vite.config.js
└── package.json
```

## 🐛 Solución de Problemas

### La cámara no funciona
- Verifica que hayas dado permisos de cámara al navegador
- Asegúrate de estar usando HTTPS (Vercel lo proporciona)
- Prueba en Chrome o Edge para mejor compatibilidad

### Gemini AI no responde
- Verifica que `VITE_GEMINI_API_KEY` esté configurada en Vercel
- Asegúrate de que la API key sea válida y tenga créditos disponibles
- Revisa los logs de Vercel para ver errores específicos

### El reconocimiento de voz no funciona
- Usa Chrome o Edge (mejor soporte)
- Verifica permisos de micrófono
- Requiere HTTPS (Vercel lo proporciona automáticamente)

## 📞 Soporte

Para problemas o preguntas, abre un issue en el repositorio de GitHub.

## 📜 Licencia

Este proyecto es propiedad de PLOT CENTER.

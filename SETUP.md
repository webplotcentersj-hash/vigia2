# Guía de Configuración - VIGIA PLOT

## Requisitos Previos

1. **Node.js**: Versión 18 o superior
2. **NPM**: Incluido con Node.js
3. **API Key de Google Gemini**: Obtén una desde [Google AI Studio](https://makersuite.google.com/app/apikey)

## Pasos de Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

**Importante**: Reemplaza `tu_api_key_de_gemini_aqui` con tu API key real de Google Gemini.

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Construir para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Uso en Tablet

1. Asegúrate de que la tablet esté en la misma red que tu computadora de desarrollo
2. Accede a la aplicación usando la IP de tu computadora: `http://TU_IP:3000`
3. O despliega la aplicación en un servidor web con HTTPS

## Permisos Necesarios

La aplicación solicitará los siguientes permisos:

- **Cámara**: Para detectar movimiento y capturar fotos
- **Micrófono**: Para el chat de voz (opcional)

## Solución de Problemas

### La cámara no funciona
- Verifica que hayas dado permisos de cámara al navegador
- Asegúrate de estar usando HTTPS o localhost
- Prueba en Chrome o Edge para mejor compatibilidad

### Gemini AI no responde
- Verifica que tu API key esté correctamente configurada en el archivo `.env`
- Asegúrate de que la API key sea válida y tenga créditos disponibles
- Revisa la consola del navegador para ver errores específicos

### El reconocimiento de voz no funciona
- Asegúrate de usar Chrome o Edge (mejor soporte)
- Verifica que hayas dado permisos de micrófono
- Algunos navegadores requieren HTTPS para reconocimiento de voz

## Características Implementadas

✅ Detección de movimiento con cámara frontal
✅ Alarma sonora sintética
✅ Síntesis de voz con Web Speech API
✅ Captura automática de foto
✅ Animación 3D holográfica (efectos visuales)
✅ Chat de voz bidireccional con Gemini AI
✅ Interfaz optimizada para tablet

## Próximas Mejoras

- Integración completa con Gemini VEO API cuando esté disponible públicamente
- Mejoras en la detección de movimiento
- Más opciones de personalización
- Guardado de historial de identificaciones



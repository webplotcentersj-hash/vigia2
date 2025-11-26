# Guía de Despliegue en Vercel

## Pasos para Desplegar VIGIA PLOT en Vercel

### 1. Conectar con GitHub

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "Add New Project"
4. Selecciona el repositorio `webplotcentersj-hash/vigia2`

### 2. Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Vite. La configuración será:

- **Framework Preset**: Vite
- **Root Directory**: `./` (raíz)
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `dist` (automático)
- **Install Command**: `npm install` (automático)

### 3. Configurar Variables de Entorno

**IMPORTANTE**: Debes agregar la variable de entorno antes de hacer el deploy:

1. En la sección "Environment Variables", agrega:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Tu API key de Google Gemini
   - **Environment**: Production, Preview, Development (marca las tres)

2. Para obtener tu API key:
   - Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Crea una nueva API key o usa una existente
   - Cópiala y pégala en Vercel

### 4. Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el proceso (1-2 minutos)
3. Tu app estará disponible en una URL como: `https://vigia2.vercel.app`

### 5. Verificar el Despliegue

1. Abre la URL de tu aplicación
2. Permite el acceso a la cámara cuando se solicite
3. La app debería iniciar automáticamente en modo vigilancia
4. Mueve tu mano frente a la cámara para probar la detección de movimiento

## Configuración Adicional

### Dominio Personalizado (Opcional)

1. Ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones de DNS

### Variables de Entorno por Ambiente

Puedes configurar diferentes API keys para:
- **Production**: Para producción
- **Preview**: Para previews de PRs
- **Development**: Para desarrollo local

## Troubleshooting

### Error: "VITE_GEMINI_API_KEY is not defined"

- Verifica que hayas agregado la variable de entorno en Vercel
- Asegúrate de haber seleccionado todos los ambientes (Production, Preview, Development)
- Redespliega la aplicación después de agregar la variable

### La cámara no funciona

- Verifica que estés usando HTTPS (Vercel lo proporciona automáticamente)
- Asegúrate de dar permisos de cámara al navegador
- Prueba en Chrome o Edge para mejor compatibilidad

### Build falla

- Revisa los logs de build en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que Node.js versión sea compatible (Vercel usa Node 18 por defecto)

## Actualizaciones Futuras

Cada vez que hagas push a la rama `main` en GitHub, Vercel desplegará automáticamente una nueva versión.

Para desplegar manualmente:
1. Ve a tu proyecto en Vercel
2. Haz clic en "Redeploy"
3. Selecciona el commit que quieres desplegar

## Monitoreo

- Ve a la pestaña "Analytics" para ver métricas de uso
- Revisa "Logs" para ver errores en tiempo real
- Usa "Functions" si agregas serverless functions en el futuro


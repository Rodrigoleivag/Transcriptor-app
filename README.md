# 🎙️ AudioResume - Transcribe & Resume

Una aplicación full-stack para transcribir audios, generar resúmenes inteligentes y crear tareas accionables.

## ✨ Características

- 🎵 **Carga de Audios**: Soporta MP3, WAV, OGG, WebM (hasta 100MB)
- 🔤 **Transcripción Automática**: Usando Whisper API de OpenAI
- 📋 **Resumen Inteligente**: Análisis automático del contenido
- ⭐ **Puntos Clave**: Identificación de información importante
- ✅ **Tareas Accionables**: Genera tareas específicas para cada punto clave
- 📚 **Historial**: Guarda todas tus transcripciones
- 🎨 **Interfaz Moderna**: Diseño responsivo con Tailwind CSS

## 🏗️ Estructura del Proyecto

```
Transcriptor-app/
├── backend/                    # API Node.js/Express
│   ├── src/
│   │   ├── server.ts          # Servidor principal
│   │   ├── database/          # Configuración de BD
│   │   ├── services/          # Lógica de negocio
│   │   ├── routes/            # Rutas de API
│   │   └── middleware/        # Middlewares
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # App React
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas principales
│   │   ├── App.tsx            # Componente raíz
│   │   └── index.css          # Estilos globales
│   ├── public/
│   └── package.json
└── package.json               # Configuración raíz
```

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Clave API de OpenAI

### 1. Configurar Variables de Entorno

```bash
cd backend
cp .env.example .env
```

Edita `.env` y agrega tu clave API de OpenAI:

```env
PORT=5000
OPENAI_API_KEY=tu_clave_aqui
NODE_ENV=development
```

### 2. Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm run install-all
```

### 3. Iniciar la Aplicación

**Opción A: Modo Desarrollo (ambos servicios simultáneamente)**

```bash
npm run dev
```

Esto iniciará:
- Backend en `http://localhost:5000`
- Frontend en `http://localhost:3000`

**Opción B: Manualmente**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📱 Uso

1. **Accede a la aplicación**: Abre `http://localhost:3000` en tu navegador
2. **Sube un audio**: Arrastra un archivo de audio o haz clic para seleccionar
3. **Espera el procesamiento**: La aplicación transcribirá y analizará el audio
4. **Revisa los resultados**: 
   - Resumen y puntos clave
   - Transcripción completa
   - Tareas accionables
5. **Gestiona tus audios**: Accede al historial para ver todas tus transcripciones

## 🔌 API Endpoints

### POST `/api/audio/upload`
Sube y procesa un archivo de audio.

**Request:**
```bash
curl -F "audio=@tu_audio.mp3" http://localhost:5000/api/audio/upload
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "audio.mp3",
    "transcription": "texto...",
    "summary": "resumen...",
    "keyPoints": ["punto1", "punto2"],
    "actionableTasks": [
      {
        "keyPoint": "punto1",
        "tasks": ["tarea1", "tarea2"]
      }
    ]
  }
}
```

### GET `/api/audio`
Obtiene todas las transcripciones.

### GET `/api/audio/:id`
Obtiene una transcripción específica.

### DELETE `/api/audio/:id`
Elimina una transcripción.

## 🛠️ Stack Tecnológico

### Backend
- **Express.js**: Framework web
- **TypeScript**: Tipado estático
- **OpenAI API**: Transcripción y IA
- **SQLite3**: Base de datos
- **Multer**: Carga de archivos

### Frontend
- **React 18**: Interfaz de usuario
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **React Query**: Gestión de estado
- **React Router**: Navegación

## 📊 Base de Datos

La aplicación usa SQLite con la siguiente estructura:

```sql
CREATE TABLE transcriptions (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  originalAudio TEXT NOT NULL,
  transcription TEXT NOT NULL,
  summary TEXT NOT NULL,
  keyPoints TEXT NOT NULL,
  actionableTasks TEXT NOT NULL,
  duration REAL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Seguridad

- ✅ Validación de tipos con TypeScript
- ✅ Manejo de errores robusto
- ✅ Límites de carga de archivos
- ✅ CORS habilitado
- ✅ Variables de entorno protegidas

## 📝 Ejemplos de Casos de Uso

### 1. Reuniones de Negocio
Sube una grabación de junta para obtener un resumen, puntos de decisión y tareas asignadas.

### 2. Conferencias
Transcribe presentaciones y obtén una lista de aprendizajes con tareas de seguimiento.

### 3. Entrevistas
Procesa grabaciones de entrevistas para extraer información clave y próximos pasos.

### 4. Capacitación
Convierte materiales de audio en documentos con puntos clave y tareas de práctica.

## 🐛 Solución de Problemas

### Error: "Permission Denied: Invalid API Key"
- Verifica que tu clave de OpenAI está correcta en `.env`
- Asegúrate de que la clave tiene permisos para Whisper API

### Error: "File too large"
- El máximo es 100MB. Comprime tu audio o divídelo en partes

### Frontend no conecta con Backend
- Verifica que el backend está corriendo en puerto 5000
- Comprueba la configuración de CORS
- Revisa la consola del navegador para errores de red

## 🚀 Despliegue

### Producción

```bash
# Compilar backend
cd backend
npm run build

# Compilar frontend
cd frontend
npm run build
```

## 📄 Licencia

MIT

## 👨‍💻 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue o pull request.

## 📧 Soporte

Para reportar bugs o solicitar funcionalidades, crea un issue en el repositorio.

---

Hecho con ❤️ para transcribir y resumir audios inteligentemente.

# 📐 Arquitectura del Sistema

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                      USUARIO                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Home         │  History       │  Detail              │  │
│  │  - Upload     │  - Listado     │  - Ver detalles      │  │
│  │  - Progress   │  - Delete      │  - Editar notas      │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           React Query (State Management)             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
           ↓ (HTTP/REST)
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           API Routes                                 │  │
│  │  POST   /api/audio/upload                           │  │
│  │  GET    /api/audio                                  │  │
│  │  GET    /api/audio/:id                              │  │
│  │  DELETE /api/audio/:id                              │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Services Layer                             │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ Audio Service                                   │ │  │
│  │  │ - processAudioFile()                           │ │  │
│  │  │ - getTranscription()                           │ │  │
│  │  │ - getAllTranscriptions()                       │ │  │
│  │  │ - deleteTranscription()                        │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ OpenAI Service                                  │ │  │
│  │  │ - transcribeAudio()   → Whisper API            │ │  │
│  │  │ - generateSummary()   → GPT-4                  │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Middleware                                 │  │
│  │ - CORS, Error Handler, Multer (uploads)           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
     ↓              ↓              ↓
┌──────────┐  ┌──────────────┐  ┌──────────┐
│ OpenAI   │  │   SQLite DB  │  │ Storage  │
│ API      │  │ Transcriptions│  │ Uploads  │
└──────────┘  │ Resumen      │  │ (Temp)   │
              │ Puntos Clave │  └──────────┘
              │ Tareas       │
              └──────────────┘
```

## Flujo de Procesamiento

```
1. Usuario sube archivo
   ↓
2. Validación (tipo, tamaño)
   ↓
3. Almacenamiento temporal en /uploads
   ↓
4. Transcripción (Whisper API)
   ↓
5. Análisis (GPT-4o-mini)
   ├─ Resumen
   ├─ Puntos clave
   └─ Tareas por punto
   ↓
6. Guardado en BD (SQLite)
   ↓
7. Limpieza de archivo temporal
   ↓
8. Respuesta al cliente
   ↓
9. Visualización en UI
```

## Componentes Principales

### Frontend Components
- **Header**: Navegación principal
- **AudioUpload**: Drag & drop de archivos
- **Results**: Visualización de resultados (3 tabs)
- **Loading**: Indicador de progreso

### Pages
- **Home**: Upload y procesamiento
- **History**: Listado de transcripciones
- **Detail**: Vista completa de una transcripción

### Backend Services
- **audio.service.ts**: Lógica de audios
- **openai.service.ts**: Integración con OpenAI
- **db.ts**: Acceso a base de datos

## Flujo de Datos

```json
{
  "request": {
    "file": "audio.mp3 (binary)",
    "maxSize": "100MB"
  },
  "processing": {
    "transcription": "texto completo...",
    "analysis": {
      "summary": "resumen....",
      "keyPoints": ["punto1", "punto2"],
      "actionableTasks": [
        {
          "keyPoint": "punto1",
          "tasks": ["tarea1", "tarea2"]
        }
      ]
    }
  },
  "storage": {
    "table": "transcriptions",
    "fields": {
      "id": "uuid",
      "filename": "string",
      "transcription": "text",
      "summary": "text",
      "keyPoints": "json",
      "actionableTasks": "json",
      "createdAt": "timestamp"
    }
  }
}
```

## Seguridad

```
Niveles de Validación:
  ↓
1. Cliente (Frontend)
   - Validación de tipo de archivo
   - Validación de tamaño
   
2. Servidor (Express)
   - Multer validation
   - Type checking
   - Error handling
   
3. Base de Datos
   - Queries parametrizadas
   - Validación de ID
```

## Escalabilidad

### Mejoras Futuras
- [ ] Queue system (Bull/Redis) para procesamiento async
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Caché (Redis) para transcripciones frecuentes
- [ ] PostgreSQL para producción
- [ ] Autenticación de usuarios
- [ ] Paginación en historial
- [ ] Búsqueda y filtrado
- [ ] Export a PDF/Docx

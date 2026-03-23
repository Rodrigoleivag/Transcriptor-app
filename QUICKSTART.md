# 🚀 Quick Start

## Inicio Rápido (5 minutos)

### Paso 1: Clonar y Navegar
```bash
cd Github-copilot-mcp/Transcriptor-app
```

### Paso 2: Configurar Clave API
```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` y agrega tu clave de OpenAI:
```env
OPENAI_API_KEY=sk-proj-tu-clave-aqui
```

Obtén tu clave en: https://platform.openai.com/api-keys

### Paso 3: Instalar Dependencias
```bash
npm run install-all
```

### Paso 4: Iniciar Desarrollo
```bash
npm run dev
```

✅ ¡Listo! Abre http://localhost:3000

---

## 🐳 Con Docker

```bash
# Agregar tu clave API
export OPENAI_API_KEY=sk-proj-tu-clave

# Ejecutar
docker-compose up
```

Accede a http://localhost:3000

---

## 📝 Primer Uso

1. **Sube un audio** (MP3, WAV, OGG, WebM)
2. **Espera** el procesamiento (2-5 minutos según tamaño)
3. **Obtén:**
   - ✍️ Transcripción completa
   - 📄 Resumen detallado
   - ⭐ Puntos clave
   - ✅ Tareas accionables

---

## 🔗 URLs

| Servicio | URL | Puerto |
|----------|-----|--------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:5000 | 5000 |
| API Health | http://localhost:5000/health | 5000 |

---

## ❓ Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| **Puerto 3000 ocupado** | Cambia en `frontend/.env`: `PORT=3001` |
| **API Key inválida** | Verifica en platform.openai.com |
| **Conexión denegada** | Asegúrate que ambos servicios están corriendo |
| **Archivo muy grande** | Máximo 100MB, comprime el audio |

---

## 📚 Documentación Completa

Ver [README.md](./README.md)

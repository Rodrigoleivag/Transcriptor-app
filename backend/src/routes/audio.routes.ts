import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
    deleteTranscription,
    getAllTranscriptions,
    getTranscription,
    processAudioFile,
} from '../services/audio.service';

const router = Router();

// Configure multer for audio uploads
const upload = multer({
  dest: path.join(__dirname, '../../uploads'),
  fileFilter: (req, file, cb) => {
    const allowedMimes = new Set([
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'audio/vnd.wave',
      'audio/ogg',
      'audio/webm',
      'audio/mp4',
      'audio/x-m4a',
      'audio/aac',
      'application/octet-stream',
    ]);

    const allowedExt = new Set(['.mp3', '.wav', '.ogg', '.webm', '.m4a', '.mp4', '.aac']);
    const fileExt = path.extname(file.originalname || '').toLowerCase();
    const mime = (file.mimetype || '').toLowerCase();

    const isAllowed = allowedMimes.has(mime) || allowedExt.has(fileExt) || mime.startsWith('audio/');

    console.log(`📁 upload file: name=${file.originalname}, mime=${mime}, ext=${fileExt}, allowed=${isAllowed}`);

    if (isAllowed) {
      cb(null, true);
    } else {
      const msg = `Invalid file type. Only audio files are allowed. got mime=${mime}, ext=${fileExt}`;
      cb(new Error(msg));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// Upload and process audio
router.post('/upload', upload.single('audio'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log(`📦 Processing file: ${req.file.originalname}`);
    
    const result = await processAudioFile(req.file.path, req.file.originalname);

    res.json({
      success: true,
      data: result,
      message: 'Audio processed successfully',
    });
  } catch (error: any) {
    // Manejo de errores enriquecido para el cliente
    const status = error.status || 500;
    const message = error.message || 'Error processing audio';
    console.error(`🎯 /api/audio/upload failed [${status}] ${message}`);

    return res.status(status).json({
      success: false,
      error: message,
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
});

// Get transcription by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transcription = await getTranscription(req.params.id);

    if (!transcription) {
      return res.status(404).json({ error: 'Transcription not found' });
    }

    res.json({
      success: true,
      data: transcription,
    });
  } catch (error) {
    next(error);
  }
});

// Get all transcriptions
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transcriptions = await getAllTranscriptions();

    res.json({
      success: true,
      data: transcriptions,
      count: transcriptions.length,
    });
  } catch (error) {
    next(error);
  }
});

// Delete transcription
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteTranscription(req.params.id);

    res.json({
      success: true,
      message: 'Transcription deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

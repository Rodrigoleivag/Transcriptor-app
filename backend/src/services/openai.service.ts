import * as fs from 'fs';
import OpenAI from 'openai';

let openai: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
};

export interface TranscriptionResult {
  text: string;
  duration?: number;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  actionableTasks: {
    keyPoint: string;
    tasks: string[];
  }[];
}

export const transcribeAudio = async (filepath: string): Promise<TranscriptionResult> => {
  const client = getOpenAIClient();

  const maxAttempts = 3;
  let attempt = 0;

  while (true) {
    attempt += 1;
    const audioFile = fs.createReadStream(filepath);

    try {
      const response = await client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'es',
      });

      if (!response?.text) {
        throw new Error(`OpenAI transcription result is empty (response: ${JSON.stringify(response).slice(0, 500)})`);
      }

      return { text: response.text };
    } catch (error: any) {
      const message = error?.message || 'Failed to transcribe audio';
      const isConnectionError = message.toLowerCase().includes('connection error') || message.toLowerCase().includes('no-response-data');

      console.error(`Transcription error (attempt ${attempt}/${maxAttempts}):`, message, error?.response?.data || 'no-response-data');

      if (attempt >= maxAttempts || !isConnectionError) {
        if (isConnectionError) {
          throw new Error('Transcription failed after retries: Connection error with OpenAI API. Revisa tu conexión y provisión de clave.');
        }
        throw new Error(`Transcription failed: ${message}`);
      }

      // Re-intentar si hay fallo de conexión
      const delayMs = 1000 * attempt;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }
  }
};

export const generateSummary = async (transcription: string): Promise<SummaryResult> => {
  const client = getOpenAIClient();

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en análisis de contenido. Analiza el siguiente texto transcrito y proporciona:
1. Un resumen conciso (2-3 párrafos)
2. Puntos clave destacados (lista de 5-7 puntos principales)
3. Para cada punto clave, genera 2-3 tareas accionables

Responde en JSON con la siguiente estructura:
{
  "summary": "resumen aquí",
  "keyPoints": ["punto1", "punto2", ...],
  "actionableTasks": [
    {"keyPoint": "punto1", "tasks": ["tarea1", "tarea2", "tarea3"]},
    ...
  ]
}`,
        },
        {
          role: 'user',
          content: `Por favor, analiza este texto transcrito:\n\n${transcription}`,
        },
      ],
      temperature: 0.7,
    });


    const raw = response?.choices?.[0]?.message?.content || '';
    const content = typeof raw === 'string' ? raw : JSON.stringify(raw);

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`Invalid response format from OpenAI. Raw output: ${content.slice(0, 1000)}`);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.summary || !Array.isArray(parsed.keyPoints) || !Array.isArray(parsed.actionableTasks)) {
      throw new Error(`Invalid summary payload from OpenAI: ${JSON.stringify(parsed).slice(0, 500)}`);
    }

    return {
      summary: parsed.summary,
      keyPoints: parsed.keyPoints,
      actionableTasks: parsed.actionableTasks,
    };
  } catch (error: any) {
    const message = error?.message || 'Failed to generate summary';
    console.error('Summary generation error:', message, error?.response?.data || 'no-response-data');
    throw new Error(`Summary generation failed: ${message}`);
  }
};

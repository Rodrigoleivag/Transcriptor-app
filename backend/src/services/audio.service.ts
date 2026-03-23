import * as fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { runInsert, runQuery } from '../database/db';
import { generateSummary, transcribeAudio } from './openai.service';

const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export interface AudioTranscription {
  id: string;
  filename: string;
  transcription: string;
  summary: string;
  keyPoints: string[];
  actionableTasks: any[];
  createdAt: string;
}

export const processAudioFile = async (filePath: string, filename: string): Promise<AudioTranscription> => {
  const id = uuidv4();

  try {
    // Step 1: Transcribe audio
    console.log(`📝 Step 1/3: Transcribing audio: ${filename}`);
    console.log(`   File path: ${filePath}`);
    console.log(`   File size: ${fs.statSync(filePath).size} bytes`);
    
    let transcriptionResult;
    try {
      transcriptionResult = await transcribeAudio(filePath);
    } catch (transcriptionError) {
      console.error('❌ Transcription failed:', transcriptionError);
      throw new Error(`Transcription failed: ${(transcriptionError as Error).message}`);
    }
    
    const transcription = transcriptionResult.text;
    console.log(`   ✅ Transcription completed. Length: ${transcription.length} characters`);

    // Step 2: Generate summary and key points
    console.log(`✨ Step 2/3: Generating summary and actionable tasks...`);
    let summaryResult;
    try {
      summaryResult = await generateSummary(transcription);
    } catch (summaryError) {
      console.error('❌ Summary generation failed:', summaryError);
      throw new Error(`Summary generation failed: ${(summaryError as Error).message}`);
    }
    console.log(`   ✅ Summary generated. Key points: ${summaryResult.keyPoints.length}`);

    // Step 3: Save to database
    console.log(`💾 Step 3/3: Saving to database...`);
    const query = `
      INSERT INTO transcriptions (
        id, filename, originalAudio, transcription, summary, keyPoints, actionableTasks, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    await runInsert(query, [
      id,
      filename,
      filePath,
      transcription,
      summaryResult.summary,
      JSON.stringify(summaryResult.keyPoints),
      JSON.stringify(summaryResult.actionableTasks),
    ]);

    // Step 4: Clean up uploaded file
    fs.unlinkSync(filePath);
    console.log(`✅ Audio processing completed successfully!`);

    return {
      id,
      filename,
      transcription,
      summary: summaryResult.summary,
      keyPoints: summaryResult.keyPoints,
      actionableTasks: summaryResult.actionableTasks,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error('❌ Error processing audio:', error);
    throw error;
  }
};

export const getTranscription = async (id: string): Promise<AudioTranscription | null> => {
  const query = 'SELECT * FROM transcriptions WHERE id = ?';
  const rows = await runQuery(query, [id]);

  if (rows && rows.length > 0) {
    const row = rows[0];
    return {
      id: row.id,
      filename: row.filename,
      transcription: row.transcription,
      summary: row.summary,
      keyPoints: JSON.parse(row.keyPoints),
      actionableTasks: JSON.parse(row.actionableTasks),
      createdAt: row.createdAt,
    };
  }

  return null;
};

export const getAllTranscriptions = async (): Promise<AudioTranscription[]> => {
  const query = 'SELECT * FROM transcriptions ORDER BY createdAt DESC LIMIT 50';
  const rows = await runQuery(query);

  return rows.map((row: any) => ({
    id: row.id,
    filename: row.filename,
    transcription: row.transcription,
    summary: row.summary,
    keyPoints: JSON.parse(row.keyPoints),
    actionableTasks: JSON.parse(row.actionableTasks),
    createdAt: row.createdAt,
  }));
};

export const deleteTranscription = async (id: string): Promise<boolean> => {
  const query = 'DELETE FROM transcriptions WHERE id = ?';
  await runInsert(query, [id]);
  return true;
};

import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AudioUpload from '../components/AudioUpload';
import Loading from '../components/Loading';
import Results from '../components/Results';

interface TranscriptionResult {
  id: string;
  filename: string;
  transcription: string;
  summary: string;
  keyPoints: string[];
  actionableTasks: {
    keyPoint: string;
    tasks: string[];
  }[];
  createdAt: string;
}

const Home: React.FC = () => {
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    const loadingToast = toast.loading('📤 Subiendo archivo...');

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const text = errData?.error || 'Error al procesar el audio';
        throw new Error(text);
      }

      const data = await response.json();
      if (!data?.success) {
        throw new Error(data?.error || 'Error al procesar el audio');
      }

      setResult(data.data);
      toast.success('✅ ¡Audio procesado correctamente!', { id: loadingToast });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('❌ Error al procesar el audio. Intenta de nuevo.', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewUpload = () => {
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          🎙️ Transforma tus Audios en Tareas
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Sube tu audio, obten una transcripción completa, un resumen destacando los puntos clave
          y tareas accionables para cada punto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">🎵</div>
            <h3 className="font-semibold text-gray-900">Sube tu Audio</h3>
            <p className="text-sm text-gray-600 mt-2">MP3, WAV, OGG o WebM</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-blue-600" />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-900">Obtén Resumen</h3>
            <p className="text-sm text-gray-600 mt-2">Puntos clave y tareas</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!result ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AudioUpload onUpload={handleUpload} isLoading={isLoading} />
        </div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <div>
          <Results data={result} />
          <div className="text-center mt-8">
            <button
              onClick={handleNewUpload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              🎵 Procesar otro audio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: transcription, isLoading, error } = useQuery({
    queryKey: ['transcription', id],
    queryFn: async () => {
      const response = await fetch(`/api/audio/${id}`);
      if (!response.ok) throw new Error('Error fetching transcription');
      const result = await response.json();
      return result.data as TranscriptionResult;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-gray-600 mt-4">Cargando transcripción...</p>
      </div>
    );
  }

  if (error || !transcription) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-red-600 font-semibold mb-4">❌ Error al cargar la transcripción</p>
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al historial
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/history')}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al historial
      </button>

      <Results data={transcription} />
    </div>
  );
};

export default Detail;

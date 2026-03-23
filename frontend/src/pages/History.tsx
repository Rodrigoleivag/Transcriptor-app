import { useQuery } from '@tanstack/react-query';
import { FileText, Trash2 } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Transcription {
  id: string;
  filename: string;
  summary: string;
  createdAt: string;
}

const History: React.FC = () => {
  const { data: transcriptions = [], isLoading, refetch } = useQuery({
    queryKey: ['transcriptions'],
    queryFn: async () => {
      const response = await fetch('/api/audio');
      if (!response.ok) throw new Error('Error fetching transcriptions');
      const result = await response.json();
      return result.data as Transcription[];
    },
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta transcripción?')) {
      return;
    }

    try {
      const response = await fetch(`/api/audio/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error deleting');
      toast.success('✅ Transcripción eliminada');
      refetch();
    } catch (error) {
      toast.error('❌ Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📚 Historial</h2>
        <p className="text-gray-600">Tus transcripciones guardadas</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 mt-4">Cargando historial...</p>
        </div>
      ) : transcriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay transcripciones</h3>
          <p className="text-gray-600">
            Sube tu primer audio para comenzar a crear transcripciones
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
          >
            🎵 Ir a subir
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {transcriptions.map((transcription) => (
            <Link
              key={transcription.id}
              to={`/detail/${transcription.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    📄 {transcription.filename}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(transcription.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(transcription.id);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5 text-red-600 hover:text-red-700" />
                </button>
              </div>
              <p className="text-gray-600 line-clamp-2">{transcription.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

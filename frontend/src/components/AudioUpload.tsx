import { Music, Upload } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface AudioUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

const AudioUpload: React.FC<AudioUploadProps> = ({ onUpload, isLoading = false }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4'];

        if (!allowedTypes.includes(file.type)) {
          toast.error('❌ Tipo de archivo no válido. Solo se aceptan audios.');
          return;
        }

        if (file.size > 100 * 1024 * 1024) {
          toast.error('❌ Archivo demasiado grande (máx. 100MB)');
          return;
        }

        onUpload(file);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      audio: ['.mp3', '.wav', '.ogg', '.webm', '.m4a'],
    },
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
        isDragActive
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400 bg-gray-50'
      } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <Music className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isDragActive ? '📤 Suelta tu audio aquí' : '🎵 Arrastra tu audio aquí'}
      </h3>
      <p className="text-gray-600 mb-2">o</p>
      <button
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        disabled={isLoading}
      >
        <Upload className="w-5 h-5" />
        {isLoading ? 'Procesando...' : 'Seleccionar archivo'}
      </button>
      <p className="text-sm text-gray-500 mt-4">
        Formatos soportados: MP3, WAV, OGG, WebM (máx. 100MB)
      </p>
    </div>
  );
};

export default AudioUpload;

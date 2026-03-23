import { Zap } from 'lucide-react';
import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Procesando tu audio...' }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
          <Zap className="absolute inset-2 m-auto w-7 h-7 text-blue-600 animate-pulse" />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900 mb-2">{message}</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>⏳ Transcribiendo audio...</p>
            <p>✨ Generando resumen...</p>
            <p>📋 Elaborando tareas...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

import { CheckCircle, ClipboardList, Zap } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AudioTranscription {
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

interface ResultsProps {
  data: AudioTranscription;
}

const Results: React.FC<ResultsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = React.useState<'summary' | 'transcript' | 'tasks'>('summary');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 fade-in">
      {/* Header */}
      <div className="mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{data.filename}</h2>
        <p className="text-sm text-gray-600">
          {new Date(data.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            activeTab === 'summary'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📋 Resumen
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            activeTab === 'transcript'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📝 Transcripción
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            activeTab === 'tasks'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          ✅ Tareas
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'summary' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Resumen
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <ReactMarkdown className="text-gray-700 leading-relaxed">
                {data.summary}
              </ReactMarkdown>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Puntos Clave
            </h4>
            <ul className="space-y-3">
              {data.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 bg-blue-50 rounded-lg p-3 border-l-4 border-blue-600"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'transcript' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcripción Completa</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data.transcription}</p>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Tareas Accionables
            </h3>
            <div className="space-y-6">
              {data.actionableTasks.map((group, groupIndex) => (
                <div key={groupIndex} className="border rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-900 mb-3 text-blue-600">{group.keyPoint}</h4>
                  <ul className="space-y-2">
                    {group.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-green-600 rounded mt-0.5 cursor-pointer"
                          id={`task-${groupIndex}-${taskIndex}`}
                        />
                        <label
                          htmlFor={`task-${groupIndex}-${taskIndex}`}
                          className="text-gray-700 cursor-pointer flex-1"
                        >
                          {task}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;

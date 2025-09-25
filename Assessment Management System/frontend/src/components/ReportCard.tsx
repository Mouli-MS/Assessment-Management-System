import React from 'react';
import { Download, Calendar } from 'lucide-react';

interface ReportCardProps {
  session_id: string;
  download_url: string;
  generated_at: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ session_id, download_url, generated_at }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {session_id.slice(-3)}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {session_id}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={12} />
          <span>{new Date(generated_at).toLocaleDateString()}</span>
        </div>
      </div>
      <a
        href={`http://localhost:5000${download_url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors"
      >
        <Download size={16} />
        <span>Download PDF</span>
      </a>
    </div>
  );
};

export default ReportCard;

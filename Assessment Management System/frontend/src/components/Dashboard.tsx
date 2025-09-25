import React, { useState } from 'react';
import ReportGenerationForm from './ReportGenerationForm';
import ReportCard from './ReportCard';
import Card from './ui/Card';

interface DashboardProps {
  token: string;
  user: { id: string; email: string; name: string };
  onLogout: () => void;
}

interface GeneratedReport {
  session_id: string;
  download_url: string;
  generated_at: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token, user, onLogout }) => {
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  const handleReportGenerated = (report: GeneratedReport) => {
    setGeneratedReports(prev => [report, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Welcome, {user.name}!
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Generation Section */}
          <div className="lg:col-span-2">
            <ReportGenerationForm token={token} onReportGenerated={handleReportGenerated} />
          </div>

          {/* Generated Reports Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Generated Reports
              </h2>

              {generatedReports.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No reports generated yet. Try generating one above!
                </p>
              ) : (
                <div className="space-y-3">
                  {generatedReports.map((report, index) => (
                    <ReportCard
                      key={index}
                      session_id={report.session_id}
                      download_url={report.download_url}
                      generated_at={report.generated_at}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import axios from 'axios';

interface ReportGenerationFormProps {
  token: string;
  onReportGenerated: (report: { session_id: string; download_url: string; generated_at: string }) => void;
}

const ReportGenerationForm: React.FC<ReportGenerationFormProps> = ({ token, onReportGenerated }) => {
  const [sessionId, setSessionId] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const availableSessionIds = ['session_001', 'session_002'];

  const handleGenerateReport = async () => {
    setStatusMessage(null);

    if (!sessionId.trim()) {
      setStatusMessage('Please enter a valid session ID.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/generate-report',
        { session_id: sessionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatusMessage('Report generated successfully.');
      const newReport = {
        session_id: sessionId,
        download_url: response.data.download_url,
        generated_at: new Date().toISOString()
      };
      onReportGenerated(newReport);
      setSessionId(''); // Clear the input
    } catch (error: any) {
      setStatusMessage(error.response?.data?.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Generate PDF Report
      </h1>

      <div className="max-w-md">
        <label htmlFor="sessionId" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Session ID
        </label>
        <input
          type="text"
          id="sessionId"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="input-field mb-4"
          placeholder="Enter or select session ID"
          list="sessionIds"
          autoComplete="off"
        />
        <datalist id="sessionIds">
          {availableSessionIds.map((id) => (
            <option key={id} value={id} />
          ))}
        </datalist>

        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>

        {statusMessage && (
          <div
            className={`mt-4 p-4 rounded-xl ${
              statusMessage.toLowerCase().includes('success')
                ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerationForm;

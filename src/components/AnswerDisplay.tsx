
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AnswerDisplayProps {
  answer: string | null;
  error: string | null;
  isLoading: boolean;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer, error, isLoading }) => {
  if (!answer && !error && !isLoading) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span>Answer</span>
      </h3>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-700">Analyzing your image...</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-start space-x-3 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error occurred</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
        
        {answer && !isLoading && (
          <div className="text-gray-800">
            <p className="leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerDisplay;

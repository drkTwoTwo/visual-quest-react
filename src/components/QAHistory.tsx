
import React, { useState } from 'react';
import { History, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface QAItem {
  id: string;
  image: string;
  question: string;
  answer: string;
  timestamp: Date;
}

interface QAHistoryProps {
  history: QAItem[];
  onClearHistory: () => void;
}

const QAHistory: React.FC<QAHistoryProps> = ({ history, onClearHistory }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <History className="w-5 h-5 text-gray-600" />
          <span>Recent Questions ({history.length})</span>
        </h3>
        <button
          onClick={onClearHistory}
          className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {history.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={item.image}
                    alt="Question image"
                    className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.question}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.timestamp.toLocaleString()}
                    </p>
                    {!isExpanded && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {item.answer}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 animate-fade-in">
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Question:</p>
                    <p className="text-sm text-gray-800 mb-3">{item.question}</p>
                    <p className="text-sm font-medium text-gray-700 mb-2">Answer:</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QAHistory;

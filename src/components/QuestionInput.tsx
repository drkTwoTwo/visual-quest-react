
import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionInputProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasImage: boolean;
}

const SAMPLE_QUESTIONS = [
  "What objects are visible in this image?",
  "Describe the main subject of this image.",
  "What colors are prominent in this image?",
  "What is happening in this scene?",
  "What is the setting or location shown?",
  "Are there any people in this image?",
  "What is the mood or atmosphere of this image?",
  "What details can you observe in the background?",
];

const QuestionInput: React.FC<QuestionInputProps> = ({
  question,
  onQuestionChange,
  onSubmit,
  isLoading,
  hasImage,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (hasImage && !question) {
      // Generate random suggestions when image is uploaded
      const shuffled = [...SAMPLE_QUESTIONS].sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 3));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [hasImage, question]);

  const handleSuggestionClick = (suggestion: string) => {
    onQuestionChange(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && hasImage) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder={hasImage ? "Ask a question about your image..." : "Upload an image first to ask questions"}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows={3}
            disabled={!hasImage}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!question.trim() || !hasImage || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            'Ask Question'
          )}
        </Button>
      </form>

      {showSuggestions && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4" />
            <span>Suggested questions:</span>
          </div>
          <div className="grid gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm transition-all duration-200 hover:shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionInput;

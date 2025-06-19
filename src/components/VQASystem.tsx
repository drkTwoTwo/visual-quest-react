
import React, { useState, useCallback } from 'react';
import { Brain, Eye } from 'lucide-react';
import ImageUpload from './ImageUpload';
import QuestionInput from './QuestionInput';
import AnswerDisplay from './AnswerDisplay';
import QAHistory from './QAHistory';
import { useToast } from '@/hooks/use-toast';

interface QAItem {
  id: string;
  image: string;
  question: string;
  answer: string;
  timestamp: Date;
}

const VQASystem: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<QAItem[]>([]);
  const { toast } = useToast();

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setAnswer(null);
    setError(null);
    setQuestion('');
    console.log('Image selected:', file.name, file.size);
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedImage(null);
    setQuestion('');
    setAnswer(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedImage || !question.trim()) {
      toast({
        title: "Missing Information",
        description: "Please upload an image and enter a question.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      console.log('Submitting VQA request:', { image: selectedImage.name, question });
      
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('question', question);

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const answerText = data.answer || 'No answer received from the backend.';
      
      setAnswer(answerText);
      
      // Add to history
      const imageUrl = URL.createObjectURL(selectedImage);
      const newHistoryItem: QAItem = {
        id: Date.now().toString(),
        image: imageUrl,
        question,
        answer: answerText,
        timestamp: new Date(),
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);
      
      toast({
        title: "Analysis Complete",
        description: "Your image has been analyzed successfully!",
      });
      
    } catch (err) {
      console.error('VQA request failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to analyze image: ${errorMessage}`);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, question, toast]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "All previous questions and answers have been removed.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Visual Q&A</h1>
            <div className="p-3 bg-indigo-600 rounded-full">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image and ask questions about it. Our AI will analyze the visual content and provide detailed answers.
          </p>
        </div>

        {/* Main VQA Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Image Upload Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <span>Upload Image</span>
                </h2>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  onClearImage={handleClearImage}
                />
              </div>

              {/* Question Input Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <span>Ask Question</span>
                </h2>
                <QuestionInput
                  question={question}
                  onQuestionChange={setQuestion}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  hasImage={!!selectedImage}
                />
              </div>

              {/* Answer Display */}
              <AnswerDisplay
                answer={answer}
                error={error}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* History Section */}
          <QAHistory history={history} onClearHistory={handleClearHistory} />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Connected to VQA backend at <code className="bg-gray-100 px-2 py-1 rounded">http://127.0.0.1:5000/predict</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VQASystem;

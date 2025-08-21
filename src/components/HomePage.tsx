import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Brain, Zap, Target } from 'lucide-react';

const HomePage = () => {
  const [topic, setTopic] = useState('');
  const [extractedText, setExtractedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (topic.trim()) {
      navigate('/settings', { state: { topic: topic.trim(), context: extractedText } });
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://backend-ct6p.onrender.com/api/readImage', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to process image');
      
      const data = await response.json();
      setExtractedText(data.extracted_text || 'No text found in the image');
      setTopic(data.extracted_text || '');
    } catch (error) {
      console.error('Error uploading image:', error);
      setExtractedText('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const popularTopics = [
    'Machine Learning',
    'React Development', 
    'World History',
    'Biology',
    'JavaScript',
    'Space Science'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              QuizForge AI
            </h1>
          </div>
          <Button variant="outline" className="rounded-xl">
            Leaderboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Generate{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Quizzes Instantly
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter any topic and get personalized quiz questions in seconds. 
              Perfect for studying, teaching, or just having fun!
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="card-elevated p-8 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Enter any topic (e.g., Machine Learning, Harry Potter...)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStartQuiz()}
                  className="pl-12 h-14 text-lg rounded-xl border-2 focus:border-primary"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-4 rounded-lg"
                >
                  {isLoading ? 'Processing...' : 'Upload Image'}
                </Button>
              </div>
              {extractedText && (
                <div className="p-4 bg-secondary/30 rounded-lg text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Extracted Text:</p>
                  <p className="break-words">{extractedText}</p>
                </div>
              )}
              <Button 
                onClick={handleStartQuiz}
                disabled={!topic.trim()}
                className="btn-primary w-full h-14 text-lg rounded-xl font-semibold"
              >
                <Zap className="w-5 h-5 mr-2" />
                Generate Quiz
              </Button>
            </div>
          </div>

          {/* Popular Topics */}
          <div className="animate-fade-in">
            <p className="text-sm text-muted-foreground mb-4">Popular topics:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {popularTopics.map((popularTopic) => (
                <button
                  key={popularTopic}
                  onClick={() => setTopic(popularTopic)}
                  className="px-4 py-2 bg-secondary hover:bg-primary/10 rounded-full text-sm font-medium transition-colors"
                >
                  {popularTopic}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 animate-fade-in">
            <div className="card-elevated text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">AI-Generated</h3>
              <p className="text-sm text-muted-foreground">
                Smart questions tailored to your chosen topic
              </p>
            </div>
            <div className="card-elevated text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-xl flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get your quiz ready in seconds, not minutes
              </p>
            </div>
            <div className="card-elevated text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-400 rounded-xl flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Choose difficulty, length, and timer options
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
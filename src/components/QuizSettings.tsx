import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Settings, Clock, Hash, Target } from 'lucide-react';

interface QuizSettings {
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timer: boolean;
  timerType: 'perQuestion' | 'total';
  timeLimit: number;
}

const QuizSettings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic || '';

  const [settings, setSettings] = useState<QuizSettings>({
    numberOfQuestions: 10,
    difficulty: 'medium',
    timer: false,
    timerType: 'perQuestion',
    timeLimit: 30
  });

  const handleStartQuiz = () => {
    navigate('/quiz', { state: { topic, settings } });
  };

  const questionOptions = [5, 10, 15, 20];
  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'from-green-400 to-green-500' },
    { value: 'medium', label: 'Medium', color: 'from-yellow-400 to-orange-500' },
    { value: 'hard', label: 'Hard', color: 'from-red-400 to-red-500' }
  ] as const;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Quiz Settings</h1>
            <p className="text-muted-foreground">
              Topic: <span className="font-medium text-primary">{topic}</span>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Number of Questions */}
            <div className="card-elevated space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Number of Questions</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {questionOptions.map((num) => (
                  <button
                    key={num}
                    onClick={() => setSettings({ ...settings, numberOfQuestions: num })}
                    className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                      settings.numberOfQuestions === num
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="card-elevated space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-light rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Difficulty Level</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ ...settings, difficulty: option.value })}
                    className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                      settings.difficulty === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-full h-2 bg-gradient-to-r ${option.color} rounded-full mb-2`} />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Settings */}
            <div className="card-elevated space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-success to-green-400 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Timer Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="timer"
                    checked={settings.timer}
                    onChange={(e) => setSettings({ ...settings, timer: e.target.checked })}
                    className="w-5 h-5 rounded-md"
                  />
                  <label htmlFor="timer" className="font-medium">Enable Timer</label>
                </div>

                {settings.timer && (
                  <div className="space-y-4 pl-9">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSettings({ ...settings, timerType: 'perQuestion' })}
                        className={`p-3 rounded-xl border-2 transition-all text-sm ${
                          settings.timerType === 'perQuestion'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        Per Question
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, timerType: 'total' })}
                        className={`p-3 rounded-xl border-2 transition-all text-sm ${
                          settings.timerType === 'total'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        Total Quiz
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Time Limit:</span>
                      <select
                        value={settings.timeLimit}
                        onChange={(e) => setSettings({ ...settings, timeLimit: parseInt(e.target.value) })}
                        className="px-3 py-2 border border-border rounded-lg bg-background"
                      >
                        {settings.timerType === 'perQuestion' ? (
                          <>
                            <option value={15}>15 seconds</option>
                            <option value={30}>30 seconds</option>
                            <option value={45}>45 seconds</option>
                            <option value={60}>1 minute</option>
                          </>
                        ) : (
                          <>
                            <option value={300}>5 minutes</option>
                            <option value={600}>10 minutes</option>
                            <option value={900}>15 minutes</option>
                            <option value={1200}>20 minutes</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary & Start */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Quiz Summary</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Topic:</span>
                  <span className="font-medium">{topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="font-medium">{settings.numberOfQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-medium capitalize">{settings.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timer:</span>
                  <span className="font-medium">
                    {settings.timer 
                      ? `${settings.timeLimit}s ${settings.timerType === 'perQuestion' ? 'per question' : 'total'}`
                      : 'Disabled'
                    }
                  </span>
                </div>
              </div>
            </Card>

            <Button 
              onClick={handleStartQuiz}
              className="btn-primary w-full h-14 text-lg rounded-xl font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Questions will be generated based on your topic and settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSettings;
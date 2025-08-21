import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock, ChevronRight, Flag } from 'lucide-react';
import { generateQuiz } from '@/utils/quizApi';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QuizData {
  topic: string;
  questions: Question[];
}

const QuizInterface = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, context, settings } = location.state || {};

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      setIsLoading(true);
      try {
        const quiz = await generateQuiz(topic,context, settings);
        setQuizData(quiz);
        
        if (settings?.timer) {
          setTimeLeft(settings.timerType === 'perQuestion' ? settings.timeLimit : settings.timeLimit);
        }
      } catch (error) {
        console.error('Failed to generate quiz:', error);
      }
      setIsLoading(false);
    };

    if (topic && settings) {
      loadQuiz();
    }
  }, [topic, settings]);

  useEffect(() => {
    if (settings?.timer && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (settings.timerType === 'perQuestion') {
              handleNextQuestion();
              return settings.timeLimit;
            } else {
              handleFinishQuiz();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, settings, currentQuestion]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: answer });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      if (settings?.timer && settings.timerType === 'perQuestion') {
        setTimeLeft(settings.timeLimit);
      }
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      if (settings?.timer && settings.timerType === 'perQuestion') {
        setTimeLeft(settings.timeLimit);
      }
    }
  };

  const handleFinishQuiz = () => {
    const results = {
      topic,
      questions: quizData?.questions || [],
      answers: selectedAnswers,
      settings,
      totalQuestions: quizData?.questions.length || 0,
      answeredQuestions: Object.keys(selectedAnswers).length
    };
    navigate('/results', { state: results });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="text-xl font-semibold">Generating Your Quiz...</h3>
          <p className="text-muted-foreground">Creating {settings?.numberOfQuestions} questions about {topic}</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Failed to Generate Quiz</h3>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const currentQ = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/settings', { state: { topic } })}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{topic}</h1>
              <p className="text-muted-foreground">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {settings?.timer && (
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
            )}
            <Button 
              onClick={handleFinishQuiz}
              variant="outline"
              className="rounded-xl"
            >
              <Flag className="w-4 h-4 mr-2" />
              Finish
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3 rounded-full" />
        </div>

        {/* Question */}
        <div className="space-y-6">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6 leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="grid gap-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`quiz-option text-left ${
                    selectedAnswers[currentQuestion] === option ? 'selected' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                      selectedAnswers[currentQuestion] === option 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-border'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="rounded-xl"
            >
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              {Object.keys(selectedAnswers).length} of {quizData.questions.length} answered
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[currentQuestion]}
              className="btn-primary rounded-xl"
            >
              {currentQuestion === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
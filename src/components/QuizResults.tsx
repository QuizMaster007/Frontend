import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  RotateCcw, 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle,
  Eye,
  Lightbulb
} from 'lucide-react';
import { useState } from 'react';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, questions, answers, settings, totalQuestions, answeredQuestions } = location.state || {};
  
  const [showExplanations, setShowExplanations] = useState(false);

  // Calculate results
  const correctAnswers = questions?.filter((q: Question, index: number) => 
    answers[index] === q.answer
  ).length || 0;

  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const accuracy = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-success to-green-400';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-destructive to-red-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! 🎉';
    if (score >= 80) return 'Great job! 👏';
    if (score >= 70) return 'Well done! 👍';
    if (score >= 60) return 'Good effort! 💪';
    return 'Keep practicing! 📚';
  };

  const handleRetakeQuiz = () => {
    navigate('/settings', { state: { topic } });
  };

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">No Results Found</h3>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Quiz Complete!</h1>
          <p className="text-xl text-muted-foreground">
            Topic: <span className="font-semibold text-primary">{topic}</span>
          </p>
        </div>

        {/* Score Card */}
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getScoreColor(score)} flex items-center justify-center text-white`}>
              <div className="text-center">
                <div className="text-4xl font-bold">{score}%</div>
                <div className="text-sm opacity-90">Score</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold">{getScoreMessage(score)}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Correct</span>
              </div>
              <div className="text-2xl font-bold">{correctAnswers}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Incorrect</span>
              </div>
              <div className="text-2xl font-bold">{answeredQuestions - correctAnswers}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Total</span>
              </div>
              <div className="text-2xl font-bold">{totalQuestions}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{correctAnswers}/{totalQuestions} questions</span>
            </div>
            <Progress value={(correctAnswers / totalQuestions) * 100} className="h-3" />
          </div>
        </Card>

        {/* Quiz Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Quiz Settings
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty:</span>
                <span className="font-medium capitalize">{settings?.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions:</span>
                <span className="font-medium">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timer:</span>
                <span className="font-medium">
                  {settings?.timer ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Performance
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accuracy:</span>
                <span className="font-medium">{accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Answered:</span>
                <span className="font-medium">{answeredQuestions}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completion:</span>
                <span className="font-medium">{Math.round((answeredQuestions / totalQuestions) * 100)}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Review Answers */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Review Answers
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowExplanations(!showExplanations)}
              className="rounded-xl"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showExplanations ? 'Hide' : 'Show'} Explanations
            </Button>
          </div>

          <div className="space-y-4">
            {questions.map((question: Question, index: number) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.answer;
              const wasAnswered = userAnswer !== undefined;

              return (
                <div key={index} className="border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isCorrect ? 'bg-success text-white' : 
                      wasAnswered ? 'bg-destructive text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <div className="space-y-1 text-sm">
                        {wasAnswered && (
                          <p className={`flex items-center gap-2 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                            {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            Your answer: {userAnswer}
                          </p>
                        )}
                        {!isCorrect && (
                          <p className="flex items-center gap-2 text-success">
                            <CheckCircle className="w-4 h-4" />
                            Correct answer: {question.answer}
                          </p>
                        )}
                        {!wasAnswered && (
                          <p className="text-muted-foreground">Not answered</p>
                        )}
                      </div>
                      {showExplanations && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetakeQuiz}
            className="btn-primary rounded-xl px-8"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="rounded-xl px-8"
          >
            <Home className="w-4 h-4 mr-2" />
            New Topic
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
// Mock API for quiz generation
// In a real app, this would call your backend API

interface QuizSettings {
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timer: boolean;
  timerType: 'perQuestion' | 'total';
  timeLimit: number;
  context?: string;
}

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

// Mock question templates based on difficulty and topic
const generateMockQuestions = (topic: string, count: number, difficulty: string): Question[] => {
  const questionTemplates = {
    'Machine Learning': [
      {
        question: "Which algorithm is commonly used for classification tasks?",
        options: ["Linear Regression", "Decision Tree", "K-Means", "PCA"],
        answer: "Decision Tree",
        explanation: "Decision trees are widely used for classification as they split data based on features to classify outcomes."
      },
      {
        question: "What does 'overfitting' mean in machine learning?",
        options: ["Model performs well on training but poorly on test data", "Model has too few parameters", "Model trains too slowly", "Model has high bias"],
        answer: "Model performs well on training but poorly on test data",
        explanation: "Overfitting occurs when a model learns the training data too well, including noise, leading to poor generalization."
      },
      {
        question: "Which metric is best for imbalanced classification problems?",
        options: ["Accuracy", "F1-Score", "Mean Squared Error", "R-squared"],
        answer: "F1-Score",
        explanation: "F1-Score balances precision and recall, making it ideal for imbalanced datasets where accuracy can be misleading."
      },
      {
        question: "What is the purpose of cross-validation?",
        options: ["To increase model complexity", "To evaluate model performance", "To reduce training time", "To add more features"],
        answer: "To evaluate model performance",
        explanation: "Cross-validation helps assess how well a model generalizes to unseen data by testing on different data splits."
      },
      {
        question: "Which technique helps prevent overfitting?",
        options: ["Adding more layers", "Regularization", "Increasing learning rate", "Using more complex models"],
        answer: "Regularization",
        explanation: "Regularization techniques like L1/L2 add penalties to prevent models from becoming too complex and overfitting."
      }
    ],
    'React Development': [
      {
        question: "What is the virtual DOM in React?",
        options: ["A copy of the real DOM kept in memory", "A CSS framework", "A database", "A routing library"],
        answer: "A copy of the real DOM kept in memory",
        explanation: "The virtual DOM is React's representation of the UI kept in memory and synced with the real DOM for efficient updates."
      },
      {
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        answer: "useEffect",
        explanation: "useEffect is used to perform side effects like data fetching, subscriptions, or manually changing the DOM."
      },
      {
        question: "What is JSX?",
        options: ["A JavaScript extension", "A CSS preprocessor", "A database query language", "A testing framework"],
        answer: "A JavaScript extension",
        explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React components."
      },
      {
        question: "How do you pass data from parent to child component?",
        options: ["Using state", "Using props", "Using context", "Using refs"],
        answer: "Using props",
        explanation: "Props are the primary way to pass data from parent components to child components in React."
      },
      {
        question: "What is the purpose of keys in React lists?",
        options: ["For styling", "For performance optimization", "For validation", "For routing"],
        answer: "For performance optimization",
        explanation: "Keys help React identify which list items have changed, been added, or removed, enabling efficient re-rendering."
      }
    ],
    'World History': [
      {
        question: "When did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        answer: "1945",
        explanation: "World War II ended in 1945 with Japan's surrender on September 2, following the atomic bombings and Soviet invasion."
      },
      {
        question: "Who was the first person to circumnavigate the globe?",
        options: ["Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan's crew", "James Cook"],
        answer: "Ferdinand Magellan's crew",
        explanation: "While Magellan died during the voyage, his crew completed the first circumnavigation in 1522."
      },
      {
        question: "The Renaissance began in which country?",
        options: ["France", "England", "Italy", "Spain"],
        answer: "Italy",
        explanation: "The Renaissance began in Italy in the 14th century, starting in city-states like Florence and Venice."
      },
      {
        question: "What caused the fall of the Roman Empire?",
        options: ["Single decisive battle", "Economic decline and barbarian invasions", "Natural disasters", "Religious conflicts"],
        answer: "Economic decline and barbarian invasions",
        explanation: "The fall was gradual, caused by economic problems, political instability, and pressure from barbarian tribes."
      },
      {
        question: "The Industrial Revolution started in which century?",
        options: ["16th century", "17th century", "18th century", "19th century"],
        answer: "18th century",
        explanation: "The Industrial Revolution began in Britain in the mid-18th century with innovations in textile manufacturing and steam power."
      }
    ],
    default: [
      {
        question: `What is a key characteristic of ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option B",
        explanation: `This is an explanation about ${topic} and why this answer is correct.`
      },
      {
        question: `Which of the following best describes ${topic}?`,
        options: ["Description A", "Description B", "Description C", "Description D"],
        answer: "Description C",
        explanation: `This explanation provides context about ${topic} and the reasoning behind this answer.`
      },
      {
        question: `What is the most important aspect of ${topic}?`,
        options: ["Aspect A", "Aspect B", "Aspect C", "Aspect D"],
        answer: "Aspect A",
        explanation: `This aspect is crucial to understanding ${topic} because of its fundamental importance.`
      }
    ]
  };

  const questions = questionTemplates[topic as keyof typeof questionTemplates] || questionTemplates.default;
  
  // Shuffle and take the requested number of questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const generateQuiz = async (topic: string, context: string, settings: QuizSettings): Promise<QuizData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log("settings",settings)
  // const questions = generateMockQuestions(topic, settings.numberOfQuestions, settings.difficulty);
  const questions = await fetch('https://backend-ct6p.onrender.com/api/generateQuiz', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ topic, num_questions: settings.numberOfQuestions, difficulty: settings.difficulty,context: context })
  });
  const data = await questions.json();
  console.log(data);
  return {
    topic,
    questions: data.questions
  };
};
export interface MockQuestion {
  id: string;
  text: string;
  expectedKeywords: string[];
}

export interface AnswerSubmission {
  questionId: string;
  answerText: string;
}

export interface InterviewResult {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
}

const QUESTION_BANK: Record<string, MockQuestion[]> = {
  sde: [
    { id: "sde_1", text: "Explain the difference between a process and a thread.", expectedKeywords: ["memory", "shared", "isolation", "context switch"] },
    { id: "sde_2", text: "How does garbage collection work in modern languages?", expectedKeywords: ["reference counting", "mark and sweep", "memory leak", "heap"] },
    { id: "sde_3", text: "What is a Hash Map and what is its time complexity?", expectedKeywords: ["key", "value", "O(1)", "collision", "array"] },
    { id: "sde_4", text: "Explain the concepts of RESTful APIs.", expectedKeywords: ["stateless", "HTTP", "GET", "POST", "JSON"] },
    { id: "sde_5", text: "What are SOLID principles?", expectedKeywords: ["single responsibility", "open-closed", "liskov", "interface segregation", "dependency inversion"] },
    { id: "sde_6", text: "How would you design a URL shortener?", expectedKeywords: ["base62", "database", "redirect", "cache"] },
    { id: "sde_7", text: "What is the difference between TCP and UDP?", expectedKeywords: ["reliable", "connectionless", "handshake", "packets", "overhead"] },
    { id: "sde_8", text: "Explain how DNS works.", expectedKeywords: ["ip address", "domain", "resolver", "root server", "cache"] },
    { id: "sde_9", text: "What is dynamic programming?", expectedKeywords: ["memoization", "overlapping subproblems", "optimal substructure"] },
    { id: "sde_10", text: "How do you prevent SQL injection?", expectedKeywords: ["prepared statements", "parameterized queries", "sanitize", "escape"] }
  ],
  data: [
    { id: "data_1", text: "Explain the difference between supervised and unsupervised learning.", expectedKeywords: ["labeled", "unlabeled", "classification", "clustering"] },
    { id: "data_2", text: "What is overfitting and how do you prevent it?", expectedKeywords: ["regularization", "dropout", "validation", "cross-validation", "noise"] },
    { id: "data_3", text: "Explain the concept of P-value.", expectedKeywords: ["null hypothesis", "significance", "probability", "reject"] },
    { id: "data_4", text: "What is a confusion matrix?", expectedKeywords: ["true positive", "false positive", "recall", "precision"] },
    { id: "data_5", text: "How do you handle missing values in a dataset?", expectedKeywords: ["imputation", "mean", "median", "drop", "predict"] },
    { id: "data_6", text: "Explain the Bias-Variance tradeoff.", expectedKeywords: ["underfitting", "overfitting", "error", "complexity"] },
    { id: "data_7", text: "What is a Random Forest?", expectedKeywords: ["decision trees", "ensemble", "bagging", "majority vote"] },
    { id: "data_8", text: "Explain gradient descent.", expectedKeywords: ["optimization", "loss function", "learning rate", "minimum"] },
    { id: "data_9", text: "What is cross-validation?", expectedKeywords: ["k-fold", "training set", "test set", "generalization"] },
    { id: "data_10", text: "Explain the difference between L1 and L2 regularization.", expectedKeywords: ["lasso", "ridge", "sparsity", "weights", "penalty"] }
  ]
};

const DEFAULT_BANK = QUESTION_BANK["sde"];

export function generateQuestions(role: string, difficulty: string): MockQuestion[] {
  const normalizedRole = role.toLowerCase();
  const bank = QUESTION_BANK[normalizedRole] || DEFAULT_BANK;
  
  // Use difficulty to slightly alter the mock behavior
  const isHard = difficulty.toLowerCase() === "hard";
  return isHard ? bank.slice(0, 10).reverse() : bank.slice(0, 10);
}

export function scoreAnswers(questions: MockQuestion[], answers: AnswerSubmission[]): InterviewResult {
  let totalScore = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  answers.forEach(sub => {
    const q = questions.find(x => x.id === sub.questionId);
    if (!q) return;

    const answerLower = sub.answerText.toLowerCase();
    
    // Check keywords
    let matchCount = 0;
    q.expectedKeywords.forEach(kw => {
      if (answerLower.includes(kw.toLowerCase())) {
        matchCount++;
      }
    });

    // Score out of 10 for this question
    // If they hit 50% of keywords, they get 10/10. Otherwise proportional.
    const hitRate = matchCount / Math.max(1, (q.expectedKeywords.length / 2));
    let qScore = Math.min(10, hitRate * 10);
    
    // Penalty for very short answers
    if (answerLower.length < 20) {
      qScore = qScore * 0.5;
    }

    totalScore += qScore;

    if (qScore > 7) {
      if (!strengths.includes("Technical depth")) strengths.push("Technical depth");
    } else {
      if (!weaknesses.includes("Lacking specific terminology")) weaknesses.push("Lacking specific terminology");
    }
  });

  const finalScore = Math.min(100, Math.round((totalScore / (questions.length * 10)) * 100));

  let feedback = "";
  if (finalScore > 80) feedback = "Excellent performance! You clearly understand the core concepts.";
  else if (finalScore > 60) feedback = "Good effort, but you need to use more specific technical terminology in your answers.";
  else feedback = "You missed many key technical details. Focus on studying the foundational concepts deeper.";

  const tips = [
    "Always use standard terminology rather than vague descriptions.",
    "Structure your answers using the STAR method when applicable.",
    "Provide specific examples to back up your technical definitions."
  ];

  return {
    score: finalScore,
    feedback,
    strengths,
    weaknesses,
    tips
  };
}

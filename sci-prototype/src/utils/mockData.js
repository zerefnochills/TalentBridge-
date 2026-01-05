// Mock data for questions
export const javascriptQuestions = [
  {
    id: 1,
    question: "What will `typeof null` return in JavaScript?",
    options: [
      { letter: 'A', text: 'object', correct: true },
      { letter: 'B', text: 'null', correct: false },
      { letter: 'C', text: 'undefined', correct: false },
      { letter: 'D', text: 'number', correct: false }
    ]
  },
  {
    id: 2,
    question: "What is the output of `[] == false` in JavaScript?",
    options: [
      { letter: 'A', text: 'false', correct: false },
      { letter: 'B', text: 'true', correct: true },
      { letter: 'C', text: 'undefined', correct: false },
      { letter: 'D', text: 'TypeError', correct: false }
    ]
  },
  {
    id: 3,
    question: "Which method adds an element to the end of an array?",
    options: [
      { letter: 'A', text: 'unshift()', correct: false },
      { letter: 'B', text: 'shift()', correct: false },
      { letter: 'C', text: 'push()', correct: true },
      { letter: 'D', text: 'pop()', correct: false }
    ]
  },
  {
    id: 4,
    question: "What does the `===` operator check for in JavaScript?",
    options: [
      { letter: 'A', text: 'Value only', correct: false },
      { letter: 'B', text: 'Type only', correct: false },
      { letter: 'C', text: 'Both value and type', correct: true },
      { letter: 'D', text: 'Neither value nor type', correct: false }
    ]
  },
  {
    id: 5,
    question: "What is a closure in JavaScript?",
    options: [
      { letter: 'A', text: 'A function that has access to its outer scope', correct: true },
      { letter: 'B', text: 'A way to close browser windows', correct: false },
      { letter: 'C', text: 'A method to end loops', correct: false },
      { letter: 'D', text: 'A type of error', correct: false }
    ]
  }
];

export const scenarioQuestion = {
  id: 'scenario-1',
  question: "Your JavaScript function is running slowly inside a loop that updates the UI. What would you optimize first?",
  options: [
    { letter: 'A', text: 'Reduce DOM access and batch updates', correct: true },
    { letter: 'B', text: 'Increase setTimeout delay', correct: false },
    { letter: 'C', text: 'Add more nested loops', correct: false },
    { letter: 'D', text: 'Use alert() for debugging', correct: false }
  ]
};

// Mock role definition
export const frontendDeveloperRole = {
  role: "Frontend Developer",
  requiredSkills: {
    JavaScript: 80
  },
  recommendations: [
    "Practice JavaScript DOM manipulation and event handling",
    "Build a small interactive project (e.g., todo app, calculator)",
    "Study modern ES6+ features and async programming",
    "Reassess your skill after practicing"
  ]
};

// Freshness score mapping
export const freshnessScoreMap = {
  '< 1 month': 100,
  '1-6 months': 80,
  '6-12 months': 50,
  '> 1 year': 20
};

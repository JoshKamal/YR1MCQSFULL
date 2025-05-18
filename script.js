// Medical MCQ Quiz Script
// This script handles all the functionality for the MCQ quiz system

// Module mappings and metadata
const moduleData = {
  focs: {
    name: 'Fundamentals of Clinical Science',
    description: 'Core concepts in pharmacology and basic medical sciences',
    isPremium: false,
    topics: {
      focs2: { name: 'FOCS 2', count: 388, description: 'Core concepts in pharmacology and drug actions' },
      focs3: { name: 'FOCS 3', count: 380, description: 'Advanced pharmacological principles' },
      focs4: { name: 'FOCS 4', count: 390, description: 'Clinical applications of drug therapy' },
      focs5: { name: 'FOCS 5', count: 410, description: 'Modern approaches to pharmacotherapy' }
    }
  },
  bcr: {
    name: 'Biochemistry',
    description: 'Biochemical processes and pathways relevant to medicine',
    isPremium: true,
    topics: {
      bcr1: { name: 'BCR 1', count: 150, description: 'Introduction to biochemistry concepts' },
      bcr2: { name: 'BCR 2', count: 120, description: 'Advanced biochemical pathways' },
      bcr3: { name: 'BCR 3', count: 130, description: 'Metabolic processes and regulation' },
      bcr4: { name: 'BCR 4', count: 140, description: 'Clinical biochemistry applications' }
    }
  },
  msk: {
    name: 'Musculoskeletal',
    description: 'Anatomy and pathology of the musculoskeletal system',
    isPremium: true,
    topics: {
      msk1: { name: 'MSK 1', count: 180, description: 'Fundamentals of musculoskeletal anatomy' },
      msk2: { name: 'MSK 2', count: 160, description: 'Clinical musculoskeletal conditions' }
    }
  },
  anatomy: {
    name: 'Anatomy',
    description: 'Human anatomical structures and systems',
    isPremium: true,
    topics: {
      anatomy: { name: 'Anatomy', count: 200, description: 'Comprehensive review of human anatomy' }
    }
  }
};

// Quiz state variables
let currentQuestions = [];
let currentQuestionIndex = 0;
let answeredQuestions = [];
let correctAnswers = 0;
let incorrectAnswers = [];
let currentModule = '';
let currentTopic = '';
let premiumEnabled = true; // For testing purposes, set to true by default
let quizCompleted = false;

// DOM elements
const pages = {
  home: document.getElementById('home-page'),
  modules: document.getElementById('modules-page'),
  about: document.getElementById('about-page'),
  quiz: document.getElementById('quiz-page')
};

const elements = {
  // Navigation
  navLinks: document.querySelectorAll('nav a'),
  mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
  closeMenuBtn: document.querySelector('.close-menu'),
  navMenu: document.querySelector('nav'),
  
  // Module filters
  filterBtns: document.querySelectorAll('.filter-btn'),
  moduleCards: document.querySelectorAll('.module-card'),
  
  // Quiz elements
  quizTitle: document.getElementById('quiz-title'),
  questionCounter: document.getElementById('question-counter'),
  progressBar: document.getElementById('progress-bar'),
  questionContainer: document.getElementById('question-container'),
  questionText: document.getElementById('question-text'),
  optionsContainer: document.getElementById('options-container'),
  feedbackContainer: document.getElementById('feedback-container'),
  feedbackTitle: document.getElementById('feedback-title'),
  feedbackExplanation: document.getElementById('feedback-explanation'),
  feedbackSource: document.getElementById('feedback-source'),
  prevBtn: document.getElementById('prev-btn'),
  nextBtn: document.getElementById('next-btn'),
  loader: document.getElementById('loader'),
  reviewControls: document.getElementById('review-controls'),
  reviewIncorrectBtn: document.getElementById('review-incorrect-btn'),
  restartBtn: document.getElementById('restart-btn'),
  
  // Stats
  totalQuestions: document.getElementById('total-questions'),
  answeredQuestions: document.getElementById('answered-questions'),
  correctQuestions: document.getElementById('correct-questions'),
  accuracy: document.getElementById('accuracy'),
  
  // Results
  resultsContainer: document.getElementById('results-container'),
  resultsTotal: document.getElementById('results-total'),
  resultsCorrect: document.getElementById('results-correct'),
  resultsIncorrect: document.getElementById('results-incorrect'),
  resultsScore: document.getElementById('results-score'),
  resultsScoreBar: document.getElementById('results-score-bar'),
  resultsMessage: document.getElementById('results-message'),
  reviewResultsBtn: document.getElementById('review-results-btn'),
  newSessionBtn: document.getElementById('new-session-btn'),
  backToModulesBtn: document.getElementById('back-to-modules-btn'),
  
  // Premium modal
  premiumModal: document.getElementById('premium-modal'),
  closePremiumModal: document.querySelector('#premium-modal .close-modal'),
  enablePremiumBtn: document.getElementById('enable-premium-btn'),
  
  // Additional navigation
  startQuizBtns: document.querySelectorAll('.start-quiz-btn'),
  pageLinks: document.querySelectorAll('[data-page]'),
  moduleLinks: document.querySelectorAll('[data-filter]')
};

// ===== Event Listeners =====

// Navigation
elements.navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Update active link
    elements.navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Show the corresponding page
    const page = link.dataset.page;
    showPage(page);
  });
});

// Mobile menu
if (elements.mobileMenuToggle) {
  elements.mobileMenuToggle.addEventListener('click', () => {
    elements.navMenu.classList.add('active');
  });
}

if (elements.closeMenuBtn) {
  elements.closeMenuBtn.addEventListener('click', () => {
    elements.navMenu.classList.remove('active');
  });
}

// Module filters
elements.filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    
    // Update active filter
    elements.filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter modules
    filterModules(filter);
  });
});

// Module cards
elements.moduleCards.forEach(card => {
  card.addEventListener('click', () => {
    const module = card.dataset.module;
    const topic = card.dataset.topic;
    
    startQuiz(module, topic);
  });
});

// Quiz navigation
elements.prevBtn.addEventListener('click', showPreviousQuestion);
elements.nextBtn.addEventListener('click', showNextQuestion);
elements.reviewIncorrectBtn.addEventListener('click', reviewIncorrectQuestions);
elements.restartBtn.addEventListener('click', restartQuiz);

// Results actions
elements.reviewResultsBtn.addEventListener('click', reviewIncorrectQuestions);
elements.newSessionBtn.addEventListener('click', restartQuiz);
elements.backToModulesBtn.addEventListener('click', () => showPage('modules'));

// Premium modal
elements.closePremiumModal.addEventListener('click', () => {
  elements.premiumModal.classList.remove('active');
});

elements.enablePremiumBtn.addEventListener('click', () => {
  premiumEnabled = true;
  elements.premiumModal.classList.remove('active');
  localStorage.setItem('premiumEnabled', 'true');
  alert('Premium access enabled for all modules!');
});

// Start quiz buttons
elements.startQuizBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const module = btn.dataset.module;
    const topic = btn.dataset.topic;
    
    startQuiz(module, topic);
  });
});

// Page links
elements.pageLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    
    if (link.dataset.filter) {
      // If it's also a filter link
      showPage('modules');
      
      // Set the filter
      const filter = link.dataset.filter;
      elements.filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
          btn.click();
        }
      });
    } else {
      showPage(page);
    }
  });
});

// ===== Functions =====

// Page navigation
function showPage(page) {
  // Hide all pages
  Object.values(pages).forEach(p => {
    if (p) p.style.display = 'none';
  });
  
  // Show the selected page
  if (pages[page]) {
    pages[page].style.display = 'block';
  }
  
  // Update nav links
  elements.navLinks.forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Close mobile menu if open
  if (elements.navMenu.classList.contains('active')) {
    elements.navMenu.classList.remove('active');
  }
}

// Filter modules
function filterModules(filter) {
  elements.moduleCards.forEach(card => {
    const module = card.dataset.module;
    const type = card.dataset.type;
    
    if (filter === 'all' || filter === module || filter === type) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Start a quiz session
async function startQuiz(module, topic) {
  currentModule = module;
  currentTopic = topic;
  
  // Check if premium access is required
  if (moduleData[module].isPremium && !premiumEnabled) {
    elements.premiumModal.classList.add('active');
    return;
  }
  
  // Reset quiz state
  currentQuestionIndex = 0;
  answeredQuestions = [];
  correctAnswers = 0;
  incorrectAnswers = [];
  quizCompleted = false;
  
  // Show quiz page
  showPage('quiz');
  
  // Show loader
  elements.loader.style.display = 'block';
  elements.questionContainer.style.display = 'none';
  elements.feedbackContainer.style.display = 'none';
  elements.reviewControls.style.display = 'none';
  elements.resultsContainer.style.display = 'none';
  
  // Update quiz title
  if (moduleData[module] && moduleData[module].topics[topic]) {
    elements.quizTitle.textContent = moduleData[module].topics[topic].name + ' Practice';
  } else {
    elements.quizTitle.textContent = 'Practice Quiz';
  }
  
  try {
    // Load the questions
    await loadQuestions(module, topic);
    
    // Hide loader and show question
    elements.loader.style.display = 'none';
    elements.questionContainer.style.display = 'block';
    
    // Show the first question
    showQuestion(0);
    
    // Update stats
    updateStats();
  } catch (error) {
    console.error('Error starting quiz:', error);
    elements.loader.style.display = 'none';
    elements.questionText.textContent = 'Error loading questions. Please try again.';
    elements.questionContainer.style.display = 'block';
    elements.optionsContainer.innerHTML = '';
  }
}

// Load questions from the module file
async function loadQuestions(module, topic) {
  try {
    // Use dynamic import to load the module file
    const response = await fetch(`./mcq/${topic}.js`);
    if (!response.ok) {
      throw new Error(`Failed to load ${topic}.js: ${response.status} ${response.statusText}`);
    }
    
    // Get the JavaScript content
    const jsContent = await response.text();
    
    // Determine the variable name (typically something like focs2Data)
    const varName = `${topic}Data`;
    
    // Create a script element and execute it to get the data
    const script = document.createElement('script');
    script.textContent = jsContent;
    document.body.appendChild(script);
    
    // Access the global variable created by the script
    if (window[varName]) {
      currentQuestions = window[varName];
      
      // Shuffle the questions
      currentQuestions = shuffleArray([...currentQuestions]);
      
      // Prepare each question by adding tracking properties
      currentQuestions = currentQuestions.map(q => ({
        ...q,
        answered: false,
        selectedOption: null,
        isCorrect: null,
        shuffledOptions: shuffleArray([...q.options].map((text, index) => ({ text, index }))),
      }));
    } else {
      console.error(`Variable ${varName} not found after loading script`);
      currentQuestions = [];
    }
    
  } catch (error) {
    console.error(`Error loading questions for ${module}/${topic}:`, error);
    currentQuestions = [];
  }
}

// Shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Show a specific question
function showQuestion(index) {
  if (index < 0 || index >= currentQuestions.length) {
    console.error(`Invalid question index: ${index}`);
    return;
  }
  
  currentQuestionIndex = index;
  const question = currentQuestions[index];
  
  // Update question counter and progress bar
  elements.questionCounter.textContent = `Question ${index + 1}/${currentQuestions.length}`;
  elements.progressBar.style.width = `${((index + 1) / currentQuestions.length) * 100}%`;
  
  // Set question text
  elements.questionText.textContent = question.question;
  
  // Clear options container
  elements.optionsContainer.innerHTML = '';
  
  // Get shuffled options (or create them if not present)
  if (!question.shuffledOptions) {
    question.shuffledOptions = shuffleArray([...question.options].map((text, index) => ({ text, index })));
  }
  
  // Add options
  question.shuffledOptions.forEach((option, optionIndex) => {
    const optionButton = document.createElement('button');
    optionButton.className = 'option-btn';
    optionButton.textContent = option.text;
    
    // If the question has been answered, show the result
    if (question.answered) {
      if (option.index === question.correctIndex) {
        optionButton.classList.add('correct');
      } else if (question.selectedOption === optionIndex) {
        optionButton.classList.add('incorrect');
      }
      optionButton.disabled = true;
    } else {
      optionButton.addEventListener('click', () => selectAnswer(optionIndex));
    }
    
    elements.optionsContainer.appendChild(optionButton);
  });
  
  // Hide feedback container by default
  elements.feedbackContainer.style.display = 'none';
  
  // Show feedback if the question has been answered
  if (question.answered) {
    showFeedback(question);
  }
  
  // Update button states
  elements.prevBtn.disabled = index === 0;
  elements.nextBtn.disabled = false;
  if (index === currentQuestions.length - 1) {
    elements.nextBtn.textContent = 'Finish';
  } else {
    elements.nextBtn.textContent = 'Next';
  }
  
  // Show review controls if at the end and quiz is completed
  if (index === currentQuestions.length - 1 && quizCompleted) {
    elements.reviewControls.style.display = 'flex';
  } else {
    elements.reviewControls.style.display = 'none';
  }
}

// Select an answer
function selectAnswer(optionIndex) {
  const question = currentQuestions[currentQuestionIndex];
  
  // If already answered, do nothing
  if (question.answered) return;
  
  // Record the answer
  question.answered = true;
  question.selectedOption = optionIndex;
  
  // Determine if the answer is correct
  const selectedOptionOriginalIndex = question.shuffledOptions[optionIndex].index;
  question.isCorrect = selectedOptionOriginalIndex === question.correctIndex;
  
  // Update tracking
  answeredQuestions.push(currentQuestionIndex);
  if (question.isCorrect) {
    correctAnswers++;
  } else {
    incorrectAnswers.push(currentQuestionIndex);
  }
  
  // Mark options as correct/incorrect
  const optionButtons = elements.optionsContainer.querySelectorAll('.option-btn');
  optionButtons.forEach((button, index) => {
    const originalIndex = question.shuffledOptions[index].index;
    if (originalIndex === question.correctIndex) {
      button.classList.add('correct');
    } else if (index === optionIndex) {
      button.classList.add('incorrect');
    }
    button.disabled = true;
  });
  
  // Show feedback
  showFeedback(question);
  
  // Update stats
  updateStats();
  
  // If this is the last question, mark quiz as completed
  if (answeredQuestions.length === currentQuestions.length) {
    quizCompleted = true;
    if (currentQuestionIndex === currentQuestions.length - 1) {
      elements.reviewControls.style.display = 'flex';
      elements.resultsContainer.style.display = 'block';
      updateResults();
    }
  }
}

// Show feedback for a question
function showFeedback(question) {
  elements.feedbackContainer.style.display = 'block';
  
  if (question.isCorrect) {
    elements.feedbackContainer.className = 'feedback-container correct';
    elements.feedbackTitle.className = 'feedback-title correct';
    elements.feedbackTitle.textContent = 'Correct!';
  } else {
    elements.feedbackContainer.className = 'feedback-container incorrect';
    elements.feedbackTitle.className = 'feedback-title incorrect';
    elements.feedbackTitle.textContent = 'Incorrect';
  }
  
  // Show the correct answer
  const correctOptionText = question.options[question.correctIndex];
  elements.feedbackExplanation.innerHTML = `The correct answer is: <strong>${correctOptionText}</strong>`;
  
  // Show slide reference if available
  if (question.slideLink) {
    elements.feedbackSource.innerHTML = `<p><em>Source: ${question.slideLink}</em></p>`;
  } else {
    elements.feedbackSource.innerHTML = '';
  }
}

// Navigate to previous question
function showPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    showQuestion(currentQuestionIndex - 1);
  }
}

// Navigate to next question
function showNextQuestion() {
  if (currentQuestionIndex < currentQuestions.length - 1) {
    showQuestion(currentQuestionIndex + 1);
  } else if (quizCompleted) {
    // If at the end and completed, show results
    showResults();
  }
}

// Show results
function showResults() {
  elements.questionContainer.style.display = 'none';
  elements.feedbackContainer.style.display = 'none';
  elements.reviewControls.style.display = 'none';
  elements.resultsContainer.style.display = 'block';
  
  updateResults();
}

// Update the results display
function updateResults() {
  const total = currentQuestions.length;
  const correct = correctAnswers;
  const incorrect = total - correct;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  elements.resultsTotal.textContent = total;
  elements.resultsCorrect.textContent = correct;
  elements.resultsIncorrect.textContent = incorrect;
  elements.resultsScore.textContent = `${score}%`;
  
  // Update score bar
  elements.resultsScoreBar.style.width = `${score}%`;
  if (score >= 80) {
    elements.resultsScoreBar.className = 'score-bar high';
    elements.resultsMessage.textContent = 'Excellent work! You have mastered this topic.';
  } else if (score >= 60) {
    elements.resultsScoreBar.className = 'score-bar medium';
    elements.resultsMessage.textContent = 'Good job! Keep practicing to improve further.';
  } else {
    elements.resultsScoreBar.className = 'score-bar low';
    elements.resultsMessage.textContent = 'Keep practicing to strengthen your understanding of this topic.';
  }
}

// Update stats display
function updateStats() {
  elements.totalQuestions.textContent = currentQuestions.length;
  elements.answeredQuestions.textContent = answeredQuestions.length;
  elements.correctQuestions.textContent = correctAnswers;
  
  const accuracyValue = answeredQuestions.length > 0 
    ? Math.round((correctAnswers / answeredQuestions.length) * 100) 
    : 0;
  elements.accuracy.textContent = `${accuracyValue}%`;
}

// Review incorrect questions
function reviewIncorrectQuestions() {
  if (incorrectAnswers.length === 0) {
    alert('No incorrect answers to review.');
    return;
  }
  
  // Create a new array with only the incorrect questions
  const incorrectQuestionsList = incorrectAnswers.map(index => currentQuestions[index]);
  
  // Save the original questions
  const originalQuestions = currentQuestions;
  const originalQuestionIndex = currentQuestionIndex;
  
  // Set the current questions to only the incorrect ones
  currentQuestions = incorrectQuestionsList;
  currentQuestionIndex = 0;
  
  // Show the first incorrect question
  showQuestion(0);
  
  // Add a button to return to the full quiz
  const returnButton = document.createElement('button');
  returnButton.className = 'btn btn-secondary';
  returnButton.textContent = 'Return to Full Quiz';
  returnButton.style.marginTop = '1rem';
  returnButton.addEventListener('click', () => {
    // Restore the original questions
    currentQuestions = originalQuestions;
    currentQuestionIndex = originalQuestionIndex;
    showQuestion(currentQuestionIndex);
    returnButton.remove();
  });
  
  elements.reviewControls.appendChild(returnButton);
}

// Restart the quiz
function restartQuiz() {
  // Confirm if the user wants to restart
  if (confirm('Are you sure you want to restart? All progress will be lost.')) {
    startQuiz(currentModule, currentTopic);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Check if premium is enabled from localStorage
  if (localStorage.getItem('premiumEnabled') === 'true') {
    premiumEnabled = true;
  }
});

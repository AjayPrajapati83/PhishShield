// PhishShield - Quiz JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Listen for theme changes
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            // Apply dark mode text visibility after a short delay to ensure DOM updates
            setTimeout(function() {
                if (document.body.classList.contains('dark-mode')) {
                    applyDarkModeTextStyles();
                } else {
                    removeDarkModeTextStyles();
                }
            }, 100);
        });
    }
    
    // Apply dark mode text styles if needed on page load
    if (document.body.classList.contains('dark-mode')) {
        applyDarkModeTextStyles();
    }
    
    // Function to apply dark mode text styles
    function applyDarkModeTextStyles() {
        const questionElement = document.getElementById('question-text');
        if (questionElement) {
            questionElement.style.color = '#ffffff';
            questionElement.style.textShadow = '0 0 1px rgba(255, 255, 255, 0.3)';
        }
        
        // Update the visible question text
        const visibleQuestion = document.getElementById('visible-question');
        if (visibleQuestion) {
            visibleQuestion.style.color = '#ffffff';
        }
        
        // Make sure all quiz text elements are visible in dark mode
        document.querySelectorAll('.answer-option label').forEach(label => {
            label.style.color = '#ffffff';
        });
        
        document.querySelectorAll('.question, .quiz-question').forEach(q => {
            q.style.color = '#ffffff';
        });
        
        // Ensure feedback text is visible
        document.querySelectorAll('#correct-explanation, #incorrect-explanation').forEach(elem => {
            if (elem) elem.style.color = '#ffffff';
        });
        
        // Force all text in quiz section to be white
        document.querySelectorAll('#quiz-section h2, #quiz-section h3, #quiz-section p, #quiz-section label').forEach(elem => {
            elem.style.color = '#ffffff';
        });
    }
    
    // Function to remove dark mode text styles
    function removeDarkModeTextStyles() {
        const questionElement = document.getElementById('question-text');
        if (questionElement) {
            questionElement.style.color = '';
        }
        
        // Update the visible question text
        const visibleQuestion = document.getElementById('visible-question');
        if (visibleQuestion) {
            visibleQuestion.style.color = '#000000';
        }
        
        document.querySelectorAll('.answer-option label').forEach(label => {
            label.style.color = '';
        });
        
        document.querySelectorAll('.question').forEach(q => {
            q.style.color = '';
        });
    }
    // Quiz elements
    const quizIntro = document.getElementById('quiz-intro');
    const quizSection = document.getElementById('quiz-section');
    const resultsSection = document.getElementById('results-section');
    const categoryCards = document.querySelectorAll('.category-card');
    const quizTitle = document.getElementById('quiz-title');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const progressBar = document.getElementById('quiz-progress-bar');
    const timerDisplay = document.getElementById('timer-display');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const correctFeedback = document.getElementById('correct-feedback');
    const incorrectFeedback = document.getElementById('incorrect-feedback');
    const correctExplanation = document.getElementById('correct-explanation');
    const incorrectExplanation = document.getElementById('incorrect-explanation');
    const nextQuestionBtn = document.getElementById('next-question');
    const finalScore = document.getElementById('final-score');
    const maxScore = document.getElementById('max-score');
    const scorePercentage = document.getElementById('score-percentage');
    const scoreMessage = document.getElementById('score-message');
    const correctCount = document.getElementById('correct-count');
    const incorrectCount = document.getElementById('incorrect-count');
    const completionTime = document.getElementById('completion-time');
    const questionReview = document.getElementById('question-review');
    const retryQuizBtn = document.getElementById('retry-quiz');
    const tryDifferentCategoryBtn = document.getElementById('try-different-category');
    
    // Quiz state
    let currentCategory = '';
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timerSeconds = 0;
    let userAnswers = [];
    let startTime;
    
    // Quiz questions by category
    const quizQuestions = {
        'phishing-basics': [
            {
                question: "What is phishing?",
                options: [
                    "A type of fishing sport",
                    "A cybersecurity attack that uses disguised email as a weapon",
                    "A computer virus that deletes files",
                    "A hardware failure in computers"
                ],
                correctAnswer: 1,
                explanation: "Phishing is a type of social engineering attack often used to steal user data, including login credentials and credit card numbers. It occurs when an attacker, masquerading as a trusted entity, dupes a victim into opening an email, instant message, or text message."
            },
            {
                question: "Which of the following is NOT a common sign of a phishing email?",
                options: [
                    "Urgent calls to action",
                    "Spelling and grammar errors",
                    "Personalized greeting with your full name",
                    "Requests for personal information"
                ],
                correctAnswer: 2,
                explanation: "Personalized greetings with your full name are typically a sign of legitimate emails. Phishing emails often use generic greetings like 'Dear Customer' or 'Dear User' because attackers usually send the same email to thousands of people."
            },
            {
                question: "What should you do if you suspect an email is a phishing attempt?",
                options: [
                    "Reply to the sender asking if it's legitimate",
                    "Click the links to see where they lead",
                    "Delete the email and contact the company directly using their official website or phone number",
                    "Forward it to all your contacts to warn them"
                ],
                correctAnswer: 2,
                explanation: "If you suspect an email is a phishing attempt, you should delete it and contact the company directly through their official website or phone number. Never reply to the email, click on links, or forward it to others as this could spread the phishing attempt."
            },
            {
                question: "What is 'spear phishing'?",
                options: [
                    "Phishing attempts targeting specific individuals or organizations",
                    "Using physical mail to conduct phishing",
                    "Phishing that only works on mobile devices",
                    "Phishing that targets financial institutions only"
                ],
                correctAnswer: 0,
                explanation: "Spear phishing is a targeted phishing attempt directed at specific individuals or organizations. Unlike regular phishing that casts a wide net, spear phishing is personalized and often includes information specific to the target to appear more legitimate."
            },
            {
                question: "Which organization type is most frequently targeted by phishing attacks?",
                options: [
                    "Educational institutions",
                    "Healthcare providers",
                    "Financial services",
                    "Government agencies"
                ],
                correctAnswer: 2,
                explanation: "Financial services are the most frequently targeted by phishing attacks because they offer direct access to money. Attackers often impersonate banks, credit card companies, and payment services to steal credentials and financial information."
            }
        ],
        'email-security': [
            {
                question: "Which of the following email security protocols helps verify that an email was actually sent by the domain it claims to be from?",
                options: [
                    "HTTPS",
                    "SPF (Sender Policy Framework)",
                    "VPN",
                    "Firewall"
                ],
                correctAnswer: 1,
                explanation: "SPF (Sender Policy Framework) is an email authentication protocol designed to detect forging sender addresses during the delivery of email. It allows receiving mail servers to verify that incoming mail from a domain comes from a host authorized by that domain's administrators."
            },
            {
                question: "What should you check in an email to verify its authenticity?",
                options: [
                    "The color of the logo",
                    "The sender's email address",
                    "The time it was sent",
                    "The number of recipients"
                ],
                correctAnswer: 1,
                explanation: "The sender's email address is one of the most important elements to check when verifying an email's authenticity. Look carefully at the domain (the part after @) to ensure it matches the legitimate organization's domain, not a similar-looking fake."
            },
            {
                question: "What is a 'lookalike domain' in the context of email phishing?",
                options: [
                    "A domain that has the same logo as a legitimate website",
                    "A domain that uses similar but slightly different spelling from a legitimate domain",
                    "A domain that has been blacklisted",
                    "A domain that changes appearance based on who views it"
                ],
                correctAnswer: 1,
                explanation: "A lookalike domain is a domain name that appears very similar to a legitimate domain but has subtle differences, such as misspellings, added/removed characters, or different TLDs (e.g., .net instead of .com). Examples include 'amaz0n.com' or 'paypa1.com'."
            },
            {
                question: "Which of the following is a sign that an email might be a phishing attempt?",
                options: [
                    "It addresses you by your full name",
                    "It comes from a company you do business with",
                    "It creates a sense of urgency or fear",
                    "It has a professional signature with contact information"
                ],
                correctAnswer: 2,
                explanation: "Creating a sense of urgency or fear is a common tactic in phishing emails. Attackers want to pressure you into acting quickly without thinking critically. Messages like 'Your account will be suspended in 24 hours' or 'Immediate action required' are red flags."
            },
            {
                question: "What is DMARC in email security?",
                options: [
                    "Digital Mail Authentication Record Checker",
                    "Domain-based Message Authentication, Reporting, and Conformance",
                    "Direct Mail Authentication and Reporting Center",
                    "Digital Message Authentication and Reporting Code"
                ],
                correctAnswer: 1,
                explanation: "DMARC (Domain-based Message Authentication, Reporting, and Conformance) is an email authentication protocol that builds on SPF and DKIM. It allows domain owners to specify how to handle emails that fail authentication checks and provides reporting on email authentication results."
            }
        ],
        'web-threats': [
            {
                question: "What does the padlock icon in a browser's address bar indicate?",
                options: [
                    "The website is completely safe from all threats",
                    "The website uses HTTPS encryption for data transmission",
                    "The website has been verified as legitimate by the government",
                    "The website doesn't collect any user data"
                ],
                correctAnswer: 1,
                explanation: "The padlock icon indicates that the website uses HTTPS encryption, which means the connection between your browser and the website is encrypted. However, this only means the connection is secure, not that the website itself is legitimate or safe."
            },
            {
                question: "Which of the following URL characteristics is most suspicious?",
                options: [
                    "It uses 'www' at the beginning",
                    "It contains hyphens",
                    "It has 'https://' at the beginning",
                    "It has a long string of random characters before the domain name"
                ],
                correctAnswer: 3,
                explanation: "A long string of random characters before the domain name is highly suspicious and often indicates a phishing URL. Legitimate websites typically have clean, readable URLs, while phishing sites often use complex URLs to hide their true identity."
            },
            {
                question: "What is 'typosquatting'?",
                options: [
                    "Making typographical errors when coding a website",
                    "Registering domains similar to popular websites with common typos",
                    "A type of DDoS attack",
                    "Inserting malicious code into website comments"
                ],
                correctAnswer: 1,
                explanation: "Typosquatting is the practice of registering domain names that are misspellings or variations of legitimate popular websites. Attackers hope users will mistype the URL and land on their malicious site instead. Examples include 'gooogle.com' or 'faceboook.com'."
            },
            {
                question: "Which part of a URL is most important to check for authenticity?",
                options: [
                    "The protocol (http/https)",
                    "The domain name",
                    "The path after the domain",
                    "The query parameters"
                ],
                correctAnswer: 1,
                explanation: "The domain name is the most important part to check for authenticity. This is the core identity of the website and what you should focus on to determine if you're on a legitimate site. Everything after the domain (paths, parameters) can be controlled by the domain owner."
            },
            {
                question: "What is a 'pharming' attack?",
                options: [
                    "Using fake online pharmacies to sell counterfeit drugs",
                    "Redirecting users from legitimate websites to fraudulent ones without their knowledge",
                    "Harvesting user data through online forms",
                    "Creating fake social media profiles to spread misinformation"
                ],
                correctAnswer: 1,
                explanation: "Pharming is a cyberattack that redirects users from legitimate websites to fraudulent ones without their knowledge, even when the user types the correct address. This is often done by exploiting vulnerabilities in DNS servers or by modifying the host's file on a victim's computer."
            }
        ]
    };
    
    // Initialize quiz
    function init() {
        // Category selection
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                currentCategory = this.getAttribute('data-category');
                startQuiz(currentCategory);
            });
        });
        
        // Submit answer
        if (submitAnswerBtn) {
            submitAnswerBtn.addEventListener('click', checkAnswer);
        }
        
        // Next question
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', loadNextQuestion);
        }
        
        // Retry quiz
        if (retryQuizBtn) {
            retryQuizBtn.addEventListener('click', function() {
                startQuiz(currentCategory);
            });
        }
        
        // Try different category
        if (tryDifferentCategoryBtn) {
            tryDifferentCategoryBtn.addEventListener('click', function() {
                showQuizIntro();
            });
        }
    }
    
    // Start quiz
    function startQuiz(category) {
        // Reset quiz state
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        timerSeconds = 0;
        startTime = new Date();
        
        // Get questions for selected category
        questions = quizQuestions[category];
        
        // Update UI
        quizTitle.textContent = getCategoryTitle(category) + ' Quiz';
        totalQuestionsElement.textContent = questions.length;
        
        // Hide intro, show quiz
        quizIntro.style.display = 'none';
        quizSection.style.display = 'block';
        resultsSection.style.display = 'none';
        
        // Load first question
        loadQuestion();
        
        // Start timer
        startTimer();
        
        // Scroll to quiz section
        window.scrollTo({
            top: quizSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }
    
    // Get category title
    function getCategoryTitle(category) {
        switch(category) {
            case 'phishing-basics':
                return 'Phishing Basics';
            case 'email-security':
                return 'Email Security';
            case 'web-threats':
                return 'URL & Web Threats';
            default:
                return 'Cybersecurity';
        }
    }
    
    // Load question
    function loadQuestion() {
        const question = questions[currentQuestionIndex];
        
        // Update question number and progress bar
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
        
        // Set question text
        questionText.textContent = question.question;
        
        // Ensure question is visible in dark mode
        if (document.body.classList.contains('dark-mode')) {
            questionText.style.color = '#ffffff';
        }
        
        // Clear previous answers
        answersContainer.innerHTML = '';
        
        // Add answer options
        question.options.forEach((option, index) => {
            const optionHTML = `
                <div class="answer-option">
                    <input type="radio" name="answer" id="answer-${index}" value="${index}">
                    <label for="answer-${index}">${option}</label>
                </div>
            `;
            answersContainer.innerHTML += optionHTML;
        });
        
        // Hide feedback
        document.getElementById('feedback-container').style.display = 'none';
        document.getElementById('question-container').style.display = 'block';
        
        // Ensure text visibility in dark mode
        ensureDarkModeVisibility();
    }
    
    // Function to ensure text visibility in dark mode
    function ensureDarkModeVisibility() {
        if (document.body.classList.contains('dark-mode')) {
            // Make question text white
            if (questionText) {
                questionText.style.color = '#ffffff';
            }
            
            // Make answer labels white
            document.querySelectorAll('.answer-option label').forEach(label => {
                label.style.color = '#ffffff';
            });
        }
    }
    
    // Check answer
    function checkAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        
        if (!selectedAnswer) {
            alert('Please select an answer');
            return;
        }
        
        const answerIndex = parseInt(selectedAnswer.value);
        const question = questions[currentQuestionIndex];
        const isCorrect = answerIndex === question.correctAnswer;
        
        // Save user's answer
        userAnswers.push({
            question: question.question,
            userAnswer: answerIndex,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect
        });
        
        // Update score
        if (isCorrect) {
            score++;
        }
        
        // Show appropriate feedback
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('feedback-container').style.display = 'block';
        
        if (isCorrect) {
            correctFeedback.style.display = 'block';
            incorrectFeedback.style.display = 'none';
            correctExplanation.textContent = question.explanation;
        } else {
            correctFeedback.style.display = 'none';
            incorrectFeedback.style.display = 'block';
            incorrectExplanation.textContent = `The correct answer is: ${question.options[question.correctAnswer]}. ${question.explanation}`;
        }
    }
    
    // Load next question
    function loadNextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }
    
    // End quiz
    function endQuiz() {
        // Stop timer
        clearInterval(timer);
        
        // Calculate time taken
        const endTime = new Date();
        const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        
        // Update results UI
        finalScore.textContent = score;
        maxScore.textContent = questions.length;
        scorePercentage.textContent = `${Math.round((score / questions.length) * 100)}%`;
        correctCount.textContent = score;
        incorrectCount.textContent = questions.length - score;
        completionTime.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        // Set score message
        if (score === questions.length) {
            scoreMessage.textContent = 'Perfect! You\'re a cybersecurity expert!';
        } else if (score >= questions.length * 0.8) {
            scoreMessage.textContent = 'Great job! You have strong cybersecurity awareness!';
        } else if (score >= questions.length * 0.6) {
            scoreMessage.textContent = 'Good effort! Keep learning about cybersecurity!';
        } else {
            scoreMessage.textContent = 'You might need more practice with cybersecurity concepts.';
        }
        
        // Generate question review
        generateQuestionReview();
        
        // Hide quiz, show results
        quizSection.style.display = 'none';
        resultsSection.style.display = 'block';
        
        // Scroll to results
        window.scrollTo({
            top: resultsSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }
    
    // Generate question review
    function generateQuestionReview() {
        questionReview.innerHTML = '';
        
        userAnswers.forEach((answer, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
            
            reviewItem.innerHTML = `
                <div class="review-header">
                    <span class="question-number">Question ${index + 1}</span>
                    <span class="result-indicator">
                        <i class="fas fa-${answer.isCorrect ? 'check' : 'times'}-circle"></i> 
                        ${answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                <p class="review-question">${answer.question}</p>
                <p class="review-answer">Your answer: ${questions[index].options[answer.userAnswer]}</p>
                ${!answer.isCorrect ? `<p class="review-correct">Correct answer: ${questions[index].options[answer.correctAnswer]}</p>` : ''}
            `;
            
            questionReview.appendChild(reviewItem);
        });
    }
    
    // Start timer
    function startTimer() {
        clearInterval(timer);
        timerSeconds = 0;
        updateTimerDisplay();
        
        timer = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        timerDisplay.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
    
    // Show quiz intro
    function showQuizIntro() {
        quizIntro.style.display = 'block';
        quizSection.style.display = 'none';
        resultsSection.style.display = 'none';
        
        window.scrollTo({
            top: quizIntro.offsetTop - 100,
            behavior: 'smooth'
        });
    }
    
    // Initialize the quiz
    init();
});

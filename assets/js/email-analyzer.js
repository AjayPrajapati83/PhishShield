// PhishShield - Email Analyzer JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + '-tab').classList.add('active');
        });
    });
    
    // Sample content functionality
    const showSampleHeaders = document.getElementById('show-sample-headers');
    const sampleHeaders = document.getElementById('sample-headers');
    const useSampleHeaders = document.getElementById('use-sample-headers');
    const headersInput = document.getElementById('headers-input');
    
    if (showSampleHeaders) {
        showSampleHeaders.addEventListener('click', function() {
            sampleHeaders.style.display = sampleHeaders.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    if (useSampleHeaders) {
        useSampleHeaders.addEventListener('click', function() {
            const sampleText = sampleHeaders.querySelector('pre').textContent;
            headersInput.value = sampleText;
            sampleHeaders.style.display = 'none';
        });
    }
    
    const showSampleContent = document.getElementById('show-sample-content');
    const sampleContent = document.getElementById('sample-content');
    const useSampleContent = document.getElementById('use-sample-content');
    const contentInput = document.getElementById('content-input');
    
    if (showSampleContent) {
        showSampleContent.addEventListener('click', function() {
            sampleContent.style.display = sampleContent.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    if (useSampleContent) {
        useSampleContent.addEventListener('click', function() {
            const sampleText = sampleContent.querySelector('pre').textContent;
            contentInput.value = sampleText;
            sampleContent.style.display = 'none';
        });
    }
    
    // Email analysis functionality
    const analyzeEmailBtn = document.getElementById('analyze-email-btn');
    const emailLoadingSection = document.getElementById('email-loading-section');
    const emailResultsSection = document.getElementById('email-results-section');
    const analyzeNewEmailBtn = document.getElementById('analyze-new-email');
    const downloadEmailReportBtn = document.getElementById('download-email-report');
    const analysisSteps = document.querySelectorAll('#email-loading-section .step');
    
    if (analyzeEmailBtn) {
        analyzeEmailBtn.addEventListener('click', function() {
            // Get active tab
            const activeTab = document.querySelector('.tab-content.active');
            const tabId = activeTab.id.replace('-tab', '');
            
            let emailContent = '';
            
            // Get content based on active tab
            if (tabId === 'headers') {
                emailContent = headersInput.value.trim();
            } else if (tabId === 'content') {
                emailContent = contentInput.value.trim();
            } else if (tabId === 'both') {
                emailContent = document.getElementById('full-email-input').value.trim();
            }
            
            if (!emailContent) {
                alert('Please enter email content to analyze');
                return;
            }
            
            // Start analysis
            startEmailAnalysis(emailContent, tabId);
        });
    }
    
    if (analyzeNewEmailBtn) {
        analyzeNewEmailBtn.addEventListener('click', function() {
            emailResultsSection.style.display = 'none';
            headersInput.value = '';
            contentInput.value = '';
            document.getElementById('full-email-input').value = '';
            window.scrollTo({
                top: document.querySelector('.email-input-section').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
    
    if (downloadEmailReportBtn) {
        downloadEmailReportBtn.addEventListener('click', function() {
            alert('Report download functionality would be implemented here. In a real application, this would generate a PDF with the analysis results.');
        });
    }
    
    function startEmailAnalysis(content, type) {
        // Reset steps
        analysisSteps.forEach(step => {
            step.querySelector('.step-status').innerHTML = '';
        });
        
        // Show loading section, hide results
        emailLoadingSection.style.display = 'block';
        emailResultsSection.style.display = 'none';
        
        // Scroll to loading section
        window.scrollTo({
            top: emailLoadingSection.offsetTop - 100,
            behavior: 'smooth'
        });
        
        // Simulate analysis steps with delays
        simulateEmailAnalysisSteps(content, type);
    }
    
    function simulateEmailAnalysisSteps(content, type) {
        const stepDelays = [1200, 1800, 1500, 1000, 2000]; // Delays in milliseconds
        
        analysisSteps.forEach((step, index) => {
            setTimeout(() => {
                const statusElement = step.querySelector('.step-status');
                statusElement.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success);"></i>';
                
                // If last step, show results after a delay
                if (index === analysisSteps.length - 1) {
                    setTimeout(() => {
                        showEmailResults(content, type);
                    }, 1000);
                }
            }, stepDelays.slice(0, index + 1).reduce((a, b) => a + b, 0));
        });
    }
    
    function showEmailResults(content, type) {
        // Analyze email content
        const analysisResults = analyzeEmailContent(content, type);
        
        // Update UI with results
        document.getElementById('analyzed-subject').textContent = analysisResults.subject;
        document.getElementById('email-risk-score').textContent = analysisResults.score;
        
        // Set risk level class and text
        const emailRiskLevel = document.getElementById('email-risk-level');
        emailRiskLevel.textContent = analysisResults.riskLevel;
        emailRiskLevel.className = '';
        
        if (analysisResults.score >= 70) {
            emailRiskLevel.classList.add('high-risk');
            document.getElementById('email-recommendation').textContent = 'This email shows strong indicators of being a phishing attempt. Do not click any links or provide any information.';
        } else if (analysisResults.score >= 40) {
            emailRiskLevel.classList.add('medium-risk');
            document.getElementById('email-recommendation').textContent = 'This email has some suspicious elements. Exercise caution and verify the sender through other channels before taking any action.';
        } else {
            emailRiskLevel.classList.add('low-risk');
            document.getElementById('email-recommendation').textContent = 'This email appears to be legitimate, but always remain vigilant when sharing personal information.';
        }
        
        // Update score circle color
        const scoreCircle = document.querySelector('#email-results-section .score-circle');
        if (analysisResults.score >= 70) {
            scoreCircle.style.backgroundColor = 'var(--danger)';
        } else if (analysisResults.score >= 40) {
            scoreCircle.style.backgroundColor = 'var(--warning)';
        } else {
            scoreCircle.style.backgroundColor = 'var(--success)';
        }
        
        // Update highlighted content
        document.getElementById('highlighted-content').innerHTML = generateHighlightedContent(content);
        
        // Hide loading, show results
        emailLoadingSection.style.display = 'none';
        emailResultsSection.style.display = 'block';
        
        // Scroll to results section
        window.scrollTo({
            top: emailResultsSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }
    
    function analyzeEmailContent(content, type) {
        let score = 0;
        let subject = '"Unknown Subject"';
        
        // Extract subject if available
        const subjectMatch = content.match(/Subject: (.*?)($|\n)/i);
        if (subjectMatch) {
            subject = `"${subjectMatch[1].trim()}"`;
        }
        
        // Check for suspicious keywords
        const suspiciousKeywords = [
            'urgent', 'verify', 'account', 'suspended', 'update', 'confirm', 'security', 
            'unusual activity', 'login', 'password', 'click', 'link', 'bank', 'credit card',
            'social security', 'payment', 'expire', 'immediately', 'validate', 'authenticate'
        ];
        
        const keywordMatches = suspiciousKeywords.filter(keyword => 
            content.toLowerCase().includes(keyword.toLowerCase())
        );
        
        score += keywordMatches.length * 5;
        
        // Check for urgency indicators
        const urgencyPhrases = [
            'immediate action', 'urgent', 'right away', 'as soon as possible', 
            'within 24 hours', 'expires', 'limited time', 'act now', 'immediately'
        ];
        
        const urgencyMatches = urgencyPhrases.filter(phrase => 
            content.toLowerCase().includes(phrase.toLowerCase())
        );
        
        score += urgencyMatches.length * 7;
        
        // Check for suspicious links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = content.match(urlRegex) || [];
        
        if (urls.length > 0) {
            score += 15;
            
            // Check for URL/text mismatch (simplified)
            if (content.includes('href=') && !content.includes(urls[0])) {
                score += 20;
            }
        }
        
        // Check for requesting personal information
        const personalInfoPhrases = [
            'provide your', 'enter your', 'update your', 'confirm your',
            'verify your', 'send your', 'submit your'
        ];
        
        const personalInfoMatches = personalInfoPhrases.filter(phrase => 
            content.toLowerCase().includes(phrase.toLowerCase())
        );
        
        score += personalInfoMatches.length * 10;
        
        // Check for poor grammar and spelling (simplified)
        const grammarIssues = [
            'kindly', 'dear customer', 'valued customer', 'dear user',
            'we detected', 'we noticed', 'we observed', 'we have detected'
        ];
        
        const grammarMatches = grammarIssues.filter(issue => 
            content.toLowerCase().includes(issue.toLowerCase())
        );
        
        score += grammarMatches.length * 3;
        
        // Check for spoofed sender (simplified)
        if (type === 'headers' || type === 'both') {
            if (content.includes('Return-Path:') && content.includes('From:')) {
                const returnPathMatch = content.match(/Return-Path: .*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
                const fromMatch = content.match(/From: .*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
                
                if (returnPathMatch && fromMatch && returnPathMatch[1] !== fromMatch[1]) {
                    score += 25;
                }
            }
            
            // Check for SPF/DKIM failures (simplified)
            if (content.includes('SPF=fail') || content.includes('DKIM=fail') || content.includes('dmarc=fail')) {
                score += 30;
            }
        }
        
        // Determine risk level
        let riskLevel;
        if (score >= 70) {
            riskLevel = 'High Risk - Likely Phishing';
        } else if (score >= 40) {
            riskLevel = 'Medium Risk - Suspicious';
        } else {
            riskLevel = 'Low Risk - Likely Legitimate';
        }
        
        // Cap score at 100
        score = Math.min(score, 100);
        
        return {
            subject,
            score,
            riskLevel
        };
    }
    
    function generateHighlightedContent(content) {
        // Simplified for demo - in a real app, this would do more sophisticated highlighting
        const suspiciousTerms = [
            'urgent', 'verify', 'account', 'suspended', 'update', 'confirm', 'security', 
            'unusual activity', 'login', 'password', 'click', 'link', 'bank', 'credit card',
            'immediately', 'validate', 'authenticate', '24 hours', 'limited time', 'act now'
        ];
        
        // Convert content to HTML
        let html = content.replace(/\n/g, '<br>');
        
        // Highlight URLs
        html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="#" class="highlight danger">$1</a>');
        
        // Highlight suspicious terms
        suspiciousTerms.forEach(term => {
            const regex = new RegExp('\\b' + term + '\\b', 'gi');
            html = html.replace(regex, '<span class="highlight danger">$&</span>');
        });
        
        return html;
    }
});

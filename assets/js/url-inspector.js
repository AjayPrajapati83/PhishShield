// PhishShield - URL Inspector JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const urlInput = document.getElementById('url-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');
    const exampleUrls = document.querySelectorAll('.example-url');
    const analyzedUrlElement = document.getElementById('analyzed-url');
    const riskScoreValue = document.getElementById('risk-score-value');
    const riskLevel = document.getElementById('risk-level');
    const recommendation = document.getElementById('recommendation');
    const downloadReportBtn = document.getElementById('download-report');
    const analyzeNewBtn = document.getElementById('analyze-new');
    const steps = document.querySelectorAll('.analysis-steps .step');
    
    // Example URLs click handler
    exampleUrls.forEach(url => {
        url.addEventListener('click', function() {
            urlInput.value = this.textContent;
        });
    });
    
    // Analyze button click handler
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            const url = urlInput.value.trim();
            
            if (!url) {
                alert('Please enter a URL to analyze');
                return;
            }
            
            if (!isValidUrl(url)) {
                alert('Please enter a valid URL (e.g., https://example.com)');
                return;
            }
            
            // Start analysis
            startAnalysis(url);
        });
    }
    
    // Analyze new button click handler
    if (analyzeNewBtn) {
        analyzeNewBtn.addEventListener('click', function() {
            resultsSection.style.display = 'none';
            urlInput.value = '';
            window.scrollTo({
                top: document.querySelector('.url-input-section').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
    
    // Download report button click handler
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', function() {
            generatePDF();
        });
    }
    
    // URL validation function
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // Start analysis process
    function startAnalysis(url) {
        // Reset steps
        steps.forEach(step => {
            step.querySelector('.step-status').innerHTML = '';
        });
        
        // Show loading section, hide results
        loadingSection.style.display = 'block';
        resultsSection.style.display = 'none';
        
        // Scroll to loading section
        window.scrollTo({
            top: loadingSection.offsetTop - 100,
            behavior: 'smooth'
        });
        
        // Simulate analysis steps with delays
        simulateAnalysisSteps(url);
    }
    
    // Simulate analysis steps
    function simulateAnalysisSteps(url) {
        const stepDelays = [1000, 1500, 2000, 2500, 1800]; // Delays in milliseconds
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                const statusElement = step.querySelector('.step-status');
                statusElement.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success);"></i>';
                
                // If last step, show results after a delay
                if (index === steps.length - 1) {
                    setTimeout(() => {
                        showResults(url);
                    }, 1000);
                }
            }, stepDelays.slice(0, index + 1).reduce((a, b) => a + b, 0));
        });
    }
    
    // Show analysis results
    function showResults(url) {
        // Set analyzed URL
        analyzedUrlElement.textContent = url;
        
        // Determine risk level based on URL characteristics
        const riskData = analyzeUrlRisk(url);
        
        // Set risk score
        riskScoreValue.textContent = riskData.score;
        
        // Set risk level class and text
        riskLevel.textContent = riskData.level;
        riskLevel.className = '';
        
        if (riskData.score >= 70) {
            riskLevel.classList.add('high-risk');
            recommendation.textContent = 'This URL shows multiple signs of being a phishing attempt. We strongly recommend avoiding this website.';
        } else if (riskData.score >= 40) {
            riskLevel.classList.add('medium-risk');
            recommendation.textContent = 'This URL has some suspicious characteristics. Proceed with caution and do not enter sensitive information.';
        } else {
            riskLevel.classList.add('low-risk');
            recommendation.textContent = 'This URL appears to be legitimate, but always remain vigilant when sharing personal information online.';
        }
        
        // Update score circle color
        const scoreCircle = document.querySelector('.score-circle');
        if (riskData.score >= 70) {
            scoreCircle.style.backgroundColor = 'var(--danger)';
        } else if (riskData.score >= 40) {
            scoreCircle.style.backgroundColor = 'var(--warning)';
        } else {
            scoreCircle.style.backgroundColor = 'var(--success)';
        }
        
        // Hide loading, show results
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'block';
        
        // Scroll to results section
        window.scrollTo({
            top: resultsSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }
    
    // Analyze URL risk (simplified for demo)
    function analyzeUrlRisk(url) {
        let score = 0;
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        
        // Check for common secure domains (simplified)
        const secureDomains = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'];
        const isTrustedDomain = secureDomains.some(d => domain.includes(d) && (domain === d || domain.endsWith('.' + d)));
        
        if (isTrustedDomain) {
            score += 10; // Lower score for trusted domains
        } else {
            score += 40; // Higher base score for unknown domains
        }
        
        // Check for HTTPS
        if (urlObj.protocol !== 'https:') {
            score += 20; // Penalize non-HTTPS
        }
        
        // Check for suspicious terms in URL
        const suspiciousTerms = ['login', 'account', 'secure', 'verify', 'banking', 'update', 'confirm', 'paypal', 'password', 'credential'];
        const suspiciousCount = suspiciousTerms.filter(term => url.toLowerCase().includes(term)).length;
        score += suspiciousCount * 5;
        
        // Check for excessive subdomains
        const subdomainCount = domain.split('.').length - 2;
        if (subdomainCount > 2) {
            score += 15;
        }
        
        // Check for URL length (longer URLs are more suspicious)
        if (url.length > 100) {
            score += 15;
        } else if (url.length > 75) {
            score += 10;
        } else if (url.length > 50) {
            score += 5;
        }
        
        // Check for special characters in domain
        if (/[^a-zA-Z0-9.-]/.test(domain)) {
            score += 25;
        }
        
        // Determine risk level
        let level;
        if (score >= 70) {
            level = 'High Risk';
        } else if (score >= 40) {
            level = 'Medium Risk';
        } else {
            level = 'Low Risk';
        }
        
        // Cap score at 100
        score = Math.min(score, 100);
        
        return {
            score,
            level
        };
    }
    
    // Generate PDF report
    function generatePDF() {
        alert('Report download functionality would be implemented here. In a real application, this would generate a PDF with the analysis results.');
    }
});

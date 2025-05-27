// PhishShield - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Theme Toggle Functionality with better mobile support
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference or use prefers-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme based on saved preference or system preference
    if (savedTheme === 'dark' || (savedTheme === null && prefersDarkMode)) {
        body.classList.add('dark-mode');
        if (themeSwitch) {
            themeSwitch.checked = true;
        }
    }
    
    // Theme switch event listener
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                updateDarkModeStyles(true);
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
                updateDarkModeStyles(false);
            }
        });
    }
    
    // Add touch-friendly toggle for mobile
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            // Only toggle if clicking the container, not the actual switch
            if (e.target.closest('.switch') === null && e.target !== themeSwitch) {
                themeSwitch.checked = !themeSwitch.checked;
                
                // Trigger the change event manually
                const changeEvent = new Event('change');
                themeSwitch.dispatchEvent(changeEvent);
            }
        });
    }
    
    // Enhanced function to update specific elements for dark mode with better mobile support
    function updateDarkModeStyles(isDarkMode) {
        // Update text colors for better visibility in dark mode
        const contentElements = document.querySelectorAll(
            '.content-section, .topic-intro p, .education-main ul li, .education-main ol li, ' +
            '.question-text, .answer-option label, .quiz-results p, .education-tip p, ' +
            '.result-item, .accordion-content p, .highlighted-email p'
        );
        
        contentElements.forEach(element => {
            if (isDarkMode) {
                element.style.color = '#f8f9fa';
            } else {
                element.style.color = '';
            }
        });
        
        // Ensure links are visible in dark mode
        const links = document.querySelectorAll('a:not(.nav-links a):not(.footer-links a):not(.btn)');
        links.forEach(link => {
            if (isDarkMode) {
                link.style.color = '#00b4d8';
            } else {
                link.style.color = '';
            }
        });
        
        // Fix background colors for mobile elements in dark mode
        const darkBackgroundElements = document.querySelectorAll(
            '.answer-option, .education-tip, .question-container, .quiz-results, ' +
            '.result-item, .accordion-content, .highlighted-email'
        );
        
        darkBackgroundElements.forEach(element => {
            if (isDarkMode) {
                element.style.backgroundColor = 'rgba(10, 25, 47, 0.7)';
                element.style.borderColor = 'rgba(0, 180, 216, 0.3)';
            } else {
                element.style.backgroundColor = '';
                element.style.borderColor = '';
            }
        });
        
        // Ensure mobile menu is properly styled in dark mode
        const mobileMenu = document.querySelector('.nav-links.active');
        if (mobileMenu) {
            if (isDarkMode) {
                mobileMenu.style.backgroundColor = 'var(--primary-dark)';
            } else {
                mobileMenu.style.backgroundColor = '';
            }
        }
    }
    
    // Apply dark mode styles on page load if needed
    if (savedTheme === 'dark') {
        updateDarkModeStyles(true);
    }
    
    // Mobile Navigation Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Initialize Particles.js on homepage if container exists
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#00b4d8'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00b4d8',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
    
    // Animate stats counter on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const animateStats = function() {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const count = parseInt(stat.innerText);
                
                const increment = target / 100;
                
                if (count < target) {
                    stat.innerText = Math.ceil(count + increment);
                    setTimeout(animateStats, 20);
                } else {
                    stat.innerText = target;
                }
            });
        };
        
        // Start animation when stats section is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
    
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const accordionContent = this.nextElementSibling;
            
            // Toggle current accordion item
            accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
            
            // Toggle icon rotation
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
});

// PhishShield - Education Hub JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const topicListItems = document.querySelectorAll('.topic-list li');
    const topicContents = document.querySelectorAll('.topic-content');
    
    // Initialize topic navigation
    function initTopicNavigation() {
        topicListItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                topicListItems.forEach(li => li.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get topic ID
                const topicId = this.getAttribute('data-topic');
                
                // Hide all topic contents
                topicContents.forEach(content => content.classList.remove('active'));
                
                // Show selected topic content
                document.getElementById(topicId).classList.add('active');
                
                // Scroll to top of content on mobile
                if (window.innerWidth < 768) {
                    window.scrollTo({
                        top: document.querySelector('.education-main').offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Search functionality
    function initSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        
        // Function to perform search
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') return;
            
            let foundMatch = false;
            
            // Search in topic titles and content
            topicContents.forEach((content, index) => {
                const topicText = content.textContent.toLowerCase();
                const topicTitle = content.querySelector('h3').textContent.toLowerCase();
                
                if (topicText.includes(searchTerm) || topicTitle.includes(searchTerm)) {
                    // Show this topic
                    topicListItems.forEach(li => li.classList.remove('active'));
                    topicContents.forEach(c => c.classList.remove('active'));
                    
                    topicListItems[index].classList.add('active');
                    content.classList.add('active');
                    
                    // Highlight the search term
                    highlightSearchTerm(content, searchTerm);
                    
                    foundMatch = true;
                    return;
                }
            });
            
            if (!foundMatch) {
                alert('No results found for "' + searchTerm + '"');
            }
        }
        
        // Function to highlight search terms
        function highlightSearchTerm(content, term) {
            // Create a temporary div to hold the content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content.innerHTML;
            
            // Find all text nodes
            const textNodes = [];
            findTextNodes(tempDiv, textNodes);
            
            // Highlight the term in each text node
            textNodes.forEach(node => {
                const text = node.nodeValue;
                const lowerText = text.toLowerCase();
                let index = lowerText.indexOf(term);
                
                if (index >= 0) {
                    const beforeText = text.substring(0, index);
                    const matchedText = text.substring(index, index + term.length);
                    const afterText = text.substring(index + term.length);
                    
                    const span = document.createElement('span');
                    span.className = 'search-highlight';
                    span.textContent = matchedText;
                    
                    const fragment = document.createDocumentFragment();
                    fragment.appendChild(document.createTextNode(beforeText));
                    fragment.appendChild(span);
                    fragment.appendChild(document.createTextNode(afterText));
                    
                    node.parentNode.replaceChild(fragment, node);
                }
            });
            
            // Update the content
            content.innerHTML = tempDiv.innerHTML;
        }
        
        // Helper function to find all text nodes
        function findTextNodes(node, textNodes) {
            if (node.nodeType === 3) { // Text node
                textNodes.push(node);
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    findTextNodes(node.childNodes[i], textNodes);
                }
            }
        }
        
        // Event listeners
        searchButton.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Function removed as downloadable guides are no longer needed
    
    // No longer needed - content has been replaced with the protection checklist
    
    // Initialize the education hub
    function init() {
        initTopicNavigation();
        initSearchFunctionality();
        
        // Show first topic by default
        if (topicListItems.length > 0) {
            topicListItems[0].classList.add('active');
            topicContents[0].classList.add('active');
        }
    }
    
    // Initialize
    init();
});

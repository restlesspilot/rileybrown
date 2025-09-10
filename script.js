// Page transition functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create transition overlay
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition';
    transitionOverlay.innerHTML = '<div class="page-transition-text">Loading...</div>';
    document.body.appendChild(transitionOverlay);

    // Add click handlers to navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    function navigateToPage(page) {
        // Activate transition overlay
        transitionOverlay.classList.add('active');
        
        // Update transition text
        const transitionText = transitionOverlay.querySelector('.page-transition-text');
        transitionText.textContent = getPageTitle(page);
        
        // Navigate after animation delay
        setTimeout(() => {
            window.location.href = `${page}.html`;
        }, 800);
    }

    function getPageTitle(page) {
        const titles = {
            'about': 'About Riley',
            'vibecode': 'VibeCode',
            'tutorials': 'AI Tutorials',
            'vibe-coding': 'Vibe Coding',
            'projects': 'Recent Projects',
            'social': 'Social Media',
            'contact': 'Contact'
        };
        return titles[page] || 'Loading...';
    }
});

// Back navigation functionality
function goBack() {
    // Create transition overlay if it doesn't exist
    let transitionOverlay = document.querySelector('.page-transition');
    if (!transitionOverlay) {
        transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition';
        transitionOverlay.innerHTML = '<div class="page-transition-text">Riley Brown</div>';
        document.body.appendChild(transitionOverlay);
    }

    // Activate transition
    transitionOverlay.classList.add('active');
    
    // Navigate back to main page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

// Enhanced hover effects for navigation items
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        // Add mouseenter event for enhanced hover effect
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        // Add mouseleave event to reset
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Add click animation
        item.addEventListener('mousedown', function() {
            this.style.transform = 'translateX(15px) scale(1.02)';
        });
        
        item.addEventListener('mouseup', function() {
            this.style.transform = 'translateX(10px)';
        });
    });
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add subtle parallax effect to background texture
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.body;
        const speed = scrolled * 0.1;
        
        parallax.style.transform = `translateY(${speed}px)`;
    });
});

// Add loading animation for pages
window.addEventListener('load', function() {
    const page = document.querySelector('.page.active, .container');
    if (page) {
        page.style.opacity = '0';
        page.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            page.style.transition = 'all 0.6s ease';
            page.style.opacity = '1';
            page.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Go back to main page if on a subpage
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            goBack();
        }
    }
    
    // Number keys for quick navigation
    const keyMap = {
        '1': 'about',
        '2': 'vibecode',
        '3': 'tutorials',
        '4': 'vibe-coding',
        '5': 'projects',
        '6': 'social',
        '7': 'contact'
    };
    
    if (keyMap[e.key] && window.location.pathname.includes('index.html')) {
        e.preventDefault();
        navigateToPage(keyMap[e.key]);
    }
});

// Add touch support for mobile devices
document.addEventListener('DOMContentLoaded', function() {
    let startY = 0;
    let currentY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        currentY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const diffY = startY - currentY;
        
        // Swipe up gesture to go back (only on subpages)
        if (diffY > 50 && window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            goBack();
        }
    });
});
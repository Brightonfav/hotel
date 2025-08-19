// Mobile Navigation JavaScript
console.log("Mobile navigation loading...");

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing mobile navigation');
    
    // Mobile Navigation Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const mainNav = document.getElementById('main-nav');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Debug: Check if elements exist
    console.log('Mobile menu elements found:', {
        mobileMenuBtn: !!mobileMenuBtn,
        mobileCloseBtn: !!mobileCloseBtn,
        mainNav: !!mainNav,
        navOverlay: !!navOverlay,
        navLinksCount: navLinks.length
    });
    
    // Close mobile menu function
    function closeMobileMenu() {
        console.log('Closing mobile menu');
        if (mainNav) {
            mainNav.classList.remove('active');
        }
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Open mobile menu function
    function openMobileMenu() {
        console.log('Opening mobile menu');
        if (mainNav) {
            mainNav.classList.add('active');
        }
        if (navOverlay) {
            navOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Open mobile menu when hamburger button is clicked
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger menu clicked');
            openMobileMenu();
        });
    } else {
        console.error('Mobile menu button not found');
    }
    
    // Close menu when close button is clicked
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            closeMobileMenu();
        });
    }
    
    // Close menu when overlay is clicked
    if (navOverlay) {
        navOverlay.addEventListener('click', function(e) {
            if (e.target === navOverlay) {
                console.log('Overlay clicked');
                closeMobileMenu();
            }
        });
    }
    
    // Close menu on escape key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
            console.log('Escape key pressed');
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mainNav && mainNav.classList.contains('active')) {
            console.log('Window resized to desktop - closing mobile menu');
            closeMobileMenu();
        }
    });
    
    // Close menu when navigation links are clicked
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            console.log('Nav link clicked:', link.textContent);
            closeMobileMenu();
        });
    });
    
    // Handle booking buttons
    const bookingButtons = document.querySelectorAll('.booking-btn, .mobile-booking-btn');
    bookingButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            console.log('Booking button clicked');
            closeMobileMenu();
        });
    });
    
    console.log('Mobile navigation setup complete');
});
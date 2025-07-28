// Complete Mobile Navigation and Hero Slider JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing navigation');
    
    // Image Slider for Hero Section
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Set first slide as active
    if (slides.length > 0) {
        slides[0].classList.add('active');
        console.log('Hero slider initialized with', slides.length, 'slides');
    }
    
    // Change slide every 5 seconds
    if (slides.length > 1) {
        setInterval(function() {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');
            
            // Update current slide index
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Add active class to new current slide
            slides[currentSlide].classList.add('active');
        }, 5000);
    }
    
    // Mobile Navigation Elements - Get all elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const mainNav = document.getElementById('main-nav');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    
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
    } else {
        console.error('Mobile close button not found');
    }
    
    // Close menu when overlay is clicked
    if (navOverlay) {
        navOverlay.addEventListener('click', function(e) {
            if (e.target === navOverlay) {
                console.log('Overlay clicked');
                closeMobileMenu();
            }
        });
    } else {
        console.error('Nav overlay not found');
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
    
    // Smooth Scroll Navigation
    navLinks.forEach(function(link, index) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav link clicked:', link.textContent);
            
            // Get the target section
            const targetId = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetId);
            
            // Close the mobile menu first
            closeMobileMenu();
            
            // Scroll to the target section
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else if (targetId === 'hero') {
                // Special case for home link
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle booking buttons
    const bookingButtons = document.querySelectorAll('.booking-btn, .mobile-booking-btn');
    bookingButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            console.log('Booking button clicked');
            closeMobileMenu();
            // Add your booking functionality here
        });
    });
    
    console.log('Mobile navigation setup complete');
});
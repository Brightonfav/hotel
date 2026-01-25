document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - initializing Hotel Logic');

    // --- Hero Slider Logic (Only active if .slide elements exist) ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        slides[0].classList.add('active');

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // --- Mobile Navigation Logic ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const nav = document.querySelector('nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('nav ul li a');

    function toggleMenu() {
        const isActive = nav.classList.contains('active');
        if (isActive) {
            nav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            nav.classList.add('active');
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- Active Link Highlight ---
    // Sets the 'active' class based on current URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            // Check for anchor links on the same page
            if (currentPage === 'index.html' && linkPage.startsWith('#')) {
                // Logic for scroll spy could go here, but for now we leave it simple
            } else {
                link.classList.remove('active');
            }
        }
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Testimonial Slider Logic ---
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const nextBtn = document.getElementById('testimonial-next-btn');

    if (testimonialCards.length > 0) {
        let currentTestimonial = 0;
        let testimonialInterval;

        function showTestimonial(index) {
            // Hide all
            testimonialCards.forEach(card => card.classList.remove('active'));

            // Show current
            currentTestimonial = (index + testimonialCards.length) % testimonialCards.length;
            testimonialCards[currentTestimonial].classList.add('active');
        }

        function nextTestimonial() {
            showTestimonial(currentTestimonial + 1);
        }

        function startAutoSlide() {
            // Clear any existing interval to prevent duplicates
            if (testimonialInterval) clearInterval(testimonialInterval);
            testimonialInterval = setInterval(nextTestimonial, 5000); // 5 seconds
        }

        function resetTimer() {
            clearInterval(testimonialInterval);
            startAutoSlide();
        }

        // Initialize
        startAutoSlide();

        // Event listener for next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextTestimonial();
                resetTimer(); // Reset timer so it doesn't auto-slide immediately after click
            });
        }
    }

});
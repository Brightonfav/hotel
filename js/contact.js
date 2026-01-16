document.addEventListener('DOMContentLoaded', function () {
    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentElement;
            parent.classList.toggle('faq-active');
        });
    });

    // Form submissions
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Booking request submitted! We will check availability and contact you shortly.');
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
        });
    }

    // Room selection buttons
    const roomSelectBtns = document.querySelectorAll('.room-select-btn');
    roomSelectBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const roomName = this.parentElement.querySelector('h4').textContent;
            const roomSelect = document.querySelector('select[required]');

            // Find the matching option and select it
            if (roomSelect) {
                for (let i = 0; i < roomSelect.options.length; i++) {
                    if (roomSelect.options[i].text.includes(roomName)) {
                        roomSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            // Scroll to booking form
            const bookingFormSection = document.getElementById('booking-form');
            if (bookingFormSection) {
                bookingFormSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

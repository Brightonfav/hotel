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

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // Simulate sending
            setTimeout(() => {
                // success message
                const successHTML = `
                    <div class="success-message" style="background-color: #d4effa; color: #3c763d; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center; border: 1px solid #cceeff;">
                        <i class="bi bi-check-circle-fill" style="font-size: 1.2rem; margin-right: 10px;"></i>
                        <strong>Message Sent!</strong> We'll get back to you shortly.
                    </div>
                `;

                // Remove any existing message
                const existingMsg = contactForm.parentNode.querySelector('.success-message');
                if (existingMsg) existingMsg.remove();

                contactForm.insertAdjacentHTML('afterend', successHTML);
                contactForm.reset();

                // Reset button
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;

                // Remove message after 5 seconds
                setTimeout(() => {
                    const msg = contactForm.parentNode.querySelector('.success-message');
                    if (msg) {
                        msg.style.transition = 'opacity 0.5s';
                        msg.style.opacity = '0';
                        setTimeout(() => msg.remove(), 500);
                    }
                }, 5000);
            }, 1000);
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

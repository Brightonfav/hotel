/**
 * Floating Contact Button
 * Logic for injecting and handling the global floating contact menu
 */

document.addEventListener('DOMContentLoaded', function () {
    injectFloatingContact();
});

function injectFloatingContact() {
    if (document.querySelector('.floating-contact-container')) return;

    const floatingHTML = `
        <div class="floating-contact-container">
            <div class="floating-menu">
                <a href="https://wa.me/09153588159" target="_blank" class="floating-item">
                    <span class="floating-item-label">WhatsApp</span>
                    <div class="floating-item-icon item-whatsapp">
                        <i class="bi bi-whatsapp"></i>
                    </div>
                </a>
                <a href="mailto:info@serenityhavenhotel.com" class="floating-item">
                    <span class="floating-item-label">Email Us</span>
                    <div class="floating-item-icon item-email">
                        <i class="bi bi-envelope-fill"></i>
                    </div>
                </a>
                <a href="tel:+2348136922496" class="floating-item">
                    <span class="floating-item-label">Call Us</span>
                    <div class="floating-item-icon item-call">
                        <i class="bi bi-telephone-fill"></i>
                    </div>
                </a>
            </div>
            <button class="floating-btn-main" id="floating-toggle">
                <i class="bi bi-chat-dots-fill"></i>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', floatingHTML);

    // Add event listener
    const toggleBtn = document.getElementById('floating-toggle');
    const container = document.querySelector('.floating-contact-container');
    const mainIcon = toggleBtn.querySelector('i');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isActive = container.classList.toggle('active');
            if (isActive) {
                mainIcon.classList.remove('bi-chat-dots-fill');
                mainIcon.classList.add('bi-x-lg');
            } else {
                mainIcon.classList.remove('bi-x-lg');
                mainIcon.classList.add('bi-chat-dots-fill');
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && container.classList.contains('active')) {
                container.classList.remove('active');
                mainIcon.classList.remove('bi-x-lg');
                mainIcon.classList.add('bi-chat-dots-fill');
            }
        });
    }
}

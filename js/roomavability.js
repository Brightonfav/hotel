/**
 * Room Availability Checker
 * Handles modal display, date validation, and booking form submission
 */

class RoomAvailabilityChecker {
    constructor() {
        // Initialize the application
        this.init();
    }

    init() {
        // 1. Inject the modal HTML if it doesn't exist
        if (!document.getElementById('availability-modal')) {
            this.injectModalHTML();
        }

        // 2. Select DOM elements AFTER injection
        this.availabilityModal = document.getElementById('availability-modal');
        this.closeModalBtn = document.getElementById('close-modal');
        this.availabilityForm = document.getElementById('availability-form');

        // Select key inputs with specific IDs from the injected modal
        this.checkInInput = document.getElementById('modal-check-in');
        this.checkOutInput = document.getElementById('modal-check-out');

        // Select all booking buttons (nav, mobile nav, hero, cta, etc.)
        this.allBookingBtns = document.querySelectorAll('.booking-btn, .mobile-booking-btn, .room-btn, #check-availability-btn');

        // 3. Setup logic
        this.setInitialDates();
        this.attachEventListeners();
    }

    /**
     * Inject the modal HTML into the document body
     */
    injectModalHTML() {
        const modalHTML = `
            <div id="availability-modal" class="modal-overlay">
                <div id="modal-body-content" class="modal-content">
                    <div class="modal-header">
                        <h2>Check Availability</h2>
                        <button id="close-modal" class="modal-close-btn">&times;</button>
                    </div>
                    <form id="availability-form">
                        <div class="modal-form-group">
                            <label for="modal-check-in">Check-in Date:</label>
                            <input type="date" id="modal-check-in" name="check-in" class="modal-input" required>
                        </div>
                        <div class="modal-form-group">
                            <label for="modal-check-out">Check-out Date:</label>
                            <input type="date" id="modal-check-out" name="check-out" class="modal-input" required>
                        </div>
                        <div class="modal-form-group">
                            <label for="modal-guests">Number of Guests:</label>
                            <select id="modal-guests" name="guests" class="modal-input" required>
                                <option value="1">1 Guest</option>
                                <option value="2" selected>2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4">4 Guests</option>
                                <option value="5">5+ Guests</option>
                            </select>
                        </div>
                        <div class="modal-form-group">
                            <label for="modal-room-type">Room Type:</label>
                            <select id="modal-room-type" name="room-type" class="modal-input" required>
                                <option value="any" selected>Any Available</option>
                                <option value="deluxe">Deluxe Room</option>
                                <option value="executive">Executive Suite</option>
                                <option value="presidential">Presidential Suite</option>
                            </select>
                        </div>
                        <button type="submit" class="booking-btn" style="width: 100%; margin-top: 10px;">Search Availability</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    /**
     * Set minimum dates for check-in and check-out inputs
     */
    setInitialDates() {
        if (!this.checkInInput || !this.checkOutInput) return;

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        this.checkInInput.min = this.formatDate(today);
        this.checkInInput.value = this.formatDate(today);

        this.checkOutInput.min = this.formatDate(tomorrow);
        this.checkOutInput.value = this.formatDate(tomorrow);
    }

    /**
     * Format date to YYYY-MM-DD string
     * @param {Date} date - Date object to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        // Date input change listener
        if (this.checkInInput) {
            this.checkInInput.addEventListener('change', (e) => {
                this.handleCheckInChange(e);
            });
        }

        // Modal open buttons
        if (this.allBookingBtns.length > 0) {
            this.allBookingBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Start: Logic to prevent default "Book Now" scroll behavior only if it triggers the modal
                    // We check if this button is intended to open the modal
                    // For now, ALL .booking-btn open the modal as per user request ("connect all... to open modal")
                    // However, we must be careful with form submit buttons
                    if (btn.closest('form')) return;

                    e.preventDefault();
                    this.openModal();
                });
            });
        }

        // Modal close listeners
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeModal());
        }

        if (this.availabilityModal) {
            this.availabilityModal.addEventListener('click', (e) => {
                if (e.target === this.availabilityModal) {
                    this.closeModal();
                }
            });
        }

        // Form submission
        if (this.availabilityForm) {
            this.availabilityForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    /**
     * Handle check-in date change
     * @param {Event} event - Change event
     */
    handleCheckInChange(event) {
        if (!this.checkOutInput) return;

        const newMinDate = new Date(event.target.value + 'T00:00:00');
        newMinDate.setDate(newMinDate.getDate() + 1);

        this.checkOutInput.min = this.formatDate(newMinDate);

        // If check-out is before new min date, update it
        const checkOutDate = new Date(this.checkOutInput.value + 'T00:00:00');
        const checkInDate = new Date(event.target.value + 'T00:00:00');

        if (checkOutDate <= checkInDate) {
            this.checkOutInput.value = this.formatDate(newMinDate);
        }
    }

    /**
     * Open the availability modal
     */
    openModal() {
        if (!this.availabilityModal) return;

        this.availabilityModal.style.display = 'flex';
        // Force reflow to enable transition
        this.availabilityModal.offsetHeight;
        this.availabilityModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on first input for accessibility
        if (this.checkInInput) {
            setTimeout(() => this.checkInInput.focus(), 100);
        }
    }

    /**
     * Close the availability modal
     */
    closeModal() {
        if (!this.availabilityModal) return;

        this.availabilityModal.classList.remove('active');

        // Wait for transition to finish before hiding
        setTimeout(() => {
            this.availabilityModal.style.display = 'none';
        }, 300);

        document.body.style.overflow = '';
    }

    /**
     * Handle form submission
     * @param {Event} event - Submit event
     */
    handleFormSubmission(event) {
        event.preventDefault();

        const formData = new FormData(this.availabilityForm);
        const checkIn = formData.get('check-in');
        const checkOut = formData.get('check-out');
        const guests = formData.get('guests');

        // Debug: Log the form data
        console.log('Form data:', { checkIn, checkOut, guests });

        // Validate that we got the data
        if (!checkIn || !checkOut) {
            alert('Please select both check-in and check-out dates.');
            return;
        }

        // Validate dates
        if (!this.validateDates(checkIn, checkOut)) {
            return;
        }

        // Show loading state
        this.showLoadingState();

        // Simulate API call
        this.simulateAvailabilityCheck(checkIn, checkOut, guests);
    }

    /**
     * Validate check-in and check-out dates
     * @param {string} checkIn - Check-in date string (YYYY-MM-DD)
     * @param {string} checkOut - Check-out date string (YYYY-MM-DD)
     * @returns {boolean} Whether dates are valid
     */
    validateDates(checkIn, checkOut) {
        // Parse dates reliably by splitting string
        const [inYear, inMonth, inDay] = checkIn.split('-').map(Number);
        const [outYear, outMonth, outDay] = checkOut.split('-').map(Number);

        // Create date objects set to local midnight
        // Month is 0-indexed in JS Date constructor
        const checkInDate = new Date(inYear, inMonth - 1, inDay);
        const checkOutDate = new Date(outYear, outMonth - 1, outDay);

        // Get today's date at midnight local time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if check-in is in the past
        if (checkInDate < today) {
            alert('Check-in date cannot be in the past.');
            return false;
        }

        // Check if check-out is after check-in
        if (checkOutDate <= checkInDate) {
            alert('Check-out date must be after check-in date.');
            return false;
        }

        return true;
    }

    /**
     * Show loading state during availability check
     */
    showLoadingState() {
        const submitBtn = this.availabilityForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Checking Availability...';
            submitBtn.disabled = true;
        }
    }

    /**
     * Reset form to normal state
     * @param {boolean} restore - Whether to restore the original HTML
     */
    resetFormState(restore = false) {
        const modalBody = document.getElementById('modal-body-content');

        if (restore) {
            // Re-inject the form HTML
            modalBody.innerHTML = `
                <div class="modal-header">
                    <h2>Check Availability</h2>
                    <button id="close-modal" class="modal-close-btn">&times;</button>
                </div>
                <form id="availability-form">
                    <div class="modal-form-group">
                        <label for="modal-check-in">Check-in Date:</label>
                        <input type="date" id="modal-check-in" name="check-in" class="modal-input" required>
                    </div>
                    <div class="modal-form-group">
                        <label for="modal-check-out">Check-out Date:</label>
                        <input type="date" id="modal-check-out" name="check-out" class="modal-input" required>
                    </div>
                    <div class="modal-form-group">
                        <label for="modal-guests">Number of Guests:</label>
                        <select id="modal-guests" name="guests" class="modal-input" required>
                            <option value="1">1 Guest</option>
                            <option value="2" selected>2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="5">5+ Guests</option>
                        </select>
                    </div>
                    <div class="modal-form-group">
                        <label for="modal-room-type">Room Type:</label>
                        <select id="modal-room-type" name="room-type" class="modal-input" required>
                            <option value="any" selected>Any Available</option>
                            <option value="deluxe">Deluxe Room</option>
                            <option value="executive">Executive Suite</option>
                            <option value="presidential">Presidential Suite</option>
                        </select>
                    </div>
                    <button type="submit" class="booking-btn" style="width: 100%; margin-top: 10px;">Search Availability</button>
                </form>
            `;

            // Re-initialize elements and listeners since DOM was replaced
            this.availabilityForm = document.getElementById('availability-form');
            this.closeModalBtn = document.getElementById('close-modal');
            this.checkInInput = document.getElementById('modal-check-in'); // Update IDs here too
            this.checkOutInput = document.getElementById('modal-check-out');

            this.setInitialDates(); // Reset dates logic
            this.attachEventListeners(); // Re-attach listeners to new DOM
            return;
        }

        if (this.availabilityForm) {
            const submitBtn = this.availabilityForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Search Availability';
                submitBtn.disabled = false;
            }
        }
    }

    /**
     * Show availability results
     * @param {string} checkIn 
     * @param {string} checkOut 
     * @param {string} guests 
     */
    showResults(checkIn, checkOut, guests) {
        const modalBody = document.getElementById('modal-body-content');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="modal-results">
                <div class="modal-header" style="justify-content: center; border: none; margin-bottom: 10px;">
                    <h2 style="color: var(--text-dark);">Room Available!</h2>
                </div>
                <div class="modal-results-card">
                    <div class="results-row">
                        <strong>Dates:</strong> <span>${checkIn} to ${checkOut}</span>
                    </div>
                    <div class="results-row">
                        <strong>Guests:</strong> <span>${guests}</span>
                    </div>
                    <div class="results-row">
                        <strong>Room Type:</strong> <span>Deluxe Room</span>
                    </div>
                    <div class="results-row total">
                        <strong>Total Price:</strong> <span style="color: var(--primary-color);">$597.00</span>
                    </div>
                </div>
                <button id="confirm-booking-btn" class="booking-btn" style="width: 100%;">Complete Booking</button>
                <button id="back-to-search-btn" class="modal-link-btn">Back to Search</button>
            </div>
        `;

        // Attach listeners to new elements
        document.getElementById('confirm-booking-btn').addEventListener('click', () => this.confirmBooking());
        document.getElementById('back-to-search-btn').addEventListener('click', () => this.resetFormState(true));
    }

    /**
     * Confirm booking and show success
     */
    confirmBooking() {
        const modalBody = document.getElementById('modal-body-content');
        const confirmBtn = document.getElementById('confirm-booking-btn');

        if (confirmBtn) {
            confirmBtn.textContent = 'Processing...';
            confirmBtn.disabled = true;
        }

        setTimeout(() => {
            modalBody.innerHTML = `
                <div class="modal-success">
                    <div class="success-icon">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <h2 style="color: var(--text-dark); margin-bottom: 10px;">Booking Confirmed!</h2>
                    <p style="color: var(--text-light); margin-bottom: 30px;">Thank you for your reservation. A confirmation email has been sent to you.</p>
                    <button id="close-success-btn" class="booking-btn" style="width: 100%;">Close</button>
                </div>
            `;

            // Re-attach close listener since we wiped the old close button
            document.getElementById('close-success-btn').addEventListener('click', () => this.closeModal());
        }, 1500);
    }

    /**
     * Simulate availability check with server
     * @param {string} checkIn 
     * @param {string} checkOut 
     * @param {string} guests 
     */
    simulateAvailabilityCheck(checkIn, checkOut, guests) {
        setTimeout(() => {
            this.showResults(checkIn, checkOut, guests);
        }, 1000);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RoomAvailabilityChecker();
});

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoomAvailabilityChecker;
}
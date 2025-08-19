/**
 * Room Availability Checker
 * Handles modal display, date validation, and booking form submission
 */

class RoomAvailabilityChecker {
    constructor() {
        // DOM elements
        this.navBookBtn = document.getElementById('nav-book-btn');
        this.availabilityModal = document.getElementById('availability-modal');
        this.closeModalBtn = document.getElementById('close-modal');
        this.availabilityForm = document.getElementById('availability-form');
        this.roomBtns = document.querySelectorAll('.room-btn');
        this.checkInInput = document.getElementById('check-in');
        this.checkOutInput = document.getElementById('check-out');
        this.ctaBookBtn = document.querySelector('.cta .room-btn');

        // Initialize the application
        this.init();
    }

    init() {
        this.setInitialDates();
        this.attachEventListeners();
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
        if (this.navBookBtn) {
            this.navBookBtn.addEventListener('click', () => this.openModal());
        }

        if (this.roomBtns.length > 0) {
            this.roomBtns.forEach(btn => {
                btn.addEventListener('click', () => this.openModal());
            });
        }

        if (this.ctaBookBtn) {
            this.ctaBookBtn.addEventListener('click', () => this.openModal());
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
        
        this.availabilityModal.style.display = 'none';
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
        // Parse dates reliably by creating local dates
        // Adding 'T00:00:00' ensures we get local timezone midnight
        const checkInDate = new Date(checkIn + 'T00:00:00');
        const checkOutDate = new Date(checkOut + 'T00:00:00');
        
        // Get today's date at midnight local time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Debug logging
        console.log('Date validation:', {
            checkIn,
            checkOut,
            checkInDate: checkInDate.toDateString(),
            checkOutDate: checkOutDate.toDateString(),
            today: today.toDateString(),
            checkInTime: checkInDate.getTime(),
            todayTime: today.getTime(),
            isPast: checkInDate < today
        });

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
     */
    resetFormState() {
        const submitBtn = this.availabilityForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Search Availability';
            submitBtn.disabled = false;
        }
    }

    /**
     * Simulate availability check with server
     * @param {string} checkIn - Check-in date
     * @param {string} checkOut - Check-out date
     * @param {string} guests - Number of guests
     */
    simulateAvailabilityCheck(checkIn, checkOut, guests) {
        // In a real application, replace this with actual API call
        setTimeout(() => {
            this.resetFormState();
            
            // Simulate successful availability
            alert(`Good news! We have rooms available for your selected dates (${checkIn} to ${checkOut}) for ${guests} guest(s). Redirecting to booking page...`);
            
            // Close modal and potentially redirect
            this.closeModal();
            
            // In a real app, you might redirect here:
            // window.location.href = '/booking';
        }, 1500);
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
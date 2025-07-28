console.log("Gallery scripts loading...");

// Wait for DOM to be ready
$(document).ready(function() {
    console.log("DOM ready - initializing gallery");

    // ----- GALLERY FILTERING -----
    $('.filter-btn').on('click', function() {
        console.log("Filter clicked:", $(this).data('filter'));
        
        // Remove active class and add to current
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        const filterValue = $(this).data('filter');
        
        if (filterValue === 'all') {
            $('.gallery-item').fadeIn(300);
        } else {
            $('.gallery-item').fadeOut(300);
            $(`.gallery-item[data-category="${filterValue}"]`).fadeIn(300);
        }
    });

    // ----- SIMPLE LIGHTBOX -----
    console.log("Setting up simple lightbox...");

    // Create lightbox HTML
    const lightboxHTML = `
        <div id="image-lightbox" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="position: relative; max-width: 90%; max-height: 90%;">
                <img id="lightbox-img" src="" style="
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 8px;
                ">
                <div id="lightbox-caption" style="
                    color: white;
                    text-align: center;
                    margin-top: 15px;
                    font-size: 18px;
                "></div>
                <button id="close-lightbox" style="
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>
        </div>
    `;

    // Add lightbox to body
    $('body').append(lightboxHTML);
    
    // Hide lightbox initially
    $('#image-lightbox').hide();

    // Handle gallery item clicks - Multiple selectors to catch any click
    $(document).on('click', '.gallery-item, .gallery-item img, .gallery-overlay, .view-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log("Gallery item clicked!");
        
        // Find the parent gallery item
        let $galleryItem = $(this);
        if (!$galleryItem.hasClass('gallery-item')) {
            $galleryItem = $(this).closest('.gallery-item');
        }
        
        // Get the image
        const $img = $galleryItem.find('img');
        if ($img.length === 0) {
            console.error("No image found");
            return;
        }
        
        const imageSrc = $img.attr('src');
        const imageTitle = $galleryItem.find('.gallery-overlay h3').text() || $img.attr('alt') || 'Gallery Image';
        
        console.log("Image source:", imageSrc);
        console.log("Image title:", imageTitle);
        
        // Set lightbox content
        $('#lightbox-img').attr('src', imageSrc);
        $('#lightbox-caption').text(imageTitle);
        
        // Show lightbox with fade in
        $('#image-lightbox').fadeIn(300);
    });

    // Close lightbox when clicking close button
    $(document).on('click', '#close-lightbox', function(e) {
        e.stopPropagation();
        $('#image-lightbox').fadeOut(300);
    });

    // Close lightbox when clicking outside image
    $(document).on('click', '#image-lightbox', function(e) {
        if (e.target === this) {
            $('#image-lightbox').fadeOut(300);
        }
    });

    // Close lightbox with Escape key
    $(document).on('keydown', function(e) {
        if (e.keyCode === 27 && $('#image-lightbox').is(':visible')) {
            $('#image-lightbox').fadeOut(300);
        }
    });

    // ----- TESTIMONIAL SLIDER -----
    const testimonials = [
        {
            text: "The attention to detail at Serenity Haven is remarkable. From the stunning architecture to the impeccable service, our stay was nothing short of perfection.",
            author: "Emily Johnson",
            title: "Luxury Travel Enthusiast"
        },
        {
            text: "Our family vacation at Serenity Haven was exceptional. The staff went above and beyond to ensure our comfort, and the amenities were perfect for both adults and children.",
            author: "Michael Thompson", 
            title: "Family Traveler"
        },
        {
            text: "As a business traveler, I appreciate efficiency and comfort. Serenity Haven delivers both, along with unexpected touches of luxury that made my work trip feel like a retreat.",
            author: "Sarah Williams",
            title: "Business Executive"
        }
    ];

    let currentTestimonial = 0;

    // Add testimonial navigation if testimonial slider exists
    if ($('.testimonial-slider').length > 0) {
        $('.testimonial-slider').append(`
            <div class="testimonial-nav" style="margin-top:20px; text-align:center;">
                <button class="testimonial-prev" style="background:none; border:none; color:#d4af37; font-size:24px; cursor:pointer; margin:0 10px;">
                    <i class="bi bi-arrow-left-circle"></i>
                </button>
                <button class="testimonial-next" style="background:none; border:none; color:#d4af37; font-size:24px; cursor:pointer; margin:0 10px;">
                    <i class="bi bi-arrow-right-circle"></i>
                </button>
            </div>
        `);

        function updateTestimonial(index) {
            $('.testimonial-text').fadeOut(200, function() {
                $(this).html('"' + testimonials[index].text + '"').fadeIn(200);
            });
            $('.author-info h4').fadeOut(200, function() {
                $(this).text(testimonials[index].author).fadeIn(200);
            });
            $('.author-info p').fadeOut(200, function() {
                $(this).text(testimonials[index].title).fadeIn(200);
            });
        }

        $('.testimonial-prev').on('click', function() {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            updateTestimonial(currentTestimonial);
        });

        $('.testimonial-next').on('click', function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial(currentTestimonial);
        });

        // Auto-rotate testimonials
        setInterval(function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial(currentTestimonial);
        }, 5000);
    }
    // ----- VIRTUAL TOUR -----
    $(document).on('click', '.virtual-tour-placeholder .room-btn', function() {
        $('.virtual-tour-frame').html(`
            <div style="position:relative; width:100%; height:100%; background:#000; display:flex; align-items:center; justify-content:center;">
                <div style="color:white; text-align:center;">
                    <i class="bi bi-360-degree" style="font-size:60px; margin-bottom:20px;"></i>
                    <h3>Virtual Tour Experience</h3>
                    <p>360° Hotel Tour Loading...</p>
                </div>
                <button class="close-tour-btn" style="position:absolute; top:10px; right:10px; background:#d4af37; color:white; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer;">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `);
    });

    $(document).on('click', '.close-tour-btn', function() {
        $('.virtual-tour-frame').html(`
            <div class="virtual-tour-placeholder">
                <div class="virtual-tour-icon">
                    <i class="bi bi-360-degree"></i>
                </div>
                <h3>360° Virtual Tour Experience</h3>
                <p>Explore our hotel through an interactive virtual tour.</p>
                <button class="room-btn" style="margin-top:20px;">Start Tour</button>
            </div>
        `);
    });

    // ----- ANIMATIONS -----
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: false,
            mirror: true
        });
    }

    // Hover effects
    $('.gallery-item').hover(
        function() {
            $(this).find('img').css('transform', 'scale(1.05)');
            $(this).find('.gallery-overlay').css('opacity', '1');
        },
        function() {
            $(this).find('img').css('transform', 'scale(1)');
            $(this).find('.gallery-overlay').css('opacity', '0');
        }
    );

    console.log("Gallery initialization complete!");
});
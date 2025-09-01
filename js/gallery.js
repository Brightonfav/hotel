console.log("Gallery scripts loading...");

// Ensure jQuery is loaded
function waitForJQuery(callback) {
    if (typeof $ !== 'undefined') {
        callback();
    } else {
        console.log("Waiting for jQuery...");
        setTimeout(() => waitForJQuery(callback), 100);
    }
}

// Wait for both jQuery and DOM to be ready
waitForJQuery(function() {
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

        // ----- IMPROVED LIGHTBOX -----
        console.log("Setting up improved lightbox...");

        // Create lightbox HTML with fixed CSS
        const lightboxHTML = `
            <div id="image-lightbox" class="lightbox-overlay">
                <div class="lightbox-container">
                    <img id="lightbox-img" src="" alt="Gallery Image">
                    <div id="lightbox-caption"></div>
                    <button id="close-lightbox" class="close-btn">&times;</button>
                    <div id="lightbox-loading" class="loading-spinner">Loading...</div>
                </div>
            </div>
        `;

        // Add lightbox CSS
        const lightboxCSS = `
            <style>
                .lightbox-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 9999;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .lightbox-overlay.active {
                    display: flex;
                    opacity: 1;
                }
                
                .lightbox-container {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    text-align: center;
                }
                
                #lightbox-img {
                    max-width: 100%;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                }
                
                #lightbox-caption {
                    color: white;
                    text-align: center;
                    margin-top: 15px;
                    font-size: 18px;
                    padding: 0 20px;
                }
                
                .close-btn {
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 24px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    transition: background-color 0.2s ease;
                }
                
                .close-btn:hover {
                    background: #f0f0f0;
                }
                
                .loading-spinner {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 18px;
                    display: none;
                }
                
                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .close-btn {
                        top: 10px;
                        right: 10px;
                        width: 35px;
                        height: 35px;
                        font-size: 20px;
                    }
                    
                    #lightbox-caption {
                        font-size: 16px;
                        margin-top: 10px;
                    }
                }
            </style>
        `;

        // Add CSS and lightbox to page
        $('head').append(lightboxCSS);
        $('body').append(lightboxHTML);

        // Function to open lightbox
        function openLightbox(imageSrc, imageTitle) {
            console.log("Opening lightbox with:", imageSrc, imageTitle);
            
            // Show loading
            $('#lightbox-loading').show();
            $('#lightbox-img').hide();
            
            // Set up the image
            const $lightboxImg = $('#lightbox-img');
            $lightboxImg.attr('src', '').attr('alt', imageTitle);
            $('#lightbox-caption').text(imageTitle);
            
            // Show lightbox
            $('#image-lightbox').addClass('active');
            
            // Load the image
            $lightboxImg.on('load.lightbox', function() {
                console.log("Image loaded successfully");
                $('#lightbox-loading').hide();
                $(this).fadeIn(300);
            }).on('error.lightbox', function() {
                console.error("Failed to load image:", imageSrc);
                $('#lightbox-loading').hide();
                $('#lightbox-caption').html(`
                    <span style="color: #ff6b6b;">Failed to load image</span><br>
                    <span style="font-size: 14px;">${imageTitle}</span>
                `);
            });
            
            // Set the source after setting up handlers
            $lightboxImg.attr('src', imageSrc);
        }

        // Function to close lightbox
        function closeLightbox() {
            console.log("Closing lightbox");
            $('#image-lightbox').removeClass('active');
            
            // Clean up image handlers and reset
            setTimeout(() => {
                $('#lightbox-img').off('.lightbox').attr('src', '').hide();
                $('#lightbox-loading').hide();
                $('#lightbox-caption').text('');
            }, 300);
        }

        // Handle gallery item clicks with better event delegation
        $(document).on('click', '.gallery-item', function(e) {
            // Don't trigger if clicking on filter buttons or other controls
            if ($(e.target).hasClass('filter-btn') || $(e.target).closest('.filter-btn').length) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            console.log("Gallery item clicked!");
            
            const $galleryItem = $(this);
            const $img = $galleryItem.find('img').first();
            
            if ($img.length === 0) {
                console.error("No image found in gallery item");
                return;
            }
            
            // Get image source and handle different possible src attributes
            let imageSrc = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original');
            
            if (!imageSrc) {
                console.error("No valid image source found");
                return;
            }
            
            // Handle relative URLs
            if (imageSrc.startsWith('./') || imageSrc.startsWith('../')) {
                imageSrc = new URL(imageSrc, window.location.href).href;
            }
            
            // Get title from various sources
            const imageTitle = $galleryItem.find('.gallery-overlay h3').text() || 
                              $galleryItem.find('h3').text() || 
                              $img.attr('alt') || 
                              $img.attr('title') || 
                              'Gallery Image';
            
            console.log("Opening image:", imageSrc);
            openLightbox(imageSrc, imageTitle);
        });

        // Also handle direct image clicks
        $(document).on('click', '.gallery-item img', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('.gallery-item').trigger('click');
        });

        // Close lightbox events
        $(document).on('click', '#close-lightbox', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });

        // Close when clicking overlay background
        $(document).on('click', '#image-lightbox', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });

        // Close with Escape key
        $(document).on('keydown', function(e) {
            if (e.keyCode === 27 && $('#image-lightbox').hasClass('active')) {
                closeLightbox();
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

        // Improved hover effects with error handling
        $('.gallery-item').hover(
            function() {
                const $img = $(this).find('img');
                const $overlay = $(this).find('.gallery-overlay');
                
                if ($img.length) {
                    $img.css({
                        'transform': 'scale(1.05)',
                        'transition': 'transform 0.3s ease'
                    });
                }
                
                if ($overlay.length) {
                    $overlay.css({
                        'opacity': '1',
                        'transition': 'opacity 0.3s ease'
                    });
                }
            },
            function() {
                const $img = $(this).find('img');
                const $overlay = $(this).find('.gallery-overlay');
                
                if ($img.length) {
                    $img.css('transform', 'scale(1)');
                }
                
                if ($overlay.length) {
                    $overlay.css('opacity', '0');
                }
            }
        );

        // ----- IMAGE LOADING ERROR HANDLING -----
        $('.gallery-item img').on('error', function() {
            console.error("Failed to load gallery image:", $(this).attr('src'));
            $(this).attr('src', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not found</text></svg>');
        });

        console.log("Gallery initialization complete!");
        
        // Debug: Log gallery items found
        console.log("Gallery items found:", $('.gallery-item').length);
        console.log("Gallery images found:", $('.gallery-item img').length);
    });
});

// ----- FALLBACK FOR NON-JQUERY ENVIRONMENTS -----
// If jQuery fails to load, provide basic functionality
setTimeout(function() {
    if (typeof $ === 'undefined') {
        console.warn("jQuery not found, using vanilla JavaScript fallback");
        
        // Basic vanilla JS lightbox
        document.addEventListener('DOMContentLoaded', function() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            if (galleryItems.length === 0) {
                console.log("No gallery items found");
                return;
            }
            
            // Create simple lightbox
            const lightbox = document.createElement('div');
            lightbox.id = 'simple-lightbox';
            lightbox.style.cssText = `
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.9);
                z-index: 9999;
                justify-content: center;
                align-items: center;
            `;
            
            lightbox.innerHTML = `
                <div style="position: relative; max-width: 90%; max-height: 90%; text-align: center;">
                    <img id="simple-lightbox-img" style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px;">
                    <div id="simple-lightbox-caption" style="color: white; margin-top: 15px; font-size: 18px;"></div>
                    <button id="simple-close-btn" style="position: absolute; top: -40px; right: -40px; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer;">&times;</button>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Add click handlers
            galleryItems.forEach(item => {
                item.addEventListener('click', function() {
                    const img = this.querySelector('img');
                    if (!img) return;
                    
                    const src = img.src;
                    const title = this.querySelector('.gallery-overlay h3')?.textContent || img.alt || 'Gallery Image';
                    
                    document.getElementById('simple-lightbox-img').src = src;
                    document.getElementById('simple-lightbox-caption').textContent = title;
                    lightbox.style.display = 'flex';
                });
            });
            
            // Close lightbox
            document.getElementById('simple-close-btn').addEventListener('click', function() {
                lightbox.style.display = 'none';
            });
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.style.display = 'none';
                }
            });
            
            console.log("Vanilla JS fallback initialized");
        });
    }
}, 1000);
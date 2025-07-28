 // Gallery modal functionality
 const openGalleryBtns = document.querySelectorAll('.open-gallery');
 let galleryModal = document.querySelector('.gallery-modal');
 
 // Create gallery modal if it doesn't exist
 if (!galleryModal && openGalleryBtns.length > 0) {
     const modalHTML = `
         <div class="gallery-modal">
             <div class="gallery-content">
                 <div class="gallery-slide active">
                     <img src="images/img 7.webp" alt="Room Gallery">
                 </div>
                 <div class="gallery-slide">
                     <img src="images/img 8.webp" alt="Room Gallery">
                 </div>
                 <div class="gallery-slide">
                     <img src="images/img 9.webp" alt="Room Gallery">
                 </div>
             </div>
             <button class="gallery-close"><i class="bi bi-x-lg"></i></button>
             <button class="gallery-nav gallery-prev"><i class="bi bi-chevron-left"></i></button>
             <button class="gallery-nav gallery-next"><i class="bi bi-chevron-right"></i></button>
             <div class="gallery-controls">
                 <img src="images/img 7.webp" class="gallery-thumbnail active" data-index="0">
                 <img src="images/img 8.webp" class="gallery-thumbnail" data-index="1">
                 <img src="images/img 9.webp" class="gallery-thumbnail" data-index="2">
             </div>
         </div>
     `;
     document.body.insertAdjacentHTML('beforeend', modalHTML);
     galleryModal = document.querySelector('.gallery-modal');
 }
 
 // Gallery functionality
 if (galleryModal) {
     const slides = document.querySelectorAll('.gallery-slide');
     const thumbnails = document.querySelectorAll('.gallery-thumbnail');
     const closeBtn = document.querySelector('.gallery-close');
     const prevBtn = document.querySelector('.gallery-prev');
     const nextBtn = document.querySelector('.gallery-next');
     let currentSlide = 0;
     
     // Open gallery modal
     openGalleryBtns.forEach(btn => {
         btn.addEventListener('click', function(e) {
             e.preventDefault();
             galleryModal.style.display = 'block';
             document.body.style.overflow = 'hidden';
         });
     });
     
     // Close gallery modal
     if (closeBtn) {
         closeBtn.addEventListener('click', function() {
             galleryModal.style.display = 'none';
             document.body.style.overflow = 'auto';
         });
     }
     
     // Change slide functions
     function showSlide(index) {
         slides.forEach(slide => slide.classList.remove('active'));
         thumbnails.forEach(thumb => thumb.classList.remove('active'));
         
         slides[index].classList.add('active');
         thumbnails[index].classList.add('active');
         currentSlide = index;
     }
     
     // Next slide
     if (nextBtn) {
         nextBtn.addEventListener('click', function() {
             let newIndex = currentSlide + 1;
             if (newIndex >= slides.length) newIndex = 0;
             showSlide(newIndex);
         });
     }
     
     // Previous slide
     if (prevBtn) {
         prevBtn.addEventListener('click', function() {
             let newIndex = currentSlide - 1;
             if (newIndex < 0) newIndex = slides.length - 1;
             showSlide(newIndex);
         });
     }
     
     // Thumbnail click
     thumbnails.forEach((thumb, index) => {
         thumb.addEventListener('click', function() {
             showSlide(index);
         });
     });
 }
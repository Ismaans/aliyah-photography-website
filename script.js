/* ============================================
   MOBILE-FIRST JAVASCRIPT ENHANCEMENTS
   ============================================
   Mobile improvements include:
   - Enhanced menu toggle with outside-click and escape key support
   - Touch/swipe gestures for modal gallery navigation
   - Body scroll prevention when modal is open (iOS-friendly)
   - Lazy loading for images below the fold
   - Eager loading for modal images (immediate display)
   ============================================ */

// Mobile Menu Toggle - Enhanced for mobile usability
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    // Toggle menu on button click
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside (mobile-friendly)
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
}

// Load gallery data from JSON
let galleryData = [];
let projectData = {};
let allHomepagePhotos = []; // All photos from all projects for cycling
let projectsList = []; // List of projects for indicators

// Fetch homepage gallery data
async function loadGalleryData() {
    try {
        const response = await fetch('/_data/homepage_gallery.json');
        const data = await response.json();
        galleryData = data.items.map(item => ({
            src: item.src.startsWith('http') ? item.src : (item.src.startsWith('/') ? item.src : '/' + item.src),
            title: item.title,
            description: item.description || '',
            project: item.project
        }));
    } catch (error) {
        console.error('Error loading gallery data:', error);
        // Fallback to default data
        galleryData = [
            { src: 'images/gallery-1.jpg', title: 'Portrait Series', project: 'project1' },
            { src: 'images/gallery-2.jpg', title: 'Fashion Editorial', project: 'project2' },
            { src: 'images/gallery-3.jpg', title: 'Beauty Portraits', project: 'project3' },
            { src: 'images/gallery-4.jpg', title: 'Cultural Heritage', project: 'project4' }
        ];
    }
}

// Fetch projects data
async function loadProjectsData() {
    try {
        const response = await fetch('/_data/projects.json');
        const data = await response.json();
        projectData = {};
        projectsList = data.projects;
        
        data.projects.forEach(project => {
            projectData[project.id] = {
                images: project.images
                    .map(img => {
                        if (!img || !img.image) return null;
                        let imgPath = img.image;
                        // Ensure path starts with / if it's a local path
                        if (!imgPath.startsWith('http') && !imgPath.startsWith('/')) {
                            imgPath = '/' + imgPath;
                        }
                        // Remove leading /images/ if it's already there to avoid double slash
                        if (imgPath.startsWith('/images/')) {
                            return imgPath;
                        }
                        // Add /images/ if it's missing
                        if (!imgPath.startsWith('http') && !imgPath.includes('/images/')) {
                            imgPath = '/images/' + imgPath.replace(/^\/+/, '');
                        }
                        return imgPath;
                    })
                    .filter(img => img !== null), // Remove null entries
                title: project.title,
                description: project.description
            };
            
            // Add all photos from this project to homepage gallery
            project.images.forEach(img => {
                const imgPath = img.image.startsWith('/') ? img.image : '/' + img.image;
                allHomepagePhotos.push({
                    src: imgPath,
                    title: project.title,
                    project: project.id
                });
            });
        });
        
        if (document.querySelector('.work-page')) {
            renderWorkGallery(data.projects);
            initWorkPage();
        }
    } catch (error) {
        console.error('Error loading projects data:', error);
        // Fallback to default data
        const fallbackProjects = [
            { id: 'project1', title: 'Portrait Series', thumbnail: 'images/work-1.jpg', images: [{image: 'images/work-1.jpg'}] },
            { id: 'project2', title: 'Fashion Editorial', thumbnail: 'images/work-2.jpg', images: [{image: 'images/work-2.jpg'}] },
            { id: 'project3', title: 'Beauty Portraits', thumbnail: 'images/work-3.jpg', images: [{image: 'images/work-3.jpg'}] },
            { id: 'project4', title: 'Cultural Heritage', thumbnail: 'images/work-4.jpg', images: [{image: 'images/work-4.jpg'}] },
            { id: 'project5', title: 'Portrait Collection', thumbnail: 'images/work-5.jpg', images: [{image: 'images/work-5.jpg'}] },
            { id: 'project6', title: 'Fashion Series', thumbnail: 'images/work-6.jpg', images: [{image: 'images/work-6.jpg'}] }
        ];
        projectsList = fallbackProjects;
        projectData = {
            project1: { images: ['images/work-1.jpg'], title: 'Portrait Series', description: 'A collection of intimate portraits.' },
            project2: { images: ['images/work-2.jpg'], title: 'Fashion Editorial', description: 'Contemporary fashion photography.' },
            project3: { images: ['images/work-3.jpg'], title: 'Beauty Portraits', description: 'Focus on natural beauty.' },
            project4: { images: ['images/work-4.jpg'], title: 'Cultural Heritage', description: 'Celebrating South Asian traditions.' },
            project5: { images: ['images/work-5.jpg'], title: 'Portrait Collection', description: 'A diverse collection of portraits.' },
            project6: { images: ['images/work-6.jpg'], title: 'Fashion Series', description: 'Exploring fashion and culture.' }
        };
        fallbackProjects.forEach(project => {
            project.images.forEach(img => {
                allHomepagePhotos.push({
                    src: img.image,
                    title: project.title,
                    project: project.id
                });
            });
        });
        if (document.querySelector('.work-page')) {
            renderWorkGallery(fallbackProjects);
            initWorkPage();
        }
    }
}

// Render work gallery from projects data
function renderWorkGallery(projects) {
    const workGallery = document.getElementById('workGallery');
    if (!workGallery) return;
    
    workGallery.innerHTML = projects.map(project => {
        const thumbnail = project.thumbnail.startsWith('http') ? project.thumbnail : (project.thumbnail.startsWith('/') ? project.thumbnail : '/' + project.thumbnail);
        return `
            <div class="work-item" data-project="${project.id}">
                <img src="${thumbnail}" alt="${project.title}" loading="lazy" decoding="async">
                <div class="work-overlay">
                    <h3>${project.title}</h3>
                    <p>View Project</p>
                </div>
            </div>
        `;
    }).join('');
}

// Load about page data
async function loadAboutData() {
    try {
        // Load about photo separately
        const photoResponse = await fetch('/_data/about_photo.json');
        const photoData = await photoResponse.json();
        
        // Load about text
        const textResponse = await fetch('/_data/about.json');
        const textData = await textResponse.json();
        
        const aboutImage = document.getElementById('aboutImage');
        const aboutText = document.getElementById('aboutText');
        
        // Set about photo (prioritize about_photo.json, fallback to about.json)
        if (aboutImage) {
            const imagePath = photoData?.image || textData?.image;
            if (imagePath) {
                aboutImage.src = imagePath.startsWith('http') ? imagePath : (imagePath.startsWith('/') ? imagePath : '/' + imagePath);
            }
        }
        
        // Set about text
        if (aboutText && textData.text && Array.isArray(textData.text)) {
            aboutText.innerHTML = textData.text.map(item => `<p>${item.paragraph || item}</p>`).join('');
        }
    } catch (error) {
        console.error('Error loading about data:', error);
        // Keep default content if loading fails
    }
}

// Initialize data loading
document.addEventListener('DOMContentLoaded', async () => {
    if (document.querySelector('.homepage')) {
        // Load both gallery and projects data for homepage
        await loadProjectsData();
        await loadGalleryData();
        // After both load, create homepage gallery that cycles through the 4 gallery items
        createHomepageGallery();
    }
    if (document.querySelector('.work-page') || document.querySelector('.project-modal')) {
        loadProjectsData();
    }
    if (document.querySelector('.about-page')) {
        loadAboutData();
    }
});

// Create homepage gallery that cycles through the 4 gallery items
function createHomepageGallery() {
    // Use only the galleryData (the 4 items from homepage_gallery.json)
    if (galleryData.length === 0) return;
    
    // Create indicators based on the 4 gallery items
    const galleryContainer = document.querySelector('.gallery-indicators');
    if (galleryContainer && galleryData.length > 0) {
        galleryContainer.innerHTML = galleryData.map((item, index) => 
            `<span class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}" data-project="${item.project}" title="${item.title}"></span>`
        ).join('');
    }
    
    const galleryImages = document.querySelectorAll('.gallery-image');
    const galleryArrows = document.querySelectorAll('.gallery-arrow');
    const indicators = document.querySelectorAll('.indicator');
    let currentImageIndex = 0;
    let autoPlayInterval = null;

    if (galleryImages.length > 0 && galleryData.length > 0) {
        function showImage(index) {
            if (index < 0 || index >= galleryData.length) return;
            
            galleryImages.forEach((img, i) => {
                img.classList.remove('active');
                if (i === 0) { // Use the first image element
                    img.classList.add('active');
                    img.src = galleryData[index].src;
                    img.setAttribute('data-project', galleryData[index].project);
                    
                    // Update overlay
                    const overlay = img.parentElement.querySelector('.image-overlay');
                    if (overlay) {
                        overlay.querySelector('.image-title').textContent = galleryData[index].title;
                        const desc = overlay.querySelector('.image-description');
                        if (desc) {
                            desc.textContent = galleryData[index].description || 'Click to view project';
                        }
                    }
                }
            });

            // Update active indicator
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });

            currentImageIndex = index;
        }

        // Arrow navigation
        galleryArrows.forEach(arrow => {
            arrow.addEventListener('click', () => {
                clearInterval(autoPlayInterval);
                if (arrow.classList.contains('gallery-arrow-left')) {
                    currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
                } else {
                    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
                }
                showImage(currentImageIndex);
                startAutoPlay();
            });
        });

        // Indicator navigation - click to view project/album
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                clearInterval(autoPlayInterval);
                currentImageIndex = index;
                showImage(currentImageIndex);
                startAutoPlay();
                
                // Also navigate to work page to view full album
                const projectId = indicator.getAttribute('data-project');
                if (projectId) {
                    window.location.href = `work.html#${projectId}`;
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (galleryImages.length > 0 && galleryImages[0].classList.contains('active')) {
                clearInterval(autoPlayInterval);
                if (e.key === 'ArrowLeft') {
                    currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
                    showImage(currentImageIndex);
                } else if (e.key === 'ArrowRight') {
                    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
                    showImage(currentImageIndex);
                }
                startAutoPlay();
            }
        });

        // Click on gallery image to go to work page
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                const project = img.getAttribute('data-project');
                if (project) {
                    window.location.href = `work.html#${project}`;
                }
            });
        });
        
        // Also make the overlay clickable
        const overlay = document.querySelector('.image-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                const activeImg = document.querySelector('.gallery-image.active');
                if (activeImg) {
                    const project = activeImg.getAttribute('data-project');
                    if (project) {
                        window.location.href = `work.html#${project}`;
                    }
                }
            });
            overlay.style.cursor = 'pointer';
        }

        // Auto-play function - cycles through the 4 gallery items
        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % galleryData.length;
                showImage(currentImageIndex);
            }, 4000); // Change every 4 seconds
        }

        // Pause on hover
        const galleryMain = document.querySelector('.gallery-main');
        if (galleryMain) {
            galleryMain.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });
            galleryMain.addEventListener('mouseleave', () => {
                startAutoPlay();
            });
        }

        // Initialize first image and start auto-play
        showImage(0);
        startAutoPlay();
    }
}

// Legacy function - kept for compatibility but replaced by createHomepageGallery
function initHomepageGallery() {
    // This is now handled by createHomepageGallery()
}

// Work Page - Project Modal
function initWorkPage() {
    const workItems = document.querySelectorAll('.work-item');
    const projectModal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalImageContainer = document.querySelector('.modal-image-container');
    const modalClose = document.querySelector('.modal-close');
    const modalArrows = document.querySelectorAll('.modal-arrow');

    let currentProject = null;
    let currentProjectImageIndex = 0;
    
    /* ============================================
       MOBILE DETECTION - Responsive Behavior
       ============================================
       Mobile (< 640px): Vertical scrolling with all images stacked
       Desktop (>= 640px): Single image with arrow navigation
       ============================================ */
    const isMobile = () => window.innerWidth < 640;

    if (workItems.length > 0) {
        workItems.forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.getAttribute('data-project');
                openProjectModal(projectId);
            });
        });
    }

    function openProjectModal(projectId) {
        if (!projectData[projectId]) {
            console.error('Project not found:', projectId);
            return;
        }
        
        currentProject = projectId;
        currentProjectImageIndex = 0;
        const project = projectData[projectId];
        
        if (!project.images || project.images.length === 0) {
            console.error('No images in project:', projectId);
            return;
        }
        
        // Filter out invalid/missing images
        const validImages = project.images.filter(img => img && img.trim() !== '');
        if (validImages.length === 0) {
            console.warn('No valid images found for project:', projectId);
            return;
        }
        
        /* ============================================
           MOBILE: Create Horizontal Scrolling Layout
           ============================================
           On mobile, create multiple image wrappers stacked horizontally
           for smooth left-to-right scrolling/swiping experience
           ============================================ */
        if (isMobile() && modalImageContainer) {
            // Clear existing content
            modalImageContainer.innerHTML = '';
            
            // Create image wrappers for each image in the project
            validImages.forEach((imagePath, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'modal-image-wrapper';
                wrapper.setAttribute('data-index', index);
                
                const img = document.createElement('img');
                img.src = imagePath;
                img.className = 'modal-image';
                img.alt = project.title || 'Project image';
                img.loading = index === 0 ? 'eager' : 'lazy';
                img.decoding = 'async';
                
                wrapper.appendChild(img);
                modalImageContainer.appendChild(wrapper);
            });
            
            // Scroll to first image (horizontal scroll)
            const firstWrapper = modalImageContainer.querySelector('.modal-image-wrapper');
            if (firstWrapper) {
                firstWrapper.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' });
            }
        } else {
            /* ============================================
               DESKTOP: Single Image Display
               ============================================
               On desktop, use existing single image swap behavior
               ============================================ */
            // Reset error count
            if (modalImage) {
                modalImage.removeAttribute('data-error-count');
            }
            
            if (modalImage) {
                const firstImage = validImages[0];
                // Preload first image
                const img = new Image();
                img.onload = () => {
                    if (modalImage) {
                        modalImage.src = firstImage;
                        modalImage.style.display = 'block';
                        modalImage.style.opacity = '1';
                        modalImage.alt = project.title || 'Project image';
                        modalImage.loading = 'eager';
                    }
                };
                img.onerror = () => {
                    console.error('Failed to load first image:', firstImage);
                    if (validImages.length > 1) {
                        currentProjectImageIndex = 1;
                        setTimeout(() => navigateProjectImage('next'), 100);
                    } else {
                        closeProjectModal();
                    }
                };
                img.src = firstImage;
            }
        }
        
        if (projectModal) {
            projectModal.classList.add('active');
            // Prevent body scroll when modal is open (mobile-friendly)
            document.body.style.overflow = 'hidden';
            // Also prevent scroll on iOS
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            
            // Only start auto-play on desktop (mobile uses manual scrolling)
            if (!isMobile()) {
                startModalAutoPlay();
            }
        }
    }
    
    let modalAutoPlayInterval = null;
    
    function startModalAutoPlay() {
        clearInterval(modalAutoPlayInterval);
        if (!currentProject || isMobile()) return; // No auto-play on mobile
        
        modalAutoPlayInterval = setInterval(() => {
            navigateProjectImage('next');
        }, 3000); // Change photo every 3 seconds
    }
    
    function stopModalAutoPlay() {
        clearInterval(modalAutoPlayInterval);
    }

    function closeProjectModal() {
        stopModalAutoPlay();
        if (projectModal) {
            projectModal.classList.remove('active');
            // Restore body scroll (CSS also handles this, but JS ensures it)
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        
        /* ============================================
           RESTORE ORIGINAL MODAL STRUCTURE
           ============================================
           On mobile, we clear innerHTML to create scrolling layout
           On close, restore original structure for next open
           ============================================ */
        if (modalImageContainer && isMobile()) {
            // Restore original structure with single modal-image element
            modalImageContainer.innerHTML = '<img src="" alt="" class="modal-image" id="modalImage" loading="eager" decoding="async">';
        }
        
        currentProject = null;
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }

    function navigateProjectImage(direction) {
        /* ============================================
           DESKTOP: Arrow Navigation
           ============================================
           Only works on desktop - mobile uses scrolling
           ============================================ */
        if (isMobile()) return; // Disable arrow navigation on mobile
        
        if (!currentProject || !projectData[currentProject]) return;
        
        const project = projectData[currentProject];
        const validImages = project.images.filter(img => img && img.trim() !== '');
        const totalImages = validImages.length;
        
        if (totalImages === 0) {
            closeProjectModal();
            return;
        }
        
        if (direction === 'next') {
            currentProjectImageIndex = (currentProjectImageIndex + 1) % totalImages;
        } else {
            currentProjectImageIndex = (currentProjectImageIndex - 1 + totalImages) % totalImages;
        }
        
        if (modalImage && validImages[currentProjectImageIndex]) {
            const imagePath = validImages[currentProjectImageIndex];
            modalImage.style.opacity = '0';
            
            // Preload image to ensure it loads
            const img = new Image();
            img.onload = () => {
                if (modalImage) {
                    modalImage.src = imagePath;
                    modalImage.style.opacity = '1';
                    modalImage.style.display = 'block';
                    modalImage.alt = project.title || 'Project image';
                    // Ensure modal images load immediately (not lazy)
                    modalImage.loading = 'eager';
                }
            };
            img.onerror = () => {
                console.error('Failed to load image:', imagePath);
                const attempts = modalImage.getAttribute('data-error-count') || 0;
                if (parseInt(attempts) < totalImages && totalImages > 1) {
                    modalImage.setAttribute('data-error-count', parseInt(attempts) + 1);
                    setTimeout(() => {
                        if (direction === 'next') {
                            navigateProjectImage('next');
                        } else {
                            navigateProjectImage('prev');
                        }
                    }, 100);
                } else {
                    console.warn('No valid images could be loaded');
                    closeProjectModal();
                }
            };
            img.src = imagePath;
        }
    }

    /* ============================================
       ARROW NAVIGATION - Desktop Only
       ============================================
       Arrows are hidden on mobile via CSS, but we also disable
       their functionality to ensure they don't interfere
       ============================================ */
    if (modalArrows.length > 0) {
        modalArrows.forEach(arrow => {
            arrow.addEventListener('click', (e) => {
                // Only work on desktop (mobile uses scrolling)
                if (isMobile()) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                
                e.stopPropagation();
                stopModalAutoPlay();
                if (arrow.classList.contains('modal-arrow-right')) {
                    navigateProjectImage('next');
                } else if (arrow.classList.contains('modal-arrow-left')) {
                    navigateProjectImage('prev');
                }
                startModalAutoPlay();
            });
        });
    }
    
    // Pause auto-play on hover (desktop only)
    if (projectModal && !isMobile()) {
        projectModal.addEventListener('mouseenter', stopModalAutoPlay);
        projectModal.addEventListener('mouseleave', startModalAutoPlay);
    }

    // Close modal on outside click
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
    }

    // Keyboard navigation for modal (desktop only)
    document.addEventListener('keydown', (e) => {
        if (projectModal && projectModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeProjectModal();
            } else if (!isMobile()) {
                // Arrow keys only work on desktop (mobile uses scrolling)
                if (e.key === 'ArrowLeft') {
                    stopModalAutoPlay();
                    navigateProjectImage('prev');
                    startModalAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    stopModalAutoPlay();
                    navigateProjectImage('next');
                    startModalAutoPlay();
                }
            }
        }
    });

    /* ============================================
       MOBILE: Enable Horizontal Swipe/Scroll
       ============================================
       On mobile, we use horizontal scrolling (left-to-right)
       Vertical swipes are prevented to avoid interference with horizontal scrolling
       ============================================ */
    if (projectModal && isMobile()) {
        // Allow horizontal scrolling, prevent vertical swipes that might interfere
        let touchStartX = 0;
        let touchStartY = 0;
        
        projectModal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        projectModal.addEventListener('touchmove', (e) => {
            // Allow horizontal scrolling, prevent vertical swipes
            const touchX = e.changedTouches[0].screenX;
            const touchY = e.changedTouches[0].screenY;
            const deltaX = Math.abs(touchX - touchStartX);
            const deltaY = Math.abs(touchY - touchStartY);
            
            // If horizontal movement is greater, allow it (scrolling)
            // If vertical movement is greater, prevent it to avoid page scroll
            if (deltaY > deltaX && deltaY > 10) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Store functions globally for hash navigation
    window.openProjectModal = openProjectModal;
    
    // Handle hash navigation to open project from homepage
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (hash && projectData[hash]) {
            setTimeout(() => openProjectModal(hash), 100);
        }
    }
}


// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Set reply-to field to the user's email
    const emailInput = document.getElementById('email');
    const replyToField = document.getElementById('replyto');
    
    if (emailInput && replyToField) {
        emailInput.addEventListener('input', function() {
            replyToField.value = emailInput.value;
        });
    }
    
    contactForm.addEventListener('submit', function(e) {
        const submitButton = contactForm.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Form will submit to Formspree, which will handle the email
        // The form will redirect to a success page or show a message
    });
}


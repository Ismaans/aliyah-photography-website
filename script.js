// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
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
                images: project.images.map(img => {
                    const imgPath = img.image.startsWith('http') ? img.image : (img.image.startsWith('/') ? img.image : '/' + img.image);
                    return imgPath;
                }),
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
                <img src="${thumbnail}" alt="${project.title}">
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
    const modalClose = document.querySelector('.modal-close');
    const modalArrows = document.querySelectorAll('.modal-arrow');

    let currentProject = null;
    let currentProjectImageIndex = 0;

    if (workItems.length > 0) {
        workItems.forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.getAttribute('data-project');
                openProjectModal(projectId);
            });
        });
    }

    function openProjectModal(projectId) {
        if (!projectData[projectId]) return;
        
        currentProject = projectId;
        currentProjectImageIndex = 0;
        const project = projectData[projectId];
        
        if (modalImage && project.images.length > 0) {
            modalImage.src = project.images[0];
        }
        
        if (projectModal) {
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            startModalAutoPlay();
        }
    }
    
    let modalAutoPlayInterval = null;
    
    function startModalAutoPlay() {
        clearInterval(modalAutoPlayInterval);
        if (!currentProject) return;
        
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
            document.body.style.overflow = '';
        }
        currentProject = null;
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }

    function navigateProjectImage(direction) {
        if (!currentProject) return;
        
        const project = projectData[currentProject];
        const totalImages = project.images.length;
        
        if (direction === 'next') {
            currentProjectImageIndex = (currentProjectImageIndex + 1) % totalImages;
        } else {
            currentProjectImageIndex = (currentProjectImageIndex - 1 + totalImages) % totalImages;
        }
        
        if (modalImage && project.images[currentProjectImageIndex]) {
            modalImage.style.opacity = '0';
            setTimeout(() => {
                modalImage.src = project.images[currentProjectImageIndex];
                modalImage.style.opacity = '1';
            }, 200);
        }
    }

    if (modalArrows.length > 0) {
        modalArrows.forEach(arrow => {
            arrow.addEventListener('click', (e) => {
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
    
    // Pause auto-play on hover
    if (projectModal) {
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

    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (projectModal && projectModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeProjectModal();
            } else if (e.key === 'ArrowLeft') {
                stopModalAutoPlay();
                navigateProjectImage('prev');
                startModalAutoPlay();
            } else if (e.key === 'ArrowRight') {
                stopModalAutoPlay();
                navigateProjectImage('next');
                startModalAutoPlay();
            }
        }
    });

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


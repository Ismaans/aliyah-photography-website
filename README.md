# Aliyah Tasnim Photography Website

A modern, responsive photography portfolio website built with HTML, CSS, and JavaScript.

## Features

- **Homepage Gallery**: Large image gallery with arrow navigation and clickable images
- **Work Page**: Grid layout with hover effects that reveal project information
- **About Page**: Personal photo and biography section
- **Contact Page**: Instagram link and contact information
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern Color Scheme**: Updated color palette with off-white background

## File Structure

```
aliyah-photography-website/
├── index.html          # Homepage with gallery
├── work.html           # Work/portfolio page
├── about.html          # About page
├── contact.html        # Contact page
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
├── images/             # Image directory (create this)
│   ├── gallery-1.jpg
│   ├── gallery-2.jpg
│   ├── gallery-3.jpg
│   ├── gallery-4.jpg
│   ├── work-1.jpg
│   ├── work-2.jpg
│   ├── work-3.jpg
│   ├── work-4.jpg
│   ├── work-5.jpg
│   ├── work-6.jpg
│   └── about-photo.jpg
└── README.md
```

## Setup Instructions

1. **Add Images**: 
   - Create an `images` folder in the project root
   - Add your photos with the following names:
     - `gallery-1.jpg` through `gallery-4.jpg` (for homepage gallery)
     - `work-1.jpg` through `work-6.jpg` (for work page)
     - `about-photo.jpg` (for about page)

2. **Update Content**:
   - Edit `about.html` to update the biography text
   - Edit `contact.html` to update the Instagram link (currently set to `https://www.instagram.com/aliyahtasnimphoto/`)
   - Update project data in `script.js` if you want to change project titles/descriptions

3. **Customize Colors**:
   - Edit the CSS variables in `styles.css` under `:root` to change the color scheme

4. **Open the Website**:
   - Simply open `index.html` in a web browser
   - Or use a local server for better performance

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --bg-color: #FFFAF0;        /* Background color */
    --primary-color: #2D5016;   /* Main green color */
    --secondary-color: #5A8A3A;  /* Secondary green */
    --accent-color: #8B7355;     /* Accent brown */
}
```

### Adding More Projects
1. Add more work items in `work.html`
2. Add corresponding project data in `script.js` under `projectData`
3. Add more gallery images in `script.js` under `galleryData`

### Updating Instagram Link
Edit the `href` attribute in `contact.html`:
```html
<a href="https://www.instagram.com/aliyahtasnimphoto/" ...>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All images should be optimized for web (recommended: JPEG format, under 500KB each)
- The website is fully responsive and works on all screen sizes
- Hover effects work best on desktop/laptop devices
- Touch-friendly navigation for mobile devices


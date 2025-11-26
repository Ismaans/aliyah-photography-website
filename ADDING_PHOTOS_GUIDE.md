# Simple Guide: How to Add Photos to the Website

## Quick Steps for Adding New Photos

### Step 1: Add Your Photo to the Images Folder
1. Put your new photo in the `images/` folder
2. Name it something clear like: `work-7.jpg` or `new-portrait.jpg`
3. Make sure it's a JPG file (or convert it to JPG)

### Step 2: Add Photo to Work Page

Open `work.html` in a text editor (like Notepad, TextEdit, or VS Code).

Find this section (around line 33-76):
```html
<div class="work-gallery">
    <div class="work-item" data-project="project1">
        <img src="images/work-1.jpg" alt="Portrait Photography">
        ...
    </div>
    ...
</div>
```

**Add a new work item** by copying one of the existing items and pasting it before the closing `</div>` tag:

```html
<div class="work-item" data-project="project7">
    <img src="images/work-7.jpg" alt="Your Photo Description">
    <div class="work-overlay">
        <h3>Your Project Title</h3>
        <p>View Project</p>
    </div>
</div>
```

**Important:** 
- Change `data-project="project7"` to a unique name (project7, project8, etc.)
- Change `src="images/work-7.jpg"` to your actual photo filename
- Change the title in `<h3>` to your project name

### Step 3: Add Project Details to script.js

Open `script.js` and find the `projectData` section (around line 129).

Add a new project entry:
```javascript
project7: {
    images: ['images/work-7.jpg', 'images/work-7-2.jpg', 'images/work-7-3.jpg'],
    title: 'Your Project Title',
    description: 'Description of your project here.'
},
```

**Note:** If you only have one photo, just put it in the array: `['images/work-7.jpg']`

### Step 4: Save and View

1. Save both files (`work.html` and `script.js`)
2. Open `index.html` in your browser
3. Your new photo should appear on the Work page!

---

## Adding Photos to Homepage Gallery

To add photos to the homepage gallery, edit `script.js` and find `galleryData` (around line 27).

Add a new entry:
```javascript
{
    src: 'images/gallery-5.jpg',
    title: 'Your Gallery Title',
    project: 'project7'
},
```

Then in `index.html`, add another indicator dot:
```html
<span class="indicator" data-index="4"></span>
```

---

## Tips

- **Image Size:** Keep photos under 1MB for faster loading
- **Image Format:** Use JPG for photos, PNG for graphics
- **Naming:** Use clear names like `portrait-1.jpg` instead of `IMG_1234.jpg`
- **Backup:** Always keep a backup of your files before making changes

---

## Need Help?

If you get stuck:
1. Check that your image filename matches exactly (case-sensitive!)
2. Make sure the image is in the `images/` folder
3. Check that you saved all files after editing
4. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)

---

## Easier Option Coming Soon!

I'm working on creating a simple admin page where you can:
- Upload photos with a click
- Add titles and descriptions
- No coding required!

Stay tuned! 🎉


# Kumkum Rastogi — Portfolio

A dark-themed, glassmorphism-style personal portfolio built with plain HTML, CSS, and JavaScript
(no build step or dependencies required).

## Structure

```
portfolio/
├── index.html        # Main page — all sections (Hero, About, Skills, Experience,
│                        Featured Project, Projects, Certifications, Education,
│                        GitHub, Contact, Footer)
├── css/
│   └── style.css      # All styling: design tokens, layout, animations, responsive rules
├── js/
│   └── script.js       # Scroll progress bar, reveal animations, stat count-up,
│                          mobile nav, back-to-top button
└── public/
    ├── profile.jpg     # (add your own) profile photo
    └── resume.pdf      # (add your own) downloadable resume
```

## Running it

No build tools needed. Just open `index.html` in a browser, or serve the folder locally:

```
cd portfolio
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Deploying

Drag-and-drop the whole `portfolio` folder onto Netlify, or push it to a GitHub repo and enable
GitHub Pages — no build step required since everything is static HTML/CSS/JS.

## To finish setting up

1. Add `public/resume.pdf` and update the three resume buttons in `index.html` (search for
   `resume-btn`) to link to `public/resume.pdf`.
2. Replace the LinkedIn `#` placeholders (3 spots) with your real profile URL.
3. Swap in real project/demo links where GitHub icons currently point to your profile.
4. Update the GitHub stats numbers (repositories / contributions / languages) in the
   `#github` section with your real figures, or connect the GitHub API for live data.

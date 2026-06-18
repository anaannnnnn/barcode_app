# Desire Group — Landing Page

A fast, responsive, single-page marketing site for **Desire Group**, built with plain
HTML, CSS, and vanilla JavaScript — no build step, no dependencies.

## Structure

```
index.html   # Page markup (hero, stats, about, services, approach, contact, footer)
styles.css   # Styling, layout, responsive rules, and animations
script.js    # Mobile nav, scroll-reveal, animated counters, contact form handling
```

## Run locally

It's a static site — just open `index.html` in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit http://localhost:8000.

## Notes

- The contact form is front-end only (shows a confirmation message); wire it to a
  backend or form service to actually receive submissions.
- Respects `prefers-reduced-motion` for accessibility.

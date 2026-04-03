# Cinémathèque Website (GitHub Pages)

This repository contains a static website built from Stitch MCP screens.

## GitHub Pages setup

- Source: `docs/` folder
- Branch: `main` (or as configured)
- Publish: `gh-pages` branch via GitHub Actions

## Local testing

1. `cd website`
2. `python -m http.server 8000`
3. Open `http://localhost:8000`

## To deploy

- Push to `main` and the workflow `.github/workflows/github-pages.yml` will deploy `docs/` to `gh-pages`.
- After first run, go to repository Settings -> Pages and select `gh-pages` branch.

## Content structure

- `website/` - editable source files
- `docs/` - GitHub Pages deployment copy
- `website/assets/` and `docs/assets/` - posters and metadata
- `website/index.html` etc. are the site pages loaded for navigation

## Add series/movies posters

1. Add poster images to `website/assets/posters/`.
2. Add content in `website/assets/movies/` and `website/assets/series/`.
3. Update `website/movies.html` or `website/series.html` with relative image paths.
4. Copy files to `docs/` with `robocopy website docs /E`.

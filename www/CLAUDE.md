# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the NÍTIDA DIGITAL agency website built with Astro. The homepage features an interactive Conway's Game of Life animation displaying "NÍTIDA DIGITAL" with smooth background color transitions.

## Architecture

**Astro SSR Website** with file-based routing:
- **src/pages/index.astro** - Homepage with Game of Life animation
- **src/pages/works.astro** - Portfolio/projects showcase page
- **src/pages/contact.astro** - Contact information and form page
- **public/** - Static assets (Game of Life JS modules, CSS, favicon)

## Key Components

### Game of Life System
- **public/app.js** - Main application logic, canvas setup, UI controls, background animation
- **public/life.js** - Core Game of Life engine with cellular automata rules and rendering
- **public/letters.js** - Bitmap font definitions for custom letter patterns
- **public/style.css** - CSS animations, glassmorphism UI, responsive design

### Design Features
- **Interactive homepage**: Game of Life with "NÍTIDA DIGITAL" text patterns
- **CSS background animation**: Smooth gradient transitions (only when game running)
- **Navigation**: Fade-in buttons after 3 seconds, positioned bottom-center
- **Responsive design**: Mobile-friendly layouts across all pages
- **Monospace typography**: Consistent technical aesthetic
- **Glassmorphism UI**: Semi-transparent panels with backdrop blur

## Development Commands

```bash
npm run dev        # Start development server (http://localhost:4321)
npm run build      # Build for production
npm run preview    # Preview production build locally
```

## Content Structure

- **Homepage**: Animated Game of Life hero with delayed navigation
- **Works page**: Project portfolio grid with technology stacks
- **Contact page**: Two-column layout with contact info and form

## Technical Notes

- Game of Life uses custom letter patterns with configurable spacing and positioning
- Background color animation runs in CSS (hardware accelerated) only during game simulation
- Canvas renders black cells on transparent background over animated CSS gradient
- Dev controls available in corner for tweaking animation parameters
- All pages share consistent gradient background and glassmorphism design language
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Conway's Game of Life implementation that displays the word "NÍTIDA" as initial patterns. The Game of Life simulation runs on an HTML5 canvas with animated cellular automata evolution.

## Architecture

- **index.html**: Main HTML page with canvas element and controls
- **app.js**: Main application entry point that handles UI setup, canvas configuration, and animation controls
- **life.js**: Core Game of Life engine (`Life` class) with cellular automata logic, rendering, and pattern insertion
- **letters.js**: Bitmap font definitions for letters used in the "NÍTIDA" text display

## Key Components

### Life Class (`life.js`)
- Implements Conway's Game of Life rules with configurable grid size
- Features progressive column evolution (expands simulation area gradually)
- Supports color interpolation with pulsing animation between blue and lime
- Handles pattern insertion for custom initial states
- Includes predefined patterns (still lifes, oscillators, spaceships)

### Text Rendering System
- Custom bitmap font definitions in `letters.js` for large block letters
- `centerShapes()` function in `app.js` handles text positioning and spacing
- Supports accent marks (accent on the "Í" in "NÍTIDA")

### Canvas Management
- Responsive canvas sizing based on window dimensions
- Cell size of 14 pixels for optimal visibility
- Dynamic grid calculation to fit screen size

## Development Workflow

Since this is a simple client-side JavaScript project with no build system:

1. Open `index.html` directly in a browser
2. Use browser developer tools for debugging
3. Refresh page to see changes
4. No compilation or build steps required

## Running the Application

Simply open `index.html` in a web browser. The application will:
- Display the "NÍTIDA" text as initial Game of Life patterns
- Provide controls for starting/pausing the simulation
- Allow adjustment of animation interval speed
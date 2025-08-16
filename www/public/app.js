console.log('🚀 NÍTIDA app.js v2.0 - Loading...')

import Life from "./life.js"
import { LETTERS } from "./letters.js";

// Production fallback checks
if (typeof Life === 'undefined') {
  console.error('Life module failed to load')
}
if (typeof LETTERS === 'undefined') {
  console.error('LETTERS module failed to load')
}

console.log('📦 Modules loaded successfully')

/**
 * Centers multiple rows of letter patterns horizontally and vertically
 * within a given grid size.
 *
 * @param {Array} rowsData - Array of row objects with { letters, letterSpacing, xOffset }
 * @param {number} gridCols - Total columns in the canvas/grid
 * @param {number} gridRows - Total rows in the canvas/grid
 * @param {number} rowSpacing - Space (in rows) between rows
 * @returns {Array} Array of shape objects with { x, y, pattern }
 */
function centerShapes(rowsData, gridCols, gridRows, rowSpacing = 3) {
  const shapes = []
  
  // Calculate dimensions for each row
  const processedRows = rowsData.map(rowData => {
    const { letters, letterSpacing = 2, xOffset = 0 } = rowData
    const letterHeights = letters.map(l => l.length)
    const letterWidths = letters.map(l => l[0].length)
    const totalWidth = letterWidths.reduce(
      (sum, w, i) => sum + w + (i < letters.length - 1 ? letterSpacing : 0),
      0
    )
    const maxHeight = Math.max(...letterHeights)
    
    return { letters, letterWidths, totalWidth, maxHeight, letterSpacing, xOffset }
  })
  
  // Calculate total height of all rows
  const totalHeight = processedRows.reduce(
    (sum, data, i) => sum + data.maxHeight + (i < processedRows.length - 1 ? rowSpacing : 0),
    0
  )
  
  // Calculate starting Y position to center all rows vertically
  let currentY = Math.floor((gridRows - totalHeight) / 2)
  
  // Process each row
  for (const { letters, letterWidths, totalWidth, maxHeight, letterSpacing, xOffset } of processedRows) {
    const baseXOffset = Math.floor((gridCols - totalWidth) / 2)
    let cursorX = baseXOffset + xOffset

    for (let i = 0; i < letters.length; i++) {
      shapes.push({
        x: cursorX,
        y: currentY,
        pattern: letters[i]
      })
      cursorX += letterWidths[i] + letterSpacing
    }
    
    currentY += maxHeight + rowSpacing
  }

  return shapes
}

/**
 * Removes rows n-2 and n-3 from a letter pattern (where n is total height)
 * @param {Array} pattern - 2D array representing the letter
 * @returns {Array} Modified 2D array with rows n-2 and n-3 removed
 */
function removeMiddleBottomRows(pattern) {
  const n = pattern.length
  if (n < 4) return pattern // Don't modify if too short
  
  // Remove rows at indices n-3 and n-2 (fourth-to-last and third-to-last)
  const result = []
  for (let i = 0; i < n; i++) {
    if (i !== n-3 && i !== n-2) {
      result.push(pattern[i])
    }
  }
  return result
}

// Text to display
const nitidaRow = [LETTERS.N, LETTERS.I, LETTERS.T, LETTERS.I, LETTERS.D, LETTERS.A]
const digitalRow = [LETTERS.D, LETTERS.I, LETTERS.G, LETTERS.I, LETTERS.T, LETTERS.A, LETTERS.L].map((letter, index) => {
  // Keep G (index 2) as is, modify all others
  return index === 2 ? letter : removeMiddleBottomRows(letter)
})

function getResponsiveTextRows() {
  const width = window.innerWidth
  
  // Adjust spacing based on screen size
  if (width <= 480) {
    // Mobile: tighter spacing to fit
    return [
      { letters: nitidaRow, letterSpacing: 2 },
      { letters: digitalRow, letterSpacing: 1, xOffset: 0 }
    ]
  } else if (width <= 768) {
    // Tablet: slightly tighter
    return [
      { letters: nitidaRow, letterSpacing: 1 },
      { letters: digitalRow, letterSpacing: 1, xOffset: 1 }
    ]
  } else {
    // Desktop: original spacing
    return [
      { letters: nitidaRow, letterSpacing: 2 },
      { letters: digitalRow, letterSpacing: 1, xOffset: 1 }
    ]
  }
}

function getResponsiveCellSize() {
  const width = window.innerWidth
  const height = window.innerHeight
  
  // Responsive cell size based on screen dimensions
  // Ensure letters fit well within viewport
  if (width <= 480) return Math.max(6, Math.min(width, height) / 60)   // Mobile: scale to fit
  if (width <= 768) return Math.max(8, Math.min(width, height) / 55)   // Tablet: proportional scaling
  if (width <= 1024) return 12 // Small desktop: slightly smaller
  if (width <= 1440) return 14 // Sweet spot: original size
  if (width <= 1920) return Math.min(16, width / 90) // Large screens: scale with width
  return Math.min(20, width / 100) // Very large screens: prevent over-stretching
}

// --- Global Variables ---
let canvas = null
let life = null
let intervalTime = 100 // Default value
let running = false
let interval = null

// Initialize canvas safely
function initCanvas() {
  if (!canvas) {
    canvas = document.querySelector("#canvas")
    if (!canvas) {
      console.warn('Canvas element not found')
      return false
    }
  }
  return true
}

// --- Core Functions ---
function run() {
  try {
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
      if (life && typeof life.next === 'function') {
        life.next()
      }
    }, intervalTime || 100)
  } catch (error) {
    console.warn('Error in run function:', error)
  }
}

function setupCanvas() {
  try {
    if (!initCanvas()) {
      return
    }
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cellSize = getResponsiveCellSize()
    const cols = Math.floor(canvas.width / cellSize)
    const rows = Math.floor(canvas.height / cellSize)
    const sideLength = Math.min(cols, rows)

    // Get responsive text rows and center them
    const textRows = getResponsiveTextRows()
    let baseShapes = centerShapes(textRows, sideLength, sideLength)

    // Add accent above the first "I" in NÍTIDA (find the second letter in first row)
    if (baseShapes.length > 1) {
      const nitidaShapes = baseShapes.filter((shape, index) => index < textRows[0].letters.length)
      if (nitidaShapes.length > 1) {
        baseShapes.push({
          x: nitidaShapes[1].x + 1,
          y: nitidaShapes[1].y - 3,
          pattern: LETTERS.ACCENT
        })
      }
    }

    // Final shapes
    const shapes = baseShapes

    // Create or recreate Life instance
    if (typeof Life === 'function') {
      life = new Life(canvas, sideLength, shapes)
    } else {
      console.warn('Life class not available')
    }
  } catch (error) {
    console.warn('Error in setupCanvas:', error)
  }
}

// --- Initialization ---
// Multiple DOM ready strategies for production compatibility
function initializeApp() {
  try {
    console.log('Initializing app...')
    
    // Debug: Check if CSS styles are loaded
    const testElement = document.createElement('div')
    testElement.className = 'info-modal visible'
    document.body.appendChild(testElement)
    const computedStyle = window.getComputedStyle(testElement)
    console.log('🎨 CSS test - info-modal.visible opacity:', computedStyle.opacity)
    document.body.removeChild(testElement)
    
    // Initial setup
    setupCanvas()

  // Set up interval control
  const intervalInput = document.getElementById("interval")
  if (intervalInput) {
    intervalTime = intervalInput.value || 100
    intervalInput.addEventListener('change', (e) => {
      intervalTime = e.target.value || 100
      if (running) {
        run() // Restart with new interval
      }
    })
  }

  // Auto-start Game of Life after 2.5 seconds
  setTimeout(() => {
    if (!running) {
      run()
      const pauseBtn = document.getElementById("pause")
      if (pauseBtn) {
        pauseBtn.innerText = "Pause"
      }
      document.body.classList.add("animating")
      running = true
    }
  }, 2500)

  // --- Event Listeners ---
  
  // Info button functionality (navigation button)
  const infoBtnNav = document.getElementById("info-btn-nav")
  console.log('🔍 Info button found:', !!infoBtnNav)
  if (infoBtnNav) {
    infoBtnNav.addEventListener("click", () => {
      console.log('📱 Info button clicked')
      const infoModal = document.getElementById("info-modal")
      console.log('🎭 Info modal found:', !!infoModal)
      if (infoModal) {
        infoModal.classList.add("visible")
        console.log('✅ Info modal should be visible now. Classes:', infoModal.className)
        console.log('🎨 Modal computed styles opacity:', window.getComputedStyle(infoModal).opacity)
        console.log('🎨 Modal computed styles visibility:', window.getComputedStyle(infoModal).visibility)
      }
    })
  }

  // Control button functionality (navigation button)
  const controlBtnNav = document.getElementById("control-btn-nav")
  console.log('🎮 Control button found:', !!controlBtnNav)
  if (controlBtnNav) {
    controlBtnNav.addEventListener("click", () => {
      console.log('🎮 Control button clicked')
      const devControls = document.querySelector('.dev-controls')
      console.log('🎛️ Dev controls found:', !!devControls)
      if (devControls) {
        devControls.classList.toggle('visible')
        console.log('✅ Dev controls visibility toggled. Classes:', devControls.className)
      }
    })
  }

  // Control panel close button
  const controlClose = document.getElementById("control-close")
  if (controlClose) {
    controlClose.addEventListener("click", () => {
      const devControls = document.querySelector('.dev-controls')
      if (devControls) {
        devControls.classList.remove('visible')
      }
    })
  }

  // Modal close functionality
  const modalClose = document.getElementById("modal-close")
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      const infoModal = document.getElementById("info-modal")
      if (infoModal) {
        infoModal.classList.remove("visible")
      }
    })
  }

  // Close modal when clicking outside content
  const infoModal = document.getElementById("info-modal")
  if (infoModal) {
    infoModal.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        infoModal.classList.remove("visible")
      }
    })
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const infoModal = document.getElementById("info-modal")
      if (infoModal) {
        infoModal.classList.remove("visible")
      }
    }
  })

  // Dev controls pause button
  const pauseBtn = document.getElementById("pause")
  if (pauseBtn) {
    pauseBtn.addEventListener("click", (e) => {
      if (running) {
        clearInterval(interval)
        e.target.innerText = "Start"
        document.body.classList.add("paused")
        running = false
      } else {
        run()
        e.target.innerText = "Pause"
        document.body.classList.remove("paused")
        running = true
      }
    })
  }

  // Restart button functionality
  const restartBtn = document.getElementById("restart")
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      // Stop current animation
      if (running) {
        clearInterval(interval)
        running = false
      }
      
      // Reset and restart the game
      setupCanvas()
      
      // Update button states
      const pauseBtn = document.getElementById("pause")
      if (pauseBtn) {
        pauseBtn.innerText = "Pause"
      }
      
      // Start animation
      run()
      document.body.classList.add("animating")
      document.body.classList.remove("paused")
      running = true
    })
  }

  // Spawn glider functionality
  const spawnGliderBtn = document.getElementById("spawn-glider")
  if (spawnGliderBtn) {
    spawnGliderBtn.addEventListener("click", () => {
      if (life) {
        // Use GLIDER (moves left to right)
        const gliderPattern = life.PATTERNS.SPACESHIPS.GLIDER
        
        // Always spawn from left side (x = 2), randomize Y position
        const maxY = life.config.lines - 8 // Leave space for pattern height
        const randomY = Math.floor(Math.random() * (maxY - 2)) + 2 // Random Y from 2 to maxY
        
        // Spawn the glider at random Y position from left side
        life.insertPattern(randomY, 2, gliderPattern)
        life.draw() // Redraw to show the new glider immediately
      }
    })
  }
  } catch (error) {
    console.error('Error initializing app:', error)
  }
}

// Multiple DOM ready strategies for production compatibility
function safeInit() {
  try {
    console.log('🔄 Starting safe initialization...')
    
    // Double check everything is available
    if (typeof initializeApp !== 'function') {
      console.error('initializeApp function not available')
      return
    }
    
    initializeApp()
  } catch (error) {
    console.error('Error in safeInit:', error)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInit)
} else {
  // DOM is already ready
  setTimeout(safeInit, 100) // Slightly longer delay for production
}

// Handle window resize
window.addEventListener('resize', () => {
  setupCanvas()
  // Restart animation if it was running
  if (running) {
    run() // This will clear the old interval and start new one
    document.body.classList.add("animating")
  }
})
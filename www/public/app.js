import Life from "./life.js"
import { LETTERS } from "./letters.js";

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
// const webDesignRow = [LETTERS.W, LETTERS.E, LETTERS.B, LETTERS.AMPERSAND, LETTERS.D, LETTERS.E, LETTERS.S, LETTERS.I, LETTERS.G, LETTERS.N]
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

// --- Canvas Setup ---
const canvas = document.querySelector("#canvas")

let life = null

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

function setupCanvas() {
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
  const nitidaShapes = baseShapes.filter((shape, index) => index < textRows[0].letters.length)
  baseShapes.push({
    x: nitidaShapes[1].x + 1,
    y: nitidaShapes[1].y - 3,
    pattern: LETTERS.ACCENT
  })

  // Final shapes
  const shapes = baseShapes

  // Create or recreate Life instance
  life = new Life(canvas, sideLength, shapes)
}

// Initial setup
setupCanvas()

// Auto-start Game of Life after 2.5 seconds
setTimeout(() => {
  if (!running) {
    run()
    document.getElementById("pause").innerText = "Pause"
    document.body.classList.add("animating")
    running = true
    // Show play/pause control
    document.querySelector('.play-pause-control').classList.add('visible')
  }
}, 2500)

// Handle window resize
window.addEventListener('resize', () => {
  setupCanvas()
  // Restart animation if it was running
  if (running) {
    clearInterval(interval)
    run()
    document.body.classList.add("animating")
  }
})

// --- Controls ---
let intervalTime = document.getElementById("interval").value
document.getElementById("interval").addEventListener('change', (e) => {
  intervalTime = e.target.value
  if (running) {
    clearInterval(interval)
    run()
  }
})

let running = false
let interval = null
// Play/Pause control
document.getElementById("play-pause").addEventListener("click", (e) => {
  const btn = e.currentTarget; // Use currentTarget to get the button element
  if (running) {
    clearInterval(interval)
    btn.classList.add("paused")
    document.body.classList.add("paused")
  } else {
    run()
    btn.classList.remove("paused")
    document.body.classList.remove("paused")
  }
  running = !running
})

// Old pause button (for dev controls)
document.getElementById("pause").addEventListener("click", (e) => {
  if (running) {
    clearInterval(interval)
    e.target.innerText = "Start"
    document.body.classList.remove("animating")
  } else {
    run()
    e.target.innerText = "Pause"
    document.body.classList.add("animating")
  }
  running = !running
})

const run = () => {
  interval = setInterval(() => {
    life.next()
  }, intervalTime)
}

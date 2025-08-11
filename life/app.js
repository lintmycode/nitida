import Life from "./life.js"
import { LETTERS } from "./letters.js";

/**
 * Centers a sequence of letter patterns horizontally and vertically
 * within a given grid size.
 *
 * @param {Array} wordLetters - Array of letter patterns (2D arrays)
 * @param {number} gridCols - Total columns in the canvas/grid
 * @param {number} gridRows - Total rows in the canvas/grid
 * @param {number} spacing - Space (in columns) between letters
 * @returns {Array} Array of shape objects with { x, y, pattern }
 */
function centerShapes(wordLetters, gridCols, gridRows, spacing = 2) {
  const letterHeights = wordLetters.map(l => l.length)
  const letterWidths = wordLetters.map(l => l[0].length)

  const totalWidth = letterWidths.reduce(
    (sum, w, i) => sum + w + (i < wordLetters.length - 1 ? spacing : 0),
    0
  )

  const maxHeight = Math.max(...letterHeights)

  const xOffset = Math.floor((gridCols - totalWidth) / 2)
  const yOffset = Math.floor((gridRows - maxHeight) / 2)

  const shapes = []
  let cursorX = xOffset

  for (let i = 0; i < wordLetters.length; i++) {
    shapes.push({
      x: cursorX,
      y: yOffset,
      pattern: wordLetters[i]
    })
    cursorX += letterWidths[i] + spacing
  }

  return shapes
}

// Letters forming "NÍTIDA"
const word = [LETTERS.N, LETTERS.I, LETTERS.T, LETTERS.I, LETTERS.D, LETTERS.A]

// --- Canvas Setup ---
const canvas = document.querySelector("#canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const cellSize = 14 // Pixel size of each Life cell
const cols = Math.floor(canvas.width / cellSize)
const rows = Math.floor(canvas.height / cellSize)
const sideLength = Math.min(cols, rows)

// Center the main word
let baseShapes = centerShapes(word, sideLength, sideLength)

// Add accent above the first "I" (index 1)
baseShapes.push({
  x: baseShapes[1].x + 1,
  y: baseShapes[1].y - 3,
  pattern: LETTERS.ACCENT
})

// Final shapes
const shapes = baseShapes

// Create Life instance
let life = new Life(canvas, sideLength, shapes)

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
document.getElementById("pause").addEventListener("click", (e) => {
  if (running) {
    clearInterval(interval)
    e.target.innerText = "Start"
  } else {
    run()
    e.target.innerText = "Pause"
  }
  running = !running
})

const run = () => {
  interval = setInterval(() => {
    life.next()
  }, intervalTime)
}

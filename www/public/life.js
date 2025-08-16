export default class Life {
  cells = []
  config = {}
  generation = 0

  STATES = {
    DEAD: 0,
    ALIVE: 1
  }

  PATTERNS = {
    STILL: {
      BLOCK: [[1, 1], [1, 1]],
      BEEHIVE: [[0, 1, 1, 0], [1, 0, 0, 1], [0, 1, 1, 0]],
      LOAF: [[0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 1, 0, 1], [0, 0, 1, 0]],
      BOAT: [[1, 1, 0], [1, 0, 1], [0, 1, 0]],
      TUB: [[0, 1, 0], [1, 0, 1], [0, 1, 0]],
    },
    OSCILLATORS: {
      BLINKER: [[1, 1, 1]],
      TOAD: [[0, 1, 1, 1], [1, 1, 1, 0]],
      BEACON: [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]],
    },
    SPACESHIPS: {
      GLIDER: [[0, 1, 0], [0, 0, 1], [1, 1, 1]],
      GLIDER1: [[1, 1, 1], [1, 0, 0], [0, 1, 0]],
    }
  }

  canvas = null
  ctx = null

  constructor(canvas, sideLength = 100, shapes) {
    this.config = {
      columns: sideLength,
      lines: sideLength,
      cell: {
        width: canvas.clientWidth / sideLength,
        height: canvas.clientHeight / sideLength
      },
      infinite: true
    }
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")
    this.evolveColumns = 0    
    this.init(shapes)
  }

  init(shapes = null) {
    // Clear any previous state
    this.cells = []

    for (let i = 0; i < this.config.lines; i++) {
      let line = []
      for (let j = 0; j < this.config.columns; j++) {
        line.push(this.STATES.DEAD)
      }
      this.cells.push(line)
    }

    if (Array.isArray(shapes)) {
      // Insert provided shapes
      for (const { x, y, pattern } of shapes) {
        this.insertPattern(y, x, pattern) // y = row, x = column
      }
    } else {
      // Fallback to random init
      for (let i = 0; i < this.config.lines; i++) {
        for (let j = 0; j < this.config.columns; j++) {
          this.cells[i][j] = this.getRandomState()
        }
      }
    }

    this.generation = 0
    this.draw()
  }


  getRandomNeonHexColor() {
    // Randomly choose which channel will be set to 255
    let fullChannel = Math.floor(Math.random() * 3);

    let r = (fullChannel === 0) ? 255 : Math.floor(Math.random() * 256);
    let g = (fullChannel === 1) ? 255 : Math.floor(Math.random() * 256);
    let b = (fullChannel === 2) ? 255 : Math.floor(Math.random() * 256);

    // Convert the RGB values to a hex string
    let color = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

    return color;
  }

  draw() {
    const { cell, columns, lines } = this.config
    
    // Clear canvas to transparent
    this.ctx.clearRect(0, 0, cell.width * columns, cell.height * lines)

    // Draw alive cells in black
    this.ctx.fillStyle = '#000000'
    for (let i = 0; i < lines; i++) {
      for (let j = 0; j < columns; j++) {
        const cellState = this.cells[i][j]
        if (cellState === this.STATES.ALIVE) {
          this.ctx.fillRect(j * cell.width, i * cell.height, cell.width, cell.height)
        }
      }
    }

    const el = document.getElementById("generation")
    if (el) el.innerText = this.generation
  }

  next() {
    const { lines, columns } = this.config

    // Cap the active column count
    if (this.evolveColumns < columns) {
      this.evolveColumns += 1
    }

    let newCells = []
    for (let i = 0; i < lines; i++) {
      let line = []
      for (let j = 0; j < columns; j++) {
        if (j < this.evolveColumns) {
          const n = this.getNeighbours(i, j)
          const current = this.cells[i][j]
          if ((current === this.STATES.ALIVE && (n === 2 || n === 3)) ||
              (current === this.STATES.DEAD && n === 3)) {
            line.push(this.STATES.ALIVE)
          } else {
            line.push(this.STATES.DEAD)
          }
        } else {
          // Keep untouched columns as-is
          line.push(this.cells[i][j])
        }
      }
      newCells.push(line)
    }

    this.cells = newCells
    this.generation++
    this.draw()
  }


  getNeighbours(i, j) {
    let n = 0
    const { lines, columns, infinite } = this.config

    // Top-left, top, top-right
    if (i > 0) {
      if (j > 0 && this.cells[i - 1][j - 1] === this.STATES.ALIVE) n++
      if (this.cells[i - 1][j] === this.STATES.ALIVE) n++
      if (j < columns - 1 && this.cells[i - 1][j + 1] === this.STATES.ALIVE) n++
    } else if (infinite) {
      // Wrap top row to bottom
      const row = lines - 1
      if (j > 0 && this.cells[row][j - 1] === this.STATES.ALIVE) n++
      if (this.cells[row][j] === this.STATES.ALIVE) n++
      if (j < columns - 1 && this.cells[row][j + 1] === this.STATES.ALIVE) n++
    }

    // Left and right neighbors (same row)
    if (j > 0 && this.cells[i][j - 1] === this.STATES.ALIVE) n++
    if (j < columns - 1 && this.cells[i][j + 1] === this.STATES.ALIVE) n++

    // Bottom-left, bottom, bottom-right
    if (i < lines - 1) {
      if (j > 0 && this.cells[i + 1][j - 1] === this.STATES.ALIVE) n++
      if (this.cells[i + 1][j] === this.STATES.ALIVE) n++
      if (j < columns - 1 && this.cells[i + 1][j + 1] === this.STATES.ALIVE) n++
    } else if (infinite) {
      // Wrap bottom row to top
      const row = 0
      if (j > 0 && this.cells[row][j - 1] === this.STATES.ALIVE) n++
      if (this.cells[row][j] === this.STATES.ALIVE) n++
      if (j < columns - 1 && this.cells[row][j + 1] === this.STATES.ALIVE) n++
    }

    return n
  }


  getRandomState(deathProb = 0.85) {
    return Math.random() <= deathProb ? this.STATES.DEAD : this.STATES.ALIVE
  }

  insertPattern(i, j, pattern) {
    for (let _i = 0; _i < pattern.length; _i++) {
      const line = pattern[_i]
      for (let _j = 0; _j < line.length; _j++) {
        const y = i + _i
        const x = j + _j
        if (y < this.config.lines && x < this.config.columns) {
          this.cells[y][x] = line[_j]
        }
      }
    }
  }

  interpolateColor(hex1, hex2, factor) {
    const c1 = parseInt(hex1.slice(1), 16)
    const c2 = parseInt(hex2.slice(1), 16)

    const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff
    const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff

    const r = Math.round(r1 + (r2 - r1) * factor)
    const g = Math.round(g1 + (g2 - g1) * factor)
    const b = Math.round(b1 + (b2 - b1) * factor)

    return `rgb(${r},${g},${b})`
  }

}

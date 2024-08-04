const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const size = 100
const rows = size
const cols = size
let cellSize

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    cellSize = Math.min(canvas.width / cols, canvas.height / rows)
    renderGrid(grid)
}

window.addEventListener('resize', resizeCanvas)

// Initialize the grid
function createGridArray(rows, columns) {
    const grid = []
    for (let row = 0; row < rows; row++) {
        grid[row] = []
        for (let col = 0; col < columns; col++) {
            grid[row][col] = Math.random() > 0.8 ? 1 : 0 // Randomly initialize cells
        }
    }
    return grid
}

const grid = createGridArray(rows, cols)

// Update the grid based on Conway's Game of Life rules
function updateGrid(grid) {
    const newGrid = grid.map(arr => [...arr])
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const aliveNeighbors = directions.reduce((acc, [dx, dy]) => {
                const newRow = row + dx
                const newCol = col + dy
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    acc += grid[newRow][newCol]
                }
                return acc
            }, 0)

            if (grid[row][col] === 1) {
                if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                    newGrid[row][col] = 0 // Cell dies
                }
            } else {
                if (aliveNeighbors === 3) {
                    newGrid[row][col] = 1 // Cell becomes alive
                }
            }
        }
    }
    return newGrid
}

// Render the grid on the canvas
function renderGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            ctx.fillStyle = grid[row][col] === 1 ? '#000' : '#ccc'
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
            ctx.strokeStyle = '#000'
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize)
        }
    }
}

resizeCanvas()

// Game loop
setInterval(() => {
    const newGrid = updateGrid(grid)
    renderGrid(newGrid)
    grid.splice(0, grid.length, ...newGrid)
}, 10)

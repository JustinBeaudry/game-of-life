const app = document.getElementById('app')
const size = 200
const rows = size
const columns = size

const createGridArray = (rows, columns) => {
    const grid = []
    for (let row = 0; row < rows; row++) {
        grid[row] = []
        for (let col = 0; col < columns; col++) {
            grid[row][col] = Math.random() > 0.8 ? 1 : 0 // Randomly initialize cells
        }
    }
    return grid
}
const createGridElements = (grid, containerEl) => {
    const rows = grid.length
    const columns = grid[0].length
    containerEl.style.gridTemplateRows = `repeat(${rows}, 1fr)` // Equal rows
    containerEl.style.gridTemplateColumns = `repeat(${columns}, 1fr)` // Equal columns

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const gridItem = document.createElement('div')
            gridItem.classList.add('grid-item')
            if (grid[row][col] === 1) {
                gridItem.classList.add('alive')
            }
            gridItem.dataset.row = row.toString()
            gridItem.dataset.col = col.toString()
            containerEl.appendChild(gridItem)
        }
    }

    // Ensure grid items are perfectly square and fit within the container
    const containerWidth = containerEl.clientWidth
    const containerHeight = containerEl.clientHeight
    const itemSize = Math.min(containerWidth / columns, containerHeight / rows)

    containerEl.querySelectorAll('.grid-item').forEach(item => {
        item.style.width = `${itemSize}px`
        item.style.height = `${itemSize}px`
    })
}

const updateGrid = (grid) => {
    const newGrid = grid.map(arr => [...arr])
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const aliveNeighbors = directions.reduce((acc, [dx, dy]) => {
                const newRow = row + dx
                const newCol = col + dy
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
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

const renderGrid = (grid, containerEl) => {
    containerEl.querySelectorAll('.grid-item').forEach(item => {
        const row = parseInt(item.dataset.row)
        const col = parseInt(item.dataset.col)
        if (grid[row][col] === 1) {
            item.classList.add('alive')
        } else {
            item.classList.remove('alive')
        }
    })
}

const grid = createGridArray(rows, columns)

window.addEventListener('DOMContentLoaded', () => {
    createGridElements(grid, app)
})

window.addEventListener('resize', () => {
    app.innerHTML = ''
    createGridElements(grid, app)
})

setInterval(() => {
    requestAnimationFrame(() => {
        const newGrid = updateGrid(grid)
        renderGrid(newGrid, app)
        grid.splice(0, grid.length, ...newGrid)
    })
}, 1)

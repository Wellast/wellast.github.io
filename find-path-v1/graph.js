const MIN_WIDTH = 5
const MAX_WIDTH = 100
const MIN_HEIGHT = 5
const MAX_HEIGHT = 100

let visited = {}
let nextStepInterval

function init() {
    CreateButtonInit();
    RunButtonInit()
}

function CreateButtonInit() {
    document.getElementById('create_grid_button').addEventListener('click', () => {
        document.getElementById('grid').innerHTML = '';
        const width = +document.getElementById('width').value
        const height = +document.getElementById('height').value

        if (width < MIN_WIDTH || width > MAX_WIDTH) {
            alert(`width must be between ${MIN_WIDTH} and ${MAX_WIDTH}`)
            return
        }
        if (height < MIN_HEIGHT || height > MAX_HEIGHT) {
            alert(`height must be between ${MIN_HEIGHT} and ${MAX_HEIGHT}`)
            return
        }

        let x = 0, y = 0
        Array(width).fill(0).forEach(() => {
            x++
            y = 0
            const tr = document.createElement('tr')
            {
                Array(height).fill(0).forEach(() => {
                    y++
                    const td = document.createElement('td')
                    td.classList.add('square')
                    td.classList.add('white')
                    td.classList.add('pointer')
                    td.id = `td_${x}-${y}`
                    td.innerHTML = 0
                    tr.appendChild(td)

                    if (x === 1 && y === 1) {
                        td.classList.remove('white')
                        td.classList.add('blue')
                        td.classList.remove('pointer')
                        return
                    }
                    if (x === width && y === height) {
                        td.classList.remove('white')
                        td.classList.add('red')
                        td.classList.remove('pointer')
                        return
                    }
                    td.addEventListener('click', (ev) => {
                        const el = ev.target
                        if (el.classList.contains('white')) {
                            el.classList.remove('white')
                            el.classList.add('black')
                            el.innerHTML = 1
                        } else {
                            el.classList.add('white')
                            el.classList.remove('black')
                            el.innerHTML = 0
                        }
                    });
                })
            }
            document.getElementById('grid').appendChild(tr);
            document.getElementById('find_path_button').disabled = false;
        })
    });
}

function RunButtonInit() {
    const runBtn = document.getElementById('find_path_button');
    runBtn.addEventListener('click', () => {
        const speed = +document.getElementById('speed').value
        if (speed < 50 || speed > 10000) {
            alert(`Speed must be between 50 and 10000`)
            return
        }
        runBtn.disabled = true
        document.getElementById('create_grid_button').disabled = true
        nextStepInterval = setInterval(nextStep, speed);
    })
}

let lastVisit = [ 1, 1 ]
let history = []

function nextStep() {
    const width = +document.getElementById('width').value
    const height = +document.getElementById('height').value
    const x = lastVisit[0], y = lastVisit[1]
    console.log([y, x])

    if ((x+1 === height && y === width) || (x === height && y+1 === width)) {
        drawFinalPath()
        clearInterval(nextStepInterval)
        return
    }

    if (!isAvailable(x+1, y)) {
        visit(x+1, y)
        return
    }
    if (!isAvailable(x, y+1)) {
        visit(x, y+1)
        return
    }
    if (!isAvailable(x-1, y)) {
        visit(x-1, y)
        return
    }
    if (!isAvailable(x, y-1)) {
        visit(x, y-1)
        return
    }
    history.pop()
    if (!history.length) {
        clearInterval(nextStepInterval)
        return
    }
    lastVisit = [history[history.length - 1].x, history[history.length - 1].y]
}

function isAvailable(x, y) {
    const width = +document.getElementById('width').value
    const height = +document.getElementById('height').value
    if (x > height || x <= 0 || y > width || y <= 0) {
        return true
    }
    const cell = document.getElementById(`td_${y}-${x}`).innerText
    if (cell === '1') {
        return true
    }
    if (visited[`${y}-${x}`]) {
        return true
    }
    return false
}

function visit(x, y) {
    history.push({y, x})
    visited[`${y}-${x}`] = true
    lastVisit = [x, y]
    const td = document.getElementById(`td_${y}-${x}`)
    if (x === 1 && y === 1) {
        return
    }
    td.classList.remove('white')
    td.classList.add('green')
}

function drawFinalPath() {
    history.forEach(el => {
        const td = document.getElementById(`td_${el.y}-${el.x}`)
        td.classList.remove('green')
        td.classList.add('purple')
    })
}

init();

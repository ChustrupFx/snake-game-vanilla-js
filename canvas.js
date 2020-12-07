//Setup
var canvas = document.querySelector('canvas')
const snakeSquareSize = 25
canvas.width = innerWidth - (innerWidth % snakeSquareSize)
canvas.height = innerHeight - (innerHeight % snakeSquareSize)
var c = canvas.getContext('2d')

var mainSquare
var fruit
var tail = []
var tailSize = 3

//Event Listeners
addEventListener('keydown', function(event) {
    Controller(event, mainSquare)
})

//Classes
class Square {
    constructor(x, y, w, h, velocity, color) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.velocity = {
            x: velocity,
            y: 0
        }
        this.color = color
        this.lastPosition = {
            x: x,
            y: y
        }
    }
    
    draw() {
        c.beginPath()
        c.fillStyle = this.color
        c.rect(this.x, this.y, this.w, this.h)
        c.fill()
        c.stroke()
        c.closePath()
    }
    
    update() {
        this.x += this.velocity.x
        this.y += this.velocity.y

        if (this.x > canvas.width) {
            this.x = 0
        }

        if (this.x < 0) {
            this.x = canvas.width - this.w
        }

        if (this.y > canvas.height) {
            this.y = 0
        }

        if (this.y < 0) {
            this.y = canvas.height - this.h
        }

        this.draw()
    }

    setLastPosition() {
        this.lastPosition.x = this.x
        this.lastPosition.y = this.y
    }

}

//Functions
function Init() {
    CreateMainSquare()
    PlaceFruit()
    GenerateTail()
}

function Update() {
    //This is the main function
    //Update frames
    c.clearRect(0, 0, canvas.width, canvas.height)
    if (CheckCollision(mainSquare, fruit)) {
        PlaceFruit()
        AddTailSquare()
    }
    
    mainSquare.setLastPosition()
    mainSquare.update()

    for (let i = 0; i < tail.length; i++) {
        if (CheckCollision(mainSquare, tail[i])) {
            Reset()
            return
        }

        tail[i].setLastPosition()

        if (i == 0) {
            tail[i].x = mainSquare.lastPosition.x
            tail[i].y = mainSquare.lastPosition.y
        } else {
            tail[i].x = tail[i - 1].lastPosition.x
            tail[i].y = tail[i - 1].lastPosition.y
        }
        tail[i].update()
    }
    
    
    fruit.update()
}

function CreateLines() {
    //Create the lines that divides the canvas
    for (let i = 1; i <= canvas.width; i++) {
        c.beginPath()
        c.lineWidth = 0.5
        c.strokeStyle = 'black'
        c.moveTo(snakeSquareSize * i, 0)
        c.lineTo(snakeSquareSize * i, canvas.height)
        c.stroke()
        c.closePath()
    }
    
    for (let i = 1; i <= canvas.height; i++) {
        c.beginPath()
        c.lineWidth = 0.5
        c.strokeStyle = 'black'
        c.moveTo(0, snakeSquareSize * i)
        c.lineTo(canvas.width, snakeSquareSize * i)
        c.stroke()
        c.closePath()
    }
}

function Controller(event, mainSquare) {    
    acceptedMoves = {
        KeyW: function() {
            if (mainSquare.velocity.y != 0) {
                return
            }
    
            mainSquare.velocity.x = 0
            mainSquare.velocity.y = -snakeSquareSize
        },
        KeyA() {
            if (mainSquare.velocity.x != 0) {
                return
            }
    
            mainSquare.velocity.x = -snakeSquareSize
            mainSquare.velocity.y = 0
        },
        KeyS() {
            if (mainSquare.velocity.y != 0) {
                return
            }
    
            mainSquare.velocity.x = 0
            mainSquare.velocity.y = snakeSquareSize
        },
        KeyD() {
            if (mainSquare.velocity.x != 0) {
                return
            }
    
            mainSquare.velocity.x = snakeSquareSize
            mainSquare.velocity.y = 0
        }
    }
    
    const moveFunction = acceptedMoves[event.code]

    if (moveFunction) {
        moveFunction()
    }

}

function GenerateRandomCoordinate() {
    let x = Math.trunc(Math.random() * canvas.width)
    let y = Math.trunc(Math.random() * canvas.height)
    x -= x % snakeSquareSize
    y -= y % snakeSquareSize

    let coordinate = {
        x: x,
        y: y
    }    

    return coordinate
}

function CreateMainSquare() {
    let squareCoordinate = GenerateRandomCoordinate()
    mainSquare = new Square(squareCoordinate.x, squareCoordinate.y, snakeSquareSize, snakeSquareSize, snakeSquareSize, '#fca103')
}

function PlaceFruit() {
    let coordinate = GenerateRandomCoordinate()

    fruit = new Square(coordinate.x, coordinate.y, snakeSquareSize, snakeSquareSize, 0, '#5203fc')
}

function CheckCollision(square, otherSquare) {
    if (square.x == otherSquare.x && square.y == otherSquare.y) {
        return true
    }
    return false
}

function GenerateTail() {
    for (let i = 0; i < tailSize; i++) {
        tail.push(new Square(mainSquare.x - snakeSquareSize * (i + 1), mainSquare.y, snakeSquareSize, snakeSquareSize, 0, '#fca103'))
    }
}

function AddTailSquare() {
    tail.push(new Square(tail[tail.length - 1].x, tail[tail.length - 1].y, snakeSquareSize, snakeSquareSize, 0, '#fca103'))
}

function Reset() {
    tail = []
    Init()
}

//Initialize
Init()

//Constant Game Update
setInterval(Update, 100)

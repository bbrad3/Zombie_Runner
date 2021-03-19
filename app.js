console.log('hello from app.js')

// DOM selectors
const canvas = document.querySelector('canvas')

// CANVAS SETUP
const canvasWidth = getComputedStyle(canvas).width
const canvasHeight = getComputedStyle(canvas).height

canvas.setAttribute('width', canvasWidth)
canvas.setAttribute('height', canvasHeight)

const context = canvas.getContext('2d')
console.log(context)

// ================================
// class for squares
class Rectangle {
    constructor(x, y, w, h, color, speed) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
        this.speed = speed
        this.alive = true
        this.itemsCollected = 0
    }
    center() {
        const xCoord = (this.x + (this.x/2))
        const yCoord = (this.y + (this.y/2))
        return `(${xCoord}, ${yCoord})` 
    }

    topEdge() {
        return this.y
    }

    bottomEdge() {
        return this.y + this.h
    }

    leftEdge() {
        return this.x
    }

    rightEdge() {
        return this.x + this.w
    }

    render() {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.w, this.h)
    }

    hasCollided(other) {
        const hitOnX = this.rightEdge() >= other.leftEdge() && this.leftEdge() <= other.rightEdge()
        const hitOnY = this.bottomEdge() >= other.topEdge() && this.topEdge() < other.bottomEdge()
        

        if(hitOnX && hitOnY) {
            if(other.constructor === Zombie) {
                return [true, 'zombie']
            } else if(other.constructor === Valuable) {
                return [true, 'valuable']
            }
        } else {
            return false
        }
    }
}

class Zombie extends Rectangle {
    constructor(x, y) {
        super(x, y, 20, 30, 'red', 8)
    }
}

class Valuable extends Rectangle {
    constructor(x, y) {
        super(x, y, 20, 20, 'yellow', 0)
    }
}

// new Survivor!
const survivor = new Rectangle(60, 50, 20, 30, 'green', 10)

// Zombies!
const zombies = [
    new Zombie(350, 50),
    new Zombie(260, 170),
    new Zombie(570, 170),
    new Zombie(420, 380),
    new Zombie(60, 350),
]

// Valuable item!
const valuable = new Valuable(310, 450)

// get keyboard inputs from user
document.addEventListener('keydown', playerMovement)

// player movement
function playerMovement(e) {
    if(e.key === 'ArrowUp') {
        survivor.y -= survivor.speed
    } else if(e.key === 'ArrowDown') {
        survivor.y += survivor.speed
    } else if(e.key === 'ArrowRight') {
        survivor.x += survivor.speed
    } else if(e.key === 'ArrowLeft') {
        survivor.x -= survivor.speed
    }
}

function checkCollision(body) {
    const collisionStats = survivor.hasCollided(body)
    if(collisionStats[0]){
        if(collisionStats[1] === 'zombie') {
            survivor.alive = false
            console.log('GAME OVER!')
        } else if(collisionStats[1] === 'valuable'){
            survivor.itemsCollected++
            console.log('ITEM COLLECTED!')
        }
    }
}



// GAME LOOP
setInterval(() => {
    // clear board
    context.clearRect(0, 0, canvas.width, canvas.height)
    // render objects
    survivor.render()
    valuable.render()
    checkCollision(valuable)
    zombies.forEach(zombie => {
        zombie.render()
        checkCollision(zombie)
    })
    console.log('survivorOrigin', `(${survivor.x}, ${survivor.y})`)
}, 50)
console.log('hello from classes.js')
import {context, canvas} from './app.js'

// DOM Selectors
const playerIdles = document.querySelectorAll('.player-idle')
const zombieIdles = document.querySelectorAll('.zombie-idle')
const chestsClosed = document.querySelectorAll('.chest-closed')

class Rectangle {
    constructor(x, y, w, h, color, speed, characterArr, characterIndex) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
        this.speed = speed
        this.alive = true
        this.itemsCollected = 0
        this.characterArr = characterArr
        this.staticCharacter = characterArr[characterIndex]
        this.charIndex = 0
    }

    center() {
        const xCoord = (this.x + (this.x/2))
        const yCoord = (this.y + (this.y/2))
        return [xCoord, yCoord] 
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

    drawImage() {
        context.drawImage(this.staticCharacter, 7, 2, 18, 28, this.x, this.y, this.w, this.h)
    }

    render() { // ^^^ may draw img instead; this just represents hitbox
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.w, this.h)
    }

    hasCollided(other) {
        const hitOnX = this.rightEdge() > other.leftEdge() && this.leftEdge() < other.rightEdge()
        const hitOnY = this.bottomEdge() > other.topEdge() && this.topEdge() < other.bottomEdge()
        

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
        super(x, y, 20, 32, 'rgba(50,0,0,0.3)', 1, zombieIdles, 0)
    }
}

class Valuable extends Rectangle {
    constructor(x, y) {
        super(x, y, 20, 20, 'rgba(50,50,0,0.3)', 0, chestsClosed, 2)
    }
}

class Level {
    constructor(level, zombieLocations, valuableLocations) {
        this.level = level
        this.zombieLocations = zombieLocations.map((location) => {
            const randX = Math.floor(50 + Math.random() * 650)
            const randY = Math.floor(50 + Math.random() * 450)
            return location = [randX, randY]
        })
        this.valuableLocations = valuableLocations.map((location) => {
            const randX = Math.floor(50 + Math.random() * 650)
            const randY = Math.floor(50 + Math.random() * 450)
            return location = [randX, randY]
        })
        this.numValuables = valuableLocations.length
    }

    buildZombies() {
        for(let zombie of this.zombieLocations) {
            new Zombie(zombie[0],zombie[1])
        }
    }

    buildValuables() {
        for(let valuable of this.valuableLocations) {
            new Valuable(valuable[0],valuable[1])
        }
    }
}

// new Survivor!
const survivor = new Rectangle(50, 50, 20, 32, 'rgba(50, 0, 0, 0.5)', 10, playerIdles, 0)

// LEVELS!
const LEVELS = {
    level1: new Level(1, [[],[],[],[],[]], [[]]),
    level2: new Level(2, [[],[],[],[],[],[],[]], [[],[]]),
    level3: new Level(3, [[],[],[],[],[],[],[],[],[]], [[],[]])
}

console.log(LEVELS.level1)
console.log(LEVELS.level2)
console.log(LEVELS.level3)
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

class Circle {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.radius = radius
        this.startAngle = 0
        this.endAngle = 2 * Math.PI
    }

    hasCollided(other, survivorCenter) {
        const dx = Math.abs(survivorCenter[0] - other.center()[0])
        const dy = Math.abs(survivorCenter[1] - other.center()[1])
        const distance = Math.sqrt(dx * dx + dy * dy)

        const radius1 = this.radius
        const radius2 = other.w / 2
        const sumRadii = radius1 + radius2 + 30

        if(distance < sumRadii) {
            if(other.constructor === Zombie) {
                console.log('hit zombie')
                return [true, 'zombie', other]
            }
        } else {
            return [false, 'nothing']
        }
    }

    center() {
         return [this.x + 15, this.y + 15]
    }

    radialGradient(survivorX, survivorY) {
        const survivorCenter = [survivorX + 15, survivorY + 15]
        // console.log('survivorCenter', survivorCenter)
        // (x0, y0, r0, x1, y1, r1)
        let gradient = context.createRadialGradient(survivorCenter[0], survivorCenter[1], this.radius - 50, survivorCenter[0], survivorCenter[1], this.radius)
        gradient.addColorStop(0, '#00000000')
        gradient.addColorStop(.9, 'rgba(0,0,0,0.4)')
        gradient.addColorStop(1, 'rgba(0,0,0,0.88)')

        context.fillStyle = gradient
        context.fillRect(-10, -10, 1000, 1000)
    }
}
const spotLight = new Circle(0, 0, 100)

export {Rectangle, Zombie, Valuable, Level, survivor, zombies, valuable, spotLight, playerIdles, zombieIdles, chestsClosed}
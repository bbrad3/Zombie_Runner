console.log('hello from classes.js')
import {context, canvas} from './app.js'

// DOM Selectors
const playerIdles = document.querySelectorAll('.player-idle')
const zombieIdles = document.querySelectorAll('.zombie-idle')

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
        context.drawImage(this.staticCharacter, this.x, this.y, this.w, this.h)
    }

    render() { // ^^^ may draw img instead
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.w, this.h)
    }

    hasCollided(other) {
        // const ghostCircleX = this.center()
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
        super(x, y, 32, 32, 'red', 8, zombieIdles, 0)
    }
    chase() {
        const survivorCenter = survivor.center()
        const survivorX = survivorCenter[0]
        const survivorY = survivorCenter[1]
        setInterval(() => {
            const x = this.x
            const y = this.y
            const dx = survivorX - x
            const dy = survivorY - y
            if(dx < 0) { // survivor to left
                this.x -= this.speed
            } else if(dx > 0) { // survivor to right
                this.x += this.speed
            }
            if(dy < 0) { // survivor to up
                this.y -= this.speed
            } else if(dy > 0) { // survivor to down
                this.y += this.speed
            }

        }, 100)
    }
}

class Valuable extends Rectangle {
    constructor(x, y) {
        super(x, y, 32, 32, 'yellow', 0, zombieIdles, 0)
    }
}

// new Survivor!
const survivor = new Rectangle(50, 50, 32, 32, 'rgba(50, 0, 0, 0.5)', 10, playerIdles, 0)
// console.log('survivor', survivor.staticCharacter)
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
        // console.log('made it this far')
        const dx = Math.abs(survivorCenter[0] - other.center()[0])
        const dy = Math.abs(survivorCenter[1] - other.center()[1])
        console.log(dx, 'dx, dy', dy)
        // console.log(survivorCenter[0], 'thisCenterx', other.center()[0], 'otherCenterx')
        const distance = Math.sqrt(dx * dx + dy * dy)
        // console.log(distance, 'distance')

        const radius1 = this.radius + 20
        const radius2 = other.w / 2
        const sumRadii = radius1 + radius2 + 20
        console.log(sumRadii, 'sumRadii')

        // console.log('x', hitOnX, 'y', hitOnY)
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

    drawGhostCircle(x, y) {
        context.beginPath()
        context.arc(x + 15, y + 15, this.radius + 20, this.startAngle, this.endAngle)
        context.stroke()
    }

    radialGradient(survivorX, survivorY) {
        const survivorCenter = [survivorX + 15, survivorY + 15]
        // console.log('survivorCenter', survivorCenter)
        // (x0, y0, r0, x1, y1, r1)
        let gradient = context.createRadialGradient(survivorCenter[0], survivorCenter[1], this.radius, survivorCenter[0], survivorCenter[1], this.radius + 20)
        gradient.addColorStop(0, '#00000000')
        gradient.addColorStop(.1, 'rgba(0,0,0,0.4)')
        gradient.addColorStop(1, 'rgba(0,0,0,0.8)')

        context.fillStyle = gradient
        context.fillRect(-10, -10, 1000, 1000)
    }
}
const spotLight = new Circle(0, 0, 50)

export {Rectangle, Zombie, Valuable, survivor, zombies, valuable, spotLight, playerIdles}
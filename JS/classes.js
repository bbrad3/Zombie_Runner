import {context} from './app.js'
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

export {Rectangle, Zombie, Valuable, survivor, zombies, valuable}
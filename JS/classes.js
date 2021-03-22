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

    // gifPic() { // returns a new img div 
    //     let imgSrc = this.staticCharacter // current pic
    //     console.log('charIndex', this.charIndex)
    //     console.log('imgSrc', imgSrc)
    //     console.log('staticChar', this.staticCharacter)
    //     if(this.gifIndex < this.characterArr.length) {
    //         this.gifIndex++ // next arr item index
            
    //     }else {
    //         this.gifIndex = 0
    //     }
    //     this.staticCharacter = this.characterArr[this.gifIndex] // next pic
    //     return imgSrc
    // }    
    

    drawImage() {
        context.drawImage(this.staticCharacter, this.x, this.y, this.w, this.h)
    }

    render() { // ^^^ may draw img instead
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
        super(x, y, 32, 32, 'red', 8, zombieIdles, 0)
    }
}

class Valuable extends Rectangle {
    constructor(x, y) {
        super(x, y, 32, 32, 'yellow', 0, zombieIdles, 0)
    }
}

// new Survivor!
const survivor = new Rectangle(60, 50, 32, 32, 'green', 10, playerIdles, 0)
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

export {Rectangle, Zombie, Valuable, survivor, zombies, valuable, playerIdles}
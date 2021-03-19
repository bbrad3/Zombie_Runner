import {Rectangle, Zombie, Valuable, survivor, zombies, valuable} from './classes.js'
console.log('hello from app.js')

// DOM selectors
const canvas = document.querySelector('canvas')

// CANVAS SETUP
const canvasWidth = getComputedStyle(canvas).width
const canvasHeight = getComputedStyle(canvas).height

canvas.setAttribute('width', canvasWidth)
canvas.setAttribute('height', canvasHeight)

const context = canvas.getContext('2d')

// ================================

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
            survivor.color = '#00000000'
            return true
        } else if(collisionStats[1] === 'valuable'){
            survivor.itemsCollected++
            valuable.color = '#00000000'
            return true
            console.log('ITEM COLLECTED!')
        }
    }
}



// GAME LOOP
setInterval(() => {
    // clear board
    context.clearRect(0, 0, canvas.width, canvas.height)

    // check collision and determine render
    zombies.forEach(zombie => {
        zombie.render()
        if(checkCollision(zombie)) {
            console.log('GAME OVER!')
        }
    })
    survivor.render()

    // checkCollision options
    if(checkCollision(valuable)) {
        console.log('YOU WIN!')
    }
    valuable.render()
    console.log('survivorOrigin', `(${survivor.x}, ${survivor.y})`)
}, 50)

export {context}
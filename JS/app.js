import {Rectangle, Zombie, Valuable, survivor, zombies, valuable} from './classes.js'
console.log('hello from app.js')

// DOM selectors
const canvas = document.querySelector('canvas')
const winMsg = document.querySelector('#winGame')
const loseMsg = document.querySelector('#loseGame')

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
    if(e.key === 'w') {
        survivor.y -= survivor.speed
    } else if(e.key === 's') {
        survivor.y += survivor.speed
    } else if(e.key === 'd') {
        survivor.x += survivor.speed
    } else if(e.key === 'a') {
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
        }
    }
}

function gameStatus() {
    if(survivor.alive && survivor.itemsCollected === 1) {
        console.log('YOU WIN!')
        winMsg.style.opacity = '1'
        clearInterval(GAME_LOOP)
    } else if(!survivor.alive) {
        console.log('GAME OVER!')
        loseMsg.style.opacity = '1'
        clearInterval(GAME_LOOP)
    }
}

// GAME LOOP
const GAME_LOOP = setInterval(() => {
    // clear board
    context.clearRect(0, 0, canvas.width, canvas.height)

    // check collision and determine render
    zombies.forEach(zombie => {
        zombie.render()
        if(checkCollision(zombie)) {
            console.log('The zombies got you! You dead.')
        }
    })
    survivor.render()

    // checkCollision options
    if(checkCollision(valuable)) {
        context.clearRect(valuable.x, valuable.y, valuable.w, valuable.h)
        console.log('ITEM COLLECTED!')
    }
    valuable.render()
    gameStatus()
    console.log('survivorOrigin', `(${survivor.x}, ${survivor.y})`)
}, 50)

export {context}
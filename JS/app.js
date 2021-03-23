console.log('hello from app.js')

import {Rectangle, Zombie, Valuable, survivor, zombies, valuable, spotLight, playerIdles, zombieIdles, chestsClosed, LEVELS} from './classes.js'

// DOM selectors
const canvas = document.querySelector('canvas')

const startBtn = document.querySelector('#startBtn')
const resetBtn = document.querySelector('#resetBtn')
const gameStart = document.querySelector('#gameStart')
const winMsg = document.querySelector('#winGame')
const loseMsg = document.querySelector('#loseGame')

// CANVAS SETUP
const canvasWidth = getComputedStyle(canvas).width
const canvasHeight = getComputedStyle(canvas).height

canvas.setAttribute('width', canvasWidth)
canvas.setAttribute('height', canvasHeight)

const context = canvas.getContext('2d')

// ================================
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
    if(body.constructor === Zombie) {
        const ghostCircleStats = spotLight.hasCollided(body, survivor.center())
        // console.log(ghostCircleStats, 'ghostCircleStats')
        if(ghostCircleStats[0]) {
            if(ghostCircleStats[1] === 'zombie') {
                // console.log('zombie chase!')
                setInterval(zombieChase(ghostCircleStats[2]), 1000)
            }
            // console.log('ghostCircle COLLIDED!', ghostCircleStats[1])
        }
    }
}

function zombieChase(zombie) {
        // console.log('chasing by:', zombie)
        const dx = survivor.x - zombie.x
        const dy = survivor.y - zombie.y
        if(dx < 0) { // survivor to left
            zombie.x -= zombie.speed
        } else if(dx > 0) { // survivor to right
            zombie.x += zombie.speed
        }
        if(dy < 0) { // survivor to up
            zombie.y -= zombie.speed
        } else if(dy > 0) { // survivor to down
            zombie.y += zombie.speed
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

let gifIndexTo3 = 0
let timeSinceStart = 0
// GAME LOOP
const GAME_LOOP = setInterval(() => {
    // clear board
    context.clearRect(0, 0, canvas.width, canvas.height)

    
    // check collision and determine render for zombies
    zombies.forEach(zombie => {
        zombie.drawImage(zombieIdles[0])
        // zombie.render()
        if(checkCollision(zombie)) {
            console.log('The zombies got you! You dead.')
        }
    })

    survivor.drawImage(playerIdles[0])
    // survivor.render()
    

    // checkCollision options
    if(checkCollision(valuable)) {
        context.clearRect(valuable.x, valuable.y, valuable.w, valuable.h)
        console.log('ITEM COLLECTED!')
    }
    valuable.drawImage(chestsClosed[2])
    // valuable.render()
    gameStatus()

    // SPOTLIGHT!!!
    spotLight.radialGradient(survivor.x, survivor.y)
    
    // console.log('survivorOrigin', `(${survivor.x}, ${survivor.y})`, timeSinceStart, 'timeSinceStart')
    // console.log(timeSinceStart, 'timeSinceStart')
    timeSinceStart += 100
}, 50)


// EVENT LISTENERS
// get keyboard inputs from user
document.addEventListener('keydown', playerMovement)
startBtn.addEventListener('click', (e) => {
    gameStart.style.opacity = '0'
    // LEVELS.level1.buildLevel()
})
resetBtn.addEventListener('click', () => {
    // reset board to level 1
    // gameStart.style.opacity = '1'
})

export {context, canvas}
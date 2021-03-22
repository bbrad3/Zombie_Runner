console.log('hello from app.js')

import {Rectangle, Zombie, Valuable, survivor, zombies, valuable, spotLight, playerIdles} from './classes.js'

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
    const ghostCircleStats = spotLight.hasCollided(body, survivor.center())
    console.log(ghostCircleStats, 'ghostCircleStats')
    if(ghostCircleStats[0]) {
        if(ghostCircleStats[1] === 'zombie') {
            console.log('zombie chase!')
            ghostCircleStats[3].chase()
        }
        console.log('ghostCircle COLLIDED!', ghostCircleStats[1])
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

// GIF LOOP
// survivor.gifPic('on')

// const GIF_LOOP = setInterval(() => {
//     // can i jusst call survivor.gifPic() to get new imgDiv
//     console.log('the thing', survivor.gifPic())
//     survivor.drawImage(survivor.gifPic())
//     // let imgSrc = survivor.staticCharacter.getAttribute('src')
//     // let imgIndex = imgSrc.slice(27, 28)
// }, 100)

let gifIndexTo3 = 0
let timeSinceStart = 0
// GAME LOOP
const GAME_LOOP = setInterval(() => {
    // clear board
    context.clearRect(0, 0, canvas.width, canvas.height)

    // SPOTLIGHT!!!
    // console.log(spotLight.center())
    spotLight.drawGhostCircle(survivor.x, survivor.y)
    spotLight.radialGradient(survivor.x, survivor.y)
    // check collision and determine render for zombies
    zombies.forEach(zombie => {
        zombie.render()
        if(checkCollision(zombie)) {
            console.log('The zombies got you! You dead.')
        }
    })

    survivor.drawImage(playerIdles[0])
    survivor.render()
    

    // checkCollision options
    if(checkCollision(valuable)) {
        context.clearRect(valuable.x, valuable.y, valuable.w, valuable.h)
        console.log('ITEM COLLECTED!')
    }
    valuable.render()
    gameStatus()
    console.log('survivorOrigin', `(${survivor.x}, ${survivor.y})`, timeSinceStart, 'timeSinceStart')
    // console.log(timeSinceStart, 'timeSinceStart')
    timeSinceStart += 100
}, 50)


export {context, canvas}
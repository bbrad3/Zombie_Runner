console.log('hello from app.js')

import {Rectangle, Zombie, Valuable, Level, survivor, spotLight, playerIdles, zombieIdles, chonkerIdles, chestsClosed, LEVELS} from './classes.js'

// DOM selectors
const canvas = document.querySelector('canvas')

const startBtn = document.querySelector('#startBtn')
const resetBtn = document.querySelector('#resetBtn')
const gameStart = document.querySelector('#gameStart')
const winMsg = document.querySelector('#winGame')
const loseMsg = document.querySelector('#loseGame')
const nextLevelMsg = document.querySelector('#nextLevelMsg')
const nextLevel = document.querySelector('#nextLevel')
const levelSpan = document.querySelector('#levelSpan')

// GLOBAL VARIABLES
let currentLevel = 1
const numValuables = LEVELS[`level${currentLevel}`].valuables.length
const valuablesCollected = survivor.itemsCollected
const totalLevels = Object.entries(LEVELS).length


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
            // collisionStats[2].color = '#00000000'
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
            zombie.x -= zombie.speed / 2
        } else if(dx > 0) { // survivor to right
            zombie.x += zombie.speed / 2
        }
        if(dy < 0) { // survivor to up
            zombie.y -= zombie.speed / 2
        } else if(dy > 0) { // survivor to down
            zombie.y += zombie.speed / 2
        }
}

function gameStatus() {
    if(survivor.alive && valuablesCollected === numValuables && currentLevel === totalLevels) {
        console.log('YOU WIN!')
        winMsg.style.opacity = '1'
        clearInterval(GAME_LOOP)
    } else if(survivor.alive && valuablesCollected === numValuables) { // next level
        survivor.itemsCollected = 0
        survivor.x = 50
        survivor.y = 50
        currentLevel++
        LEVELS[`level${currentLevel}`].buildLevel()
        
        levelSpan.innerHTML = `${currentLevel}/${totalLevels}`
        levelDisplay()
    } else if(!survivor.alive) {
        console.log('GAME OVER!')
        loseMsg.style.opacity = '1'
        clearInterval(GAME_LOOP)
    }
}

function levelDisplay() {
    nextLevel.innerHTML = currentLevel

    nextLevelMsg.style.opacity = '1'
    setTimeout(() => {nextLevelMsg.style.opacity = '0'}, 1000)
    
}

// GAME LOOP
const GAME_LOOP = setInterval(() => {
    // clear board
    context.clearRect(0, 0, canvas.width, canvas.height)

    // check collision and determine render for zombies and valuables
    LEVELS[`level${currentLevel}`].zombies.forEach(zombie => {
        if(zombie.type === 'zombie') {
            zombie.drawImage(zombieIdles[0])
        } else if(zombie.type === 'chonker') {
            zombie.drawImage(chonkerIdles[0])
        }
        // zombie.render()
        if(checkCollision(zombie)) {
            console.log('The zombies got you! You dead.')
        }
    })
    
    LEVELS[`level${currentLevel}`].valuables.forEach(valuable => {
        if(checkCollision(valuable) && !valuable.beenCollidedWith) {
            survivor.itemsCollected++
            valuable.beenCollidedWith = true
            // context.clearRect(valuable.x, valuable.y, valuable.w, valuable.h)
            console.log('ITEM COLLECTED!')
        } else if(!valuable.beenCollidedWith) {
            valuable.drawImage(chestsClosed[2])
            // valuable.render()
        }
    })

    // render survivor
    survivor.drawImage(playerIdles[0])
    // survivor.render()
    
    // SPOTLIGHT!!!
    spotLight.radialGradient(survivor.x, survivor.y)

    gameStatus()
}, 50)

// EVENT LISTENERS
// get keyboard inputs from user
document.addEventListener('keydown', playerMovement)
startBtn.addEventListener('click', (e) => {
    gameStart.style.opacity = '0'
    startFresh()
    levelDisplay()
})
resetBtn.addEventListener('click', () => {
    window.location.reload(); // easy fix for now
    return false // ^^that needs this
    gameStart.style.opacity = '1'
    startFresh()
})

function startFresh() {
    winMsg.style.opacity = '0'
    loseMsg.style.opacity = '0'
    levelSpan.innerHTML = `1/${totalLevels}`
    currentLevel = 1
    LEVELS.level1.buildLevel()
}

export {context, canvas}
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
    constructor(x, y, w, h, color) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
    }
    render() {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.w, this.h)
    }
}

// new Survivor!
const survivor = new Rectangle(60, 50, 20, 30, 'green')
survivor.render() // we have a survivor!
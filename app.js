import GameObject from "./gameobject.js"
import Player from "./player.js"
import Arena from "./arena.js"
import Globals from "./globals.js"
import Caster from "./caster.js"
import Turtle from "./turtle.js"
import BinaryTree from "./zindexer.js"
import Oni from "./oni.js"
import Bandit from "./bandit.js"

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const debug1 = document.querySelector("p:nth-child(1)")
const debug2 = document.querySelector("p:nth-child(2)")
const debug3 = document.querySelector("p:nth-child(3)")

const Display = {
    width: 2400,
    height: 1200,
    halfWidth: 1200,
    halfHeight: 600
}

context.canvas.width = Display.width
context.canvas.height = Display.height
context.imageSmoothingEnabled = false

function fetchImage(imageName) {
    return new Promise(resolve => {
        const image = new Image()
        image.onload = () => {
            resolve(image)
        }
        image.src = imageName
    })
}

let Spritesheet = null
async function init() {
    Spritesheet = await fetchImage("tiny.png")
    requestAnimationFrame(main)
}

const TestArena = new Arena(1000, 1000)
const player = new Player(TestArena.width/2, TestArena.height/2)
const caster = new Caster(300,600)

const oni = new Oni(250,150)
const bandit = new Bandit(600,600)

bandit.setTarget(player)

caster.setTarget(player)

const turtle = new Turtle(600,300)
turtle.setTarget(player)

const View = {
    x: TestArena.width/2,
    y: TestArena.height/2
}

let Paused = false
let Debug = false

function draw() {

    let zIndexer = new BinaryTree()

    GameObject.Instances.forEach(object => {
        if (object.active) {

            if (object.sprite) {
                zIndexer.insert(object)
            }
            
            if (Debug) {
                context.setTransform(1,0,0,1,object.collider.x - View.x + Display.halfWidth,object.collider.y - View.y + Display.halfHeight)
                context.beginPath()
                context.strokeStyle="white"
                context.arc(0,0,object.collider.radius,0, Math.PI * 2)
                context.stroke()
            }
        }
    })

    let sprites = zIndexer.getInOrder(zIndexer.root)

    sprites.forEach( object => {
        context.setTransform(object.sprite.flip? -1 : 1,0,0,1,object.x - View.x + Display.halfWidth,object.y - View.y + Display.halfHeight)
        context.rotate(object.rotation)
    
        const Sprite = object.sprite
        context.drawImage(
            Spritesheet,
            Sprite.sx + (Sprite.currentFrame * Sprite.width),
            Sprite.sy,
            Sprite.width,
            Sprite.height,
            -32 + Sprite.dxOffsetX,-32 + Sprite.dxOffsetY, 64, 64
        )
    })

    context.resetTransform()
    context.beginPath()
    context.strokeStyle="white"
    context.rect(-View.x + Display.halfWidth, -View.y + Display.halfHeight, TestArena.width, TestArena.height)
    context.stroke()

}

function update() {
    GameObject.Instances.forEach(object => {
        if (object.active) {
            object.update()
            TestArena.keepBounds(object)

            GameObject.Instances.forEach(other => {
                if (object.active && object.collider.collides(other.collider)) {
                    object.onCollision(other) 
                }
            })

            object.updatePosition()
        }
    })
    onKeysHeld(keysHeld)
}

function main() {
    if (!Paused) {
        context.resetTransform()
        context.clearRect(0,0,context.canvas.width, context.canvas.height)
        update()
        draw()
    }
    requestAnimationFrame(main)
}

init()

// input handlers
function onMouseClick(button) {
    if (button == Mouse.LeftButton) {
        player.dash(Mouse.x, Mouse.y)
    }
}

function onMouseMove() {
    player.moveTo(Mouse.x, Mouse.y)
}

function onKeyPress(key) {
    if (key == "KeyP") Paused = !Paused
    if (key == "KeyO") Debug = !Debug
}

function onKeysHeld(keys) {

}

const keysLast = {}
const keysHeld = {}
const Mouse = {
    LeftButton: 0,
    RightButton: 2,
    x: -1,
    y: -1
}

document.addEventListener("mousemove", event => {
    Mouse.x = (event.clientX / canvas.clientWidth) * context.canvas.width
    Mouse.y = (event.clientY / canvas.clientHeight) * context.canvas.height

    Mouse.x = Mouse.x + View.x - Display.halfWidth
    Mouse.y = Mouse.y + View.y - Display.halfHeight

    onMouseMove()
})

document.addEventListener("mousedown", event => {
    onMouseClick(event.button)
})

document.addEventListener("contextmenu", event => event.preventDefault())

document.addEventListener("keydown", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = true

    if (isKeyPressed(key)) {
        onKeyPress(key)
    }

})

document.addEventListener("keyup", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = false
})

function isKeyPressed(key) {
    return keysHeld[key] && !keysLast[key]
}

function setKeysLast() {
    for (let key in keysHeld) {
        keysLast[key] = keysHeld[key]; 
    }
}
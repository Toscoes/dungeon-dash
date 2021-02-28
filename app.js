import GameObject from "./gameobject.js"
import Player from "./player.js"
import Arena from "./arena.js"
import Globals from "./globals.js"
import Data from "./entitydata.js"
import Caster from "./caster.js"
import Turtle from "./turtle.js"
import BinaryTree from "./zindexer.js"
import Oni from "./oni.js"
import Bandit from "./bandit.js"
import Projectile from "./projectile.js"
import Enemy from "./enemy.js"

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const debug1 = document.querySelector("p:nth-child(1)")
const debug2 = document.querySelector("p:nth-child(2)")
const debug3 = document.querySelector("p:nth-child(3)")

const score = document.getElementById("score")
const gameOverBox = document.getElementById("game-over")
gameOverBox.querySelector("button").addEventListener("click", ()=>{
    location.reload()
})

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
let Arena1Floor = null
async function init() {
    Spritesheet = await fetchImage("tiny.png")
    Arena1Floor = await fetchImage("arena2.png")
    requestAnimationFrame(main)
}

const MainArena = new Arena(1000, 1000)
const player = new Player(MainArena.width/2, MainArena.height/2)

const View = {
    x: MainArena.width/2,
    y: MainArena.height/2
}

let Paused = false
let Debug = false
let GameOver = false

let tick = 0
let maxEnemyCap = 16
let enemyCap = 5
let spawnRate = 80
let diffInc = 200

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

    context.drawImage(Arena1Floor, -View.x + Display.halfWidth, -View.y + Display.halfHeight, MainArena.width, MainArena.height)

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
    context.rect(-View.x + Display.halfWidth, -View.y + Display.halfHeight, MainArena.width, MainArena.height)
    context.stroke()

    

}

function update() {
    GameObject.Instances.forEach(object => {
        if (object.active) {
            object.update()
            MainArena.keepBounds(object)

            GameObject.Instances.forEach(other => {
                if (object.active && object.collider.collides(other.collider)) {
                    object.onCollision(other) 
                }
            })

            object.updatePosition()
        }
    })
    onKeysHeld(keysHeld)

    if (tick % spawnRate == 0 && Enemy.getNumActive() < enemyCap) 
        spawnEnemy()

    if (tick % diffInc == 0 && enemyCap < maxEnemyCap) {
        enemyCap++
        spawnRate -= 5
    }

    tick++

    score.innerText = player.score

    if (!player.active) {
        GameOver = true
        gameOverBox.style.display = "block"
    }
}

function spawnEnemy() {
    let r = Math.random()

    let x = Math.random() * MainArena.width
    let y = Math.random() * MainArena.height

    if ( r < .75) {
        let b = Bandit.new(x,y)
        b.setTarget(player)
    } else {
        let c = Caster.new(x,y)
        c.setTarget(player)
    }
}

function main() {
    if (!Paused && !GameOver) {
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
import Collider from "./collider.js"
import Sprite from "./sprite.js"

export default class GameObject {

    static Instances = []

    constructor(x,y,data) {

        this.dataCollider = data.collider
        this.dataSprite = data.sprite

        this.x = x
        this.y = y
        this.dx = 0
        this.dy = 0
        this.rotation = 0
        
        this.collider = new Collider(x+data.collider.offsetX,y+data.collider.offsetY,+data.collider.radius)
        this.sprite = data.sprite? new Sprite(data.sprite) : null

        this.active = true

        GameObject.Instances.push(this)
    }

    static getInactive(instances) {
        for(let i = 0; i < instances.length; i++) {
            if (!instances[i].active) {
                return instances[i]
            }
        }
        return null
    }

    revive(x,y,data) {
        this.dataCollider = data.collider
        this.dataSprite = data.sprite

        this.x = x
        this.y = y
        this.dx = 0
        this.dy = 0
        this.rotation = 0
        
        this.collider = new Collider(x+data.collider.offsetX,y+data.collider.offsetY,+data.collider.radius)
        this.sprite = new Sprite(data.sprite)

        this.active = true
    }
    
    updatePosition() {
        this.collider.x += this.dx
        this.collider.y += this.dy
        this.x = this.collider.x
        this.y = this.collider.y
    }

    setPosition(x,y) {

    }

    translate(dx,dy) {

    }

    setRotation(rot) {
        this.rotation = rot
        this.sprite.rotation = rot
    }

    update() {
        if (this.sprite)
        this.sprite.animate()
    }
    onCollision(other) {}
}
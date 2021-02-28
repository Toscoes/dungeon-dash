import GameObject from "./gameobject.js";
import Globals from "./globals.js";

export default class Enemy extends GameObject {

    static Instances = []

    constructor(x,y,data) {
        super(x,y,data)
        this.target = null
        this.behavior = null
        this.turnToTarget = true
        this.state = 0

        Enemy.Instances.push(this)
    }

    static getNumActive() {
        let a = 0
        for(let i = 0; i < Enemy.Instances.length; i++) {
            if (Enemy.Instances[i].active) {
                a++
            }
        }
        return a
    }

    revive(x,y,data) {
        super.revive(x,y,data)
        this.target = null
        this.behavior = null
        this.turnToTarget = true
        this.state = 0
    }

    setTarget(target) {
        this.target = target
    }

    update() {
        super.update()

        if (this.target && this.turnToTarget) {
            let angle = (Globals.radBetweenPoint(this.target.x,this.target.y,this.x,this.y) / Math.PI) * 180
            this.sprite.flip = angle < 90 && angle > -90
        }
        
        if (this.behavior)
        this.behavior(this)
    }

    changeState(state) {
        this.state = state.id
        state.onChange(this)
        this.behavior = state.behavior
    }
}
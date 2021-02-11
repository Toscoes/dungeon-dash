import GameObject from "./gameobject.js"
import Globals from "./globals.js"
import Data from "./entitydata.js"
import Enemy from "./enemy.js"

export default class Player extends GameObject {
    constructor(x,y) {
        super(x,y,Data.player)
        this.dx = 0,
        this.dy = 0,
        this.dashing = false
        this.dashTick = 0

        this.bearingX = 0
        this.bearingY = 0

        this.speed = 10
        this.dashPower = 90

        this.crashed = false
    }

    update() {

        if (!this.dashing) {
            if (Globals.distance(this.bearingX, this.bearingY, this.x,this.y) > Globals.InactiveCursorRadius) {
                let rads = Globals.radBetweenPoint(this.x, this.y, this.bearingX, this.bearingY)
                this.dx = this.speed * Math.cos(rads)
                this.dy = this.speed * Math.sin(rads)
            } else {
                this.dx *= (Math.abs(this.dx) < Globals.Epsilon? 0 : Globals.Mu)
                this.dy *= (Math.abs(this.dy) < Globals.Epsilon? 0 : Globals.Mu)
            }

            let angle = (Globals.radBetweenPoint(this.bearingX,this.bearingY,this.x,this.y) / Math.PI) * 180
            this.sprite.flip = angle < 90 && angle > -90
        }

        if (this.dashing) {
            if (this.dashTick == 20) {
                this.dashing = false
                this.crashed = false
            }
            this.dx *= .8
            this.dy *= .8
            this.dashTick++
        }
    }

    onCollision(other) {

    }

    dash(x,y)
    {
        if (!this.dashing) {
            this.dashTick = 0
            this.dashing = true
            let rads = Globals.radBetweenPoint(this.x, this.y, x, y)
            this.dx = this.dashPower * Math.cos(rads)
            this.dy = this.dashPower * Math.sin(rads)
        }
    }

    moveTo(x,y) {
        this.bearingX = x
        this.bearingY = y
    }
}
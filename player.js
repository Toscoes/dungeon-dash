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
        this.state = 0

        this.score = 0

        this.changeState(Player.State.Default)
    }

    update() {
        super.update()

        let angle = (Globals.radBetweenPoint(this.bearingX,this.bearingY,this.x,this.y) / Math.PI) * 180
        this.sprite.flip = angle < 90 && angle > -90

        if (this.behavior)
        this.behavior(this)
    }

    changeState(state) {
        this.state = state.id
        state.onChange(this)
        this.behavior = state.behavior
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
            this.changeState(Player.State.Dashing)
        }
    }

    moveTo(x,y) {
        this.bearingX = x
        this.bearingY = y
    }

    static State = {
        Default: {
            id: 0,
            onChange: function(player) {
                player.sprite.set(Data.player.sprite)
            },
            behavior: function(player) {
                if (Globals.distance(player.bearingX, player.bearingY, player.x,player.y) > Globals.InactiveCursorRadius) {
                    player.changeState(Player.State.Moving)
                } else {
                    player.dx *= (Math.abs(player.dx) < Globals.Epsilon? 0 : Globals.Mu)
                    player.dy *= (Math.abs(player.dy) < Globals.Epsilon? 0 : Globals.Mu)
                }
                
            }
        },
        Moving: {
            id: 1,
            onChange: function(player) {
                player.sprite.set(Data.player.moving)
            },
            behavior: function(player) {
                if (Globals.distance(player.bearingX, player.bearingY, player.x,player.y) > Globals.InactiveCursorRadius) {
                    let rads = Globals.radBetweenPoint(player.x, player.y, player.bearingX, player.bearingY)
                    player.dx = player.speed * Math.cos(rads)
                    player.dy = player.speed * Math.sin(rads)
                } else {
                    player.changeState(Player.State.Default)
                }

            }
        },
        Dashing: {
            id: 2,
            onChange: function(player) {
                player.sprite.set(Data.player.dashing)
            },
            behavior: function(player) {
                if (player.dashTick == 20) {
                    player.dashing = false
                    player.crashed = false
                    player.changeState(Player.State.Default)
                }
                player.dx *= .8
                player.dy *= .8
                player.dashTick++
            }
        }
    }
}
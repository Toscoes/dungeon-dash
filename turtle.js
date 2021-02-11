import Enemy from "./enemy.js";
import Data from "./entitydata.js";
import GameObject from "./gameobject.js";
import Globals from "./globals.js";
import Player from "./player.js";

export default class Turtle extends Enemy {
    constructor(x,y) {
        super(x,y,Data.turtle)
        this.shield = new GameObject(x,y,Data.turtle.shield)
        this.swingCooldown = 60
        this.swingPrepTime = 20
        this.swingHangTime = 20
        this.swingTick = 0
        
        this.sprite.z = -1
        this.shield.sprite.z = 1

        this.changeState(Turtle.State.Default)
    }

    update() {
        super.update()
        if (this.target) {
            // move and rotate shield
            this.shield.collider.x = this.x
            this.shield.collider.y = this.y
            let angleShield = Globals.radBetweenPoint(this.x,this.y,this.target.x,this.target.y)
            this.shield.setRotation(angleShield)
            if (angleShield > Math.PI/2 || angleShield < -Math.PI/2) {
                this.shield.setRotation(Math.PI - angleShield)
                this.shield.sprite.flip = true
            } else {
                this.shield.setRotation(angleShield)
                this.shield.sprite.flip = false
            }
        }
    }

    onCollision(other) {
        if (other instanceof Player) {

            const Player = other

            if (Player.dashing && !Player.crashed) {
                Player.crashed = true
                Player.dx *= -1
                Player.dy *= -1
            }
        }
    }

    static State = {
        Default: {
            id: 0,
            onChange: function(turtle) {

            },
            behavior: function(turtle) {
                let angle = Globals.radBetweenPoint(turtle.x,turtle.y,turtle.target.x,turtle.target.y)
                if (Globals.distance(turtle.target.x, turtle.target.y, turtle.x,turtle.y) > 8000) {
                    turtle.dx = Math.cos(angle) * 1
                    turtle.dy = Math.sin(angle) * 1
                } else {
                    turtle.dx = 0
                    turtle.dy = 0
                }
            }
        },
        PrepareSwing: {
            id: 1,
            onChange: function() {

            },
            behavior: function() {

            }
        },
        Attack: {
            id: 2,
            onChange: function() {

            },
            behavior: function() {

            }
        }
    }
}
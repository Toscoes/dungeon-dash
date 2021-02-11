import Enemy from "./enemy.js";
import Data from "./entitydata.js";
import Projectile from "./projectile.js"
import Globals from "./globals.js"

export default class Caster extends Enemy {
    
    constructor(x,y) {
        super(x,y,Data.caster)
        this.fireTick = 0
        this.fireRate = 120

        this.changeState(Caster.State.Default)
    }

    update() {
        super.update()
        this.fireTick++
    }

    fire() {
        const projectile = Projectile.new(this,Data.caster.projectile)
        let angle = Globals.radBetweenPoint(this.x,this.y,this.target.x,this.target.y)
        projectile.dx = Math.cos(angle) * Data.caster.projectile.speed
        projectile.dy = Math.sin(angle) * Data.caster.projectile.speed
        this.fireTick = 0
    }

    static State = {
        Default: {
            id: 0,
            onChange: function(caster) {
                caster.sprite.set(Data.caster.sprite)
            },
            behavior: function(caster) {
                if (caster.target) {
                    if (caster.fireTick > caster.fireRate/2) {
                        caster.changeState(Caster.State.Casting)
                    }
                }
            }
        },
        Casting: {
            id: 1,
            onChange: function(caster) {
                caster.sprite.set(Data.caster.casting)
                caster.sprite.animationSpeed = 0.15
            },
            behavior: function(caster) {
                if (caster.fireTick > caster.fireRate) {
                    caster.fire()
                    caster.changeState(Caster.State.Default)
                }
            }
        }
    }

}
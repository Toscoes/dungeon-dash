import Enemy from "./enemy.js";
import Data from "./entitydata.js";
import GameObject from "./gameobject.js";
import Globals from "./globals.js";
import Player from "./player.js";

const DashPrepTime = 50
const DashDuration = 15
const DashPower = 75

export default class Bandit extends Enemy {
    constructor(x,y) {
        super(x,y,Data.bandit)
        this.dashTick = 0
        this.changeState(Bandit.State.Default)
    }

    update() {
        super.update()
        this.dashTick++
    }

    onCollision(other) {
        if (other instanceof Player) {

        }
    }

    static State = {
        Default: {
            id: 0,
            onChange: function(bandit) {
                bandit.dashTick = 0
                bandit.sprite.set(Data.bandit.sprite)
            },
            behavior: function(bandit) {
                let angle = Globals.radBetweenPoint(bandit.x,bandit.y,bandit.target.x,bandit.target.y)
                if (Globals.distance(bandit.target.x, bandit.target.y, bandit.x,bandit.y) > 30000) {
                    bandit.dx = Math.cos(angle) * 6
                    bandit.dy = Math.sin(angle) * 6
                } else {
                    bandit.changeState(Bandit.State.DashingPrep)
                }
            }
        },
        DashingPrep: {
            id: 1,
            onChange: function(bandit) {
                bandit.dashTick = 0
            },
            behavior: function(bandit) {
                if (bandit.dashTick > DashPrepTime) {
                    bandit.changeState(Bandit.State.Dashing)
                }
                bandit.dx *= (Math.abs(bandit.dx) < Globals.Epsilon? 0 : Globals.Mu)
                bandit.dy *= (Math.abs(bandit.dy) < Globals.Epsilon? 0 : Globals.Mu)
            }
        },
        Dashing: {
            id: 2,
            onChange: function(bandit) {
                bandit.sprite.set(Data.bandit.dashing)
                bandit.dashTick = 0
                let rads = Globals.radBetweenPoint(bandit.x, bandit.y, bandit.target.x, bandit.target.y)
                bandit.dx = DashPower * Math.cos(rads)
                bandit.dy = DashPower * Math.sin(rads)
            },
            behavior: function(bandit) {
                if (bandit.dashTick > DashDuration) {
                    bandit.changeState(Bandit.State.Default)
                }
                bandit.dx *= .8
                bandit.dy *= .8
            }
        },
    }
}
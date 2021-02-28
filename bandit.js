import Enemy from "./enemy.js";
import Data from "./entitydata.js";
import GameObject from "./gameobject.js";
import Globals from "./globals.js";
import Player from "./player.js";

const DashPrepTime = 70
const DashDuration = 50
const DashPower = 60

export default class Bandit extends Enemy {

    static Instances = []

    constructor(x,y) {
        super(x,y,Data.bandit)
        this.dashTick = 0
        this.changeState(Bandit.State.Default)

        Bandit.Instances.push(this)
    }

    static new(x,y) {
        let instance = GameObject.getInactive(Bandit.Instances)
        if (instance) {
            return instance.revive(x,y)
        } else {
            return new Bandit(x,y)
        }
    }

    revive(x,y) {
        super.revive(x,y,Data.bandit)
        this.dashTick = 0
        this.changeState(Bandit.State.Default)

        return this
    }

    update() {
        super.update()
        this.dashTick++
    }

    onCollision(other) {
        if (other instanceof Player) {
            if (other.dashing) {
                other.score++
                this.active = false
            } else if (this.state == 2) {
                other.active = false
            }
        }
    }

    static State = {
        Default: {
            id: 0,
            onChange: function(bandit) {
                bandit.dashTick = 0
                bandit.sprite.set(Data.bandit.sprite)
                bandit.turnToTarget = true
            },
            behavior: function(bandit) {
                if (bandit.target && Globals.distance(bandit.target.x, bandit.target.y, bandit.x,bandit.y) > 30000) {
                    bandit.changeState(Bandit.State.Moving)
                } else {
                    bandit.changeState(Bandit.State.DashingPrep)
                }
            }
        },
        Moving: {
            id: 3,
            onChange: function(bandit) {
                bandit.sprite.set(Data.bandit.moving)
            },
            behavior: function(bandit) {
                if (Globals.distance(bandit.target.x, bandit.target.y, bandit.x,bandit.y) > 30000) {
                    let angle = Globals.radBetweenPoint(bandit.x,bandit.y,bandit.target.x,bandit.target.y)
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
                bandit.sprite.set(Data.bandit.sprite)
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
                bandit.turnToTarget = false
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
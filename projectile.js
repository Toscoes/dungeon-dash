import GameObject from "./gameobject.js";
import Arena from "./arena.js";
import Player from "./player.js";

export default class Projectile extends GameObject {
    constructor(shooter,data) {
        super(shooter.x,shooter.y,data)
        this.shooter = shooter

        Projectile.Instances.push(this)
    }

    static Instances = []

    static new(shooter, data) {
        let instance = GameObject.getInactive(Projectile.Instances)
        if (instance) {
            return instance.revive(shooter, data)
        } else {
            return new Projectile(shooter, data)
        }
    }

    revive(shooter, data) {
        super.revive(shooter.x, shooter.y, data)
        this.shooter = shooter
        
        return this
    }

    update() {
        super.update()
    }

    onCollision(other) {
        if (other instanceof Arena) {
            this.active = false
        }
        if (other instanceof Player) {
            other.active = false
        }
    }
}
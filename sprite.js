export default class Sprite {
    constructor(data,z) {
        this.z = z
        this.sx = data.sx
        this.sy = data.sy
        this.dxOffsetX = data.dxOffsetX || 0
        this.dxOffsetY = data.dxOffsetY || 0
        this.width = data.width
        this.height = data.height
        this.frames = data.frames
        this.currentFrame = 0
        this.animationSpeed = 1
        this.flip = false
        this.loop = true
        this.frozen = false
        this.rotation = 0
        this.tick = 0
    }

    compare(other) {
        if (this.y == other.y) {
            if (this.z == other.z) {
                return 0
            } else {
                return this.z < other.z? -1 : 1
            }
        } else {
            return this.y < other.y? -1 : 1
        }
    }

    set(data) {
        this.sx = data.sx
        this.sy = data.sy
        this.width = data.width
        this.height = data.height
        this.frames = data.frames
        this.loop = data.loop || data.loop? true : false
        this.animationSpeed = data.speed || 1

        this.tick = 0
        this.currentFrame = 0
    }

    animate() {
        if (this.frames > 1) {
            if (this.loop) {
                this.currentFrame = Math.floor(this.tick % this.frames)
            } else {
                this.currentFrame = Math.min(this.frames, Math.floor(this.tick % this.frames))
            }
            if (!this.frozen) {
                this.tick += this.animationSpeed
            }
        }
    }
}
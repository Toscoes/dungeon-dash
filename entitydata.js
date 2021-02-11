// design notes
// next tier of bandit can deploy a clone and teleport behind the player and immediately dash, player cannot take head on counter dash attacks

export default {
    player: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 32
        },
        sprite: {
            sx: 0,
            sy: 0,
            width: 8,
            height: 8,
            frames: 1
        }
    },
    caster: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 32
        },
        sprite: {
            sx: 32,
            sy: 8,
            width: 8,
            height: 8,
            frames: 1
        },
        casting: {
            sx: 0,
            sy: 40,
            width: 8,
            height: 8,
            frames: 7
        },
        projectile: {
            collider: {
                offsetX: 0,
                offsetY: 0,
                radius: 16
            },
            sprite: {
                sx: 16,
                sy: 24,
                width: 8,
                height: 8,
                frames: 1
            },
            speed: 8
        }
    },
    turtle: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 32
        },
        sprite: {
            sx: 56,
            sy: 56,
            width: 8,
            height: 8,
            frames: 1
        },
        shield: {
            collider: {
                offsetX: 0,
                offsetY: 0,
                radius: 0
            },
            sprite: {
                sx: 24,
                sy: 24,
                dxOffsetX: 16,
                dyOffsetY: 0,
                width: 8,
                height: 8,
                frames: 1
            },
        }
    },
    oni: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 32
        },
        sprite: {
            sx: 64,
            sy: 16,
            width: 8,
            height: 8,
            frames: 1
        },
        casting: {
            sx: 64,
            sy: 24,
            width: 8,
            height: 8,
            frames: 4,
            loop: false,
            speed : 0.1
        }
    },
    bandit: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 32
        },
        sprite: {
            sx: 64,
            sy: 40,
            width: 8,
            height: 8,
            frames: 1
        },
        dashing: {
            sx: 72,
            sy: 40,
            width: 8,
            height: 8,
            frames: 1
        }
    }
}
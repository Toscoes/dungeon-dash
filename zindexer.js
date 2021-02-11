class Node {
    constructor(object) {
        this.object = object
        this.left = null
        this.right = null
    }
}

export default class BinaryTree {

    constructor() {
        this.root = null
    }

    insert(object) {
        this.root = this.insertHelper(this.root, object)
    }

    insertHelper(curr, object) {
        if (!curr) {
            return new Node(object)
        } else {
            let diff = curr.object.y - object.y
            if (Math.abs(diff) < 1) { 
                // if y values are very close, fall back to z index, relevant for sprites stacked on top another
                if (curr.object.sprite.z > object.sprite.z) {
                    curr.left = this.insertHelper(curr.left, object)
                    return curr
                } else {
                    curr.right = this.insertHelper(curr.right, object)
                    return curr
                }
            } else if (curr.object.y > object.y) {
                curr.left = this.insertHelper(curr.left, object)
                return curr
            } else if (curr.object.y < object.y) {
                curr.right = this.insertHelper(curr.right, object)
                return curr
            }
        }
    }

    getInOrder(curr) {
        let acc = []
        if (!curr) {
            return acc
        } else {
            acc = acc.concat(this.getInOrder(curr.left))
            acc.push(curr.object)
            acc = acc.concat(this.getInOrder(curr.right))
        }
        return acc
    }
}
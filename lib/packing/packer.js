/** 二维装箱问题 */
/** 
 * 确定宽高 w h
 * 空白区域先放一个, 剩下的寻找右边和下边
 * 是否有满足右边的, 有则 放入 无则 继续遍历
 * 是否有满足下边的, 有则 放入 无则 继续遍历
 */

const Packer = function (w, h) {
    this.root = { x: 0, y: 0, width: w, height: h };
    this.usedArea = { width: 0, height: 0 };
    this.levelBlocks = [];

    // /** 匹配所有的方格 */
    Packer.prototype.fit = function (blocks) {

        let node;
        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            node = this.findNode(this.root, block.width, block.height);
            if (node) {
                let fit = this.findEmptyNode(node, block.width, block.height);
                block.x = fit.x;
                block.y = fit.y;
                // block.fit = fit;

                this.usedArea = {
                    width: Math.max(this.usedArea.width, block.width + block.x),
                    height: Math.max(this.usedArea.height, block.height + block.y)
                };
            }else{
                blocks.splice(i,1);
                this.levelBlocks.push(block);
            }
        }

    }

    /** 找到可以放入的节点 */
    Packer.prototype.findNode = function (node, w, h) {
        if (node.used) {
            // console.log("000",node)
            return this.findNode(node.rightArea, w, h) || this.findNode(node.downArea, w, h);
        } else if (node.width >= w && node.height >= h) {
            return node;
        } else {
            return null;
        }
    }

    /** 找到空位 */
    Packer.prototype.findEmptyNode = function (node, w, h) {

        //已经使用过的 删除 
        node.used = true;

        //右边空间
        node.rightArea = {
            x: node.x + w,
            y: node.y,
            width: node.width - w,
            height: h
        };

        //下方空位
        node.downArea = {
            x: node.x,
            y: node.y + h,
            width: node.width,
            height: node.height - h
        }

        return node;

    }
}

module.exports = Packer;

// const demoArr = [
//     {
//         w: 10,
//         h: 10
//     },
//     {
//         w: 100,
//         h: 20
//     },
//     {
//         w: 10,
//         h: 100
//     }
// ]

// const test = new Packer(100, 100);

// test.fit(demoArr);

// console.log("test-->>", test);


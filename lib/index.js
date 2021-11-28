const path = require("path");
const fs = require("fs");
const images = require("images");
const { Packer } = require("./packing");
/**
 * 图集打包工具
 * @param {*} opt
 */
const MySpritePackTool = function (opt) {
    this.options = {
        maxCount: opt.maxCount || 2,
        assetsPath: opt.assetsPath,
        outPutPath: opt.outPutPath,
        maxSize: { width: 2048, height: 2048 }
    }
};

MySpritePackTool.prototype.Pack2Sprite = function () {
    //获得文件目录树
    var dirStruct = {};
    this.findAllFiles(dirStruct, this.options.assetsPath);
    //处理图片
    this.dealImgsPacking(dirStruct);
    //绘制图集
    this.drawImages(dirStruct);
}

MySpritePackTool.prototype.findAllFiles = function (obj, rootPath) {
    let nodeFiles = [];
    if (fs.existsSync(rootPath)) {
        //获取所有文件名
        nodeFiles = fs.readdirSync(rootPath);

        //组装对象
        let nameArr = rootPath.split('/');
        obj["assets"] = [];
        obj["name"] = nameArr[nameArr.length - 1];
        obj["keys"] = "";

        nodeFiles.forEach(item => {
            //判断不是图片路径
            if (!/(.png)|(.jpe?g)$/.test(item)) {
                let newPath = path.join(rootPath, item);
                //判断存在文件 同时是文件夹系统
                if (fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
                    // console.log("获得新的地址", newPath);
                    obj[item] = {};
                    this.findAllFiles(obj[item], newPath);

                } else {
                    console.log(`文件路径: ${newPath}不存在!`);
                }

            } else {
                console.log(`图片路径: ${item}`);
                obj["keys"] += item + ",";
                let params = {};
                params["id"] = path.resolve(rootPath, `./${item}`);
                //获得图片宽高
                params["width"] = images(path.resolve(rootPath, `./${item}`)).width();
                params["height"] = images(path.resolve(rootPath, `./${item}`)).height();
                obj["assets"].push(params);
            }
        })

    } else {
        console.log(`文件路径: ${rootPath}不存在!`);
    }
}

MySpritePackTool.prototype.dealImgsPacking = function (obj) {
    let count = 0;
    if (obj.hasOwnProperty("assets")) {
        let newBlocks = obj["assets"];
        obj["assets"] = [];

        while (newBlocks.length > 0 && count < this.options.maxCount) {
            let packer1 = new Packer(this.options.maxSize.width, this.options.maxSize.height);
            packer1.fit(newBlocks);

            let sheets1 = {
                maxArea: packer1.usedArea,
                atlas: newBlocks,
                fileName: `${obj['name'] + (count ? "-" + count : '')}`
            };
            newBlocks = packer1.levelBlocks;
            obj["assets"].push(sheets1);
            count++;
        }
    }
    for (let item in obj) {
        if (obj[item].hasOwnProperty("assets")) {
            this.dealImgsPacking(obj[item]);
        }
    }
}
MySpritePackTool.prototype.drawImages = function (obj) {
    let count = 0;
    if (obj.hasOwnProperty("assets")) {
        //打包出一个或者多个图集
        let imgsInfo = obj["assets"];
        imgsInfo.forEach(item => {
            if (item.hasOwnProperty("atlas")) {
                let imgObj = item["atlas"];
                // console.log("8888",imgObj)
                //绘制一张透明图像
                let newSprites = images(item["maxArea"].width, item["maxArea"].height);
                imgObj.forEach(it => {
                    newSprites.draw(images(it["id"]), it["x"], it["y"]);
                });

                newSprites.save(`${this.options.outPutPath}/${item['fileName']}.png`);
                count++;
            }
        })
    }

    for (let item in obj) {
        if (obj[item].hasOwnProperty("assets")) {
            this.drawImages(obj[item]);
        }
    }

}

module.exports = MySpritePackTool;







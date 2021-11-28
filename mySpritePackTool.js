const path = require("path");
const fs = require("fs");
const images = require("images");
const { Packer } = require("./packing");

//程序路径
// const argv = process.argv;
// console.log("argv",argv[2]);


//需要合成的图集的路径
const assetsPath = path.resolve(__dirname, "./assets");
console.log("assets--", assetsPath);


//遍历所有的文件 获取文件名
// const assetsFiles = fs.readdirSync(assetsPath);
// console.log("assetsFiles", assetsFiles);

//获得文件目录树
var dirStruct = {};
findAllFiles(dirStruct, assetsPath);

// console.log(dirStruct);

//处理图片
dealImgsPacking(dirStruct);

console.log(dirStruct);

//绘制图集
drawImages(dirStruct);

/**
 *  绘制图集
 * @param {*} obj
 */

function drawImages(obj) {

    if (obj.hasOwnProperty("assets")) {
        //先确定宽高
        var newSprites = images(obj["maxArea"].width, obj["maxArea"].height);
        let img = obj["assets"];

        img.forEach(item => {
            // console.log("9090", item["id"])
            newSprites.draw(images(item["id"]), item["x"], item["y"]);
        })

        newSprites.save(`./assets/${Date.now()}.png`);
    }

    for (let item in obj) {
        if (obj[item].hasOwnProperty("assets")) {
            drawImages(obj[item]);
        }
    }

}



/**
 * 将图片装箱
 * @param {*} obj
 */
function dealImgsPacking(obj) {
    if (obj.hasOwnProperty("assets")) {
        let packer = new Packer(2048, 2048);
        packer.fit(obj["assets"]);
        obj["maxArea"] = packer.usedArea;
        console.log("root---", packer.usedArea)
    }
    for (let item in obj) {

        if (obj[item].hasOwnProperty("assets")) {
            dealImgsPacking(obj[item]);
        }
    }
}


/**
 * 获取所有文件节点
 * @param {*} rootPath
 */
function findAllFiles(obj, rootPath) {
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
                    console.log("获得新的地址", newPath);
                    obj[item] = {};
                    findAllFiles(obj[item], newPath);

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




// const myImg = images("./assets/star.png");

// console.log("9999",myImg)

// myImg.save("./assets/save.png",{
//     quality: 80
// })



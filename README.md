# 图片打包工具

图像处理基于 [node-images](https://github.com/zhangyuanwei/node-images)

## 简介

轻量级的图集打包工具

npm地址 : https://www.npmjs.com/package/sprites-pack-tool

## 使用方法

```js
npm i sprites-pack-tool

```

导入

```js
const MySpritePackTool = require("sprites-pack-tool");
```


```js
const MySpritePackTool = require("sprites-pack-tool");
const path = require("path");
/** 打包最多递归次数 */
const MAX_COUNT = 2;
//需要合成的图集的路径
const assetsPath = path.resolve(__dirname, "./assets");

/** 图集打包工具配置*/
const mySpritePackTool = new MySpritePackTool({
    //一个文件夹图片过多或者过长 递归最大次数
    maxCount: MAX_COUNT,
    //需要打包图集的文件路径
    assetsPath: assetsPath,
    //输出文件路径
    outPutPath: path.resolve(__dirname, "./res"),
    //一张图集打包最大size
    maxSize: { width: 2048,height: 2048}
});
/** 图集打包 */
mySpritePackTool.Pack2Sprite();
```


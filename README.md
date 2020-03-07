# Document-Transmission
demo website https://file.ifthat.com

## Install
``` bash
git clone https://github.com/allenliu123/DocumentTransmission.git`
cd DocumentTransmission
npm install

```

## Run
```
export NODE_ENV=file
node app.js
```
> it will run this website on port 8081

```
export NODE_ENV=static
node app.js
```
> it will run this website on port 8082
> static 模式禁止山删除文件

```
node app.js
```
> it will run this website on port 8080

## Features
1. 切换拖拽和文字输入两种模式
![](https://static.ifthat.com/public/data/9053feaa14f4ff2e-image.png)
![](https://static.ifthat.com/public/data/9c404f19494d921e-image.png)
1. 截图后直接按ctrl+v上传剪贴板上的图片
![](https://static.ifthat.com/public/data/ac6df8b39ff3d730-image.png)
1. 文件操作，删除，下载，打开，复制链接地址
![](https://static.ifthat.com/public/data/ee57d7b63ca60049-image.png)
2. 选择删除
![](https://static.ifthat.com/public/data/4c769fb7f4205944-image.png)

## Todo

- [x] 拖动文件上传
- [x] 上传进度条
- [x] 可以将文字保存为文本文件并显示
- [x] 粘贴截图上传
- [ ] 粘贴文件
- [ ] 文件下拉加载

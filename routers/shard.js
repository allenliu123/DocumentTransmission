var express = require('express');
var generateUUID = require('../utils/generateUUID')
var router = express();
var fs = require('fs');

/**
 * req.body {
 * 	 key: string, // 文件名 hash
 *   data: string, // 分片 base64 数据
 *   index: number, // 分片索引
 * }
 */
router.get('/aa', function(req, res) {
	res.json({message: 'ok'})
})
router.post('/uploadShard', function(req, res){
	const { key, data, index } = req.body
	if (!fs.existsSync(`./public/cache/${key}`)) {
		fs.mkdirSync(`./public/cache/${key}`);
	}
	const pureBase64Str = data.split(',')[1]
	const buff = Buffer.from(pureBase64Str, 'base64'); 
	fs.writeFile(`./public/cache/${key}/${key}-${index}`, buff, function(err){
		if (err) {
			console.log(err)
	  } else {
			res.json({message: '分片上传成功'})
		}
	});
});

/**
 * req.body {
 * 	 key: string, // 文件名 hash
 *   total: number // 分片总数
 * }
 */
router.post('/mergeFile', function(req, res) {
	const { key, total, filename } = req.body
	const chunkPath = `./public/cache/${key}`
	if (!fs.existsSync(chunkPath))  {
		res.json({message: '分片合并异常'})
		return
	}
	mergeFile(key, total, filename).then(() => {
		const sourcePath = `./public/cache/${key}/${filename}`
		const targetPath = `./public/data/${generateUUID()}-${filename.replace(/ /g,"-")}`
		fs.renameSync(sourcePath, targetPath, function() {});
		fs.rmdirSync(`./public/cache/${key}`)
		res.json({message: '分片合并成功'})
	}).catch(() => {
		res.json({message: '分片合并异常'})
	})
});

// 合并文件
function mergeFile(key, chunkCount, filename) {
	const writeStream = fs.createWriteStream(`./public/cache/${key}/${filename}`); 
	return new Promise((resolve, reject) => {
		// 递归合并文件
		function mergeRec(key, chunkCount, chunkIndex) {
			//结束标志为已合并数量大于总数（mergedChunkNum从0开始）
			if (chunkIndex >= chunkCount) {
				console.log(key, '合并完成')
				resolve()
				return
			}
			const chunkFilePath = `./public/cache/${key}/${key}-${chunkIndex}`
			const curChunkReadStream = fs.createReadStream(chunkFilePath);
			curChunkReadStream.pipe(writeStream, { end: false }); //end = false 则可以连续给writeStream 写数据
			curChunkReadStream.on("end", () => {
				//readStream 传输结束 则 递归 进行下一个文件流的读写操作
				fs.unlinkSync(chunkFilePath) //删除chunkFile
				chunkIndex += 1
				mergeRec(key, chunkCount, chunkIndex);
			});
			curChunkReadStream.on("error", () => {
				reject()
			})
		}
		mergeRec(key, chunkCount, 0)
	})
}

module.exports = router;
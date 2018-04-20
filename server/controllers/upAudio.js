const { mysql } = require('../qcloud')
const cos = require('../qcos')
const path = require('path')
const fs = require('fs')

const Folder = 'upload/'

module.exports = async (ctx, next) => {
    var resp = ''
    var src_path = ''
    let body = ctx.request.body
    //console.log(body)
    var fields = body.fields
    let file = body.files.file
    let fileName = fields.file_id + '.MP3'
    let key = path.join(Folder, fileName)
    file.name = key

    var params = {
        Bucket: 'test-1256378396',
        Region: 'ap-guangzhou',
        ContentLength: file.size,
        Key: file.name,
        Body: fs.createReadStream(file.path)
    }

    cos.putObject(params, function (err, data) {
        resp = err || data
        console.log(resp)
        src_path = resp['Location']
        console.log(src_path)
        console.log('put')
        insert(src_path)
    })

    console.log(fields)
    console.log(file)
    var insert = (src_path) => {
        //await会阻塞等待执行返回,在async函数内部使用
        mysql('t_audio').insert({
            file_id: fields.file_id,
            src_path: src_path,
            c_name: fields.c_name,
            s_name: fields.s_name,
            level: fields.level,
            ski: fields.ski,
            ver: fields.ver
        });
        console.log('insert')
        ctx.state.data = src_path
    }
}
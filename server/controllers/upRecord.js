const { mysql } = require('../qcloud')
const cos = require('../qcos')
const fs = require('fs')

const Bucket = 'record-1256378396'
const Region = 'ap-guangzhou'

module.exports = async ctx => {
    var src_record = ''
    var body = ctx.request.body
    console.log(body)
    var file = body.files.file
    console.log(file)
    var fields = body.fields
    var file_id = fields.file_id
    var record_id = file_id + new Date().getTime()
    console.log(record_id)

    var fileName = file_id + '.mp3'
    file.name = fileName
    
    var params = {
        Bucket: Bucket,
        Region: Region,
        ContentLength: file.size,
        Key: file.name,
        Body: fs.createReadStream(file.path)
    }

    function uploder() {
        return new Promise((resolve, reject) => {
            cos.putObject(params, function (err, data) {
                resp = err || data
                src_record = resp['Location']
                resolve()
            })
        })
    }
    //await 在async修饰的函数下,必须是Promise才有效果
    await uploder()

    console.log(src_record)

    //await mysql('t_record').insert({
    //    record_id: record_id,
    //    file_id: file_id,
    //    src_video: fields.src_video,
    //    video_size: video_size,
    //    title: fields.title,
    //    serifu: fields.serifu,
    //    koner: fields.koner,
    //    roma: fields.roma,
    //    src_image: src_image,
    //    level: level,
    //    cate: cate,
    //    status: 1
    //});
}
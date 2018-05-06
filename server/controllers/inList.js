const { mysql } = require('../qcloud')
const cos = require('../qcos')
const fs = require('fs')

const Bucket = 'image-1256378396'
const Region = 'ap-guangzhou'

module.exports = async ctx => {
    var resp = ''
    var src_image = ''
    var body = ctx.request.body
    console.log(body)
    var fields = body.fields
    var file_id = fields.file_id
    var flst = file_id.split("_") //["ssr", "xtz", "0", "1"]
    var level = flst[0]
    var s_name = flst[1]
    var ski = flst[2]
    var ver = flst[3]
    var cate = "y"
    //if (file_id.startsWith("s")
    var file = body.files.file
    var fileName = file_id + '.png'
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
                src_image = resp['Location']
                resolve()
            })
        })
    }
    //await 在async修饰的函数下,必须是Promise才有效果
    await uploder()

    await mysql('t_list').insert({
        file_id: file_id,
        src_video: fields.src_video,
        title: fields.title,
        serifu: fields.serifu,
        koner: fields.koner,
        roma: fields.roma,
        src_image: src_image,
        level: level,
        cate: cate,
        status: 1
    });

    await mysql('t_audio').insert({
        file_id: file_id,
        src_audio: fields.src_audio,
        c_name: fields.c_name,
        s_name: s_name,
        shadow: fields.shadow,
        level: level,
        ski: ski,
        ver: ver,
        cate: cate,
        status: 1
    });

    ctx.state.data = src_image
}



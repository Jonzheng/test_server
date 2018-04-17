const { mysql } = require('../qcloud')
const cos = require('../qcos')
const path = require('path')

const Folder = 'upload/'

module.exports = async ctx => {
    var resp = ''
    let body = ctx.request.body
    //console.log(body)
    let fields = body.fields
    let file = body.files.file
    let fileName = fields.file_id + '.MP3'
    let key = path.join(Folder, fileName)
    file.name = key
    //console.log(file)
    cos.sliceUploadFile({
        Bucket: 'test-1256378396',
        Region: 'ap-guangzhou',
        Key: file.name,
        FilePath: file.path
    }, function (err, data) {
        resp = err || data
        console.log(resp)
        ctx.state.data = resp
    });

    let sqlr = mysql('t_audio').insert({ file_id: fields.file_id, src_path:'path',name:'n',level:'l',ski:'s',ver:'v' });
    console.log(sqlr);
    
}
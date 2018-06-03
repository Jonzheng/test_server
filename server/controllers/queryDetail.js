const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var result = {}
    var body = ctx.request.body
    var file_id = body.file_id
    if (file_id){
        result["list_result"] = await mysql('t_list').select('*').where('cate', body.cate).andWhere('file_id', file_id)
        result["audio_result"] = await mysql('t_audio').select('*').where('file_id', file_id)
        result["record_result"] = await mysql('t_record').select('*').innerJoin('t_user', 't_record.master_id', 't_user.openid').where('file_id', file_id).andWhere('status', 1).orderBy('t_record.c_date', 'desc')
    }else{
        result["list_result"] = await mysql('t_list').select('*').where('cate', body.cate)
        result["audio_result"] = await mysql('t_audio').select('*')
    }
    ctx.state.data = result
}
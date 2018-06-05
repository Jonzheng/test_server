const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var result = {}
    var body = ctx.request.body
    var file_id = body.file_id
    var cate = body.cate
    var user_id = body.user_id
    if (file_id){
        result["list_result"] = await mysql('t_list').select('*').where('cate', cate).andWhere('file_id', file_id).andWhere('status', 1)
        result["audio_result"] = await mysql('t_audio').select('*').where('file_id', file_id).andWhere('status', 1)
        result["heart_result"] = await mysql('t_heart').select('*').where('file_id', file_id).andWhere('user_id', user_id).andWhere('status', 1)
        result["record_result"] = await mysql('t_record').select('*').innerJoin('t_user', 't_record.master_id', 't_user.openid').where('file_id', file_id).andWhere('status', 1).orderBy('t_record.c_date', 'desc')

    }else{
        result["list_result"] = await mysql('t_list').select('*').where('cate', cate)
        result["audio_result"] = await mysql('t_audio').select('*')
    }
    ctx.state.data = result
}
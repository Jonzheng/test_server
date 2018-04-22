const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var fields = body.fields

    //const data = await mysql('t_audio').select('*').where('level', 1)
    //const data = await mysql('t_audio').select('*').leftJoin('t_list', 't_audio.file_id', 't_list.file_id')
    const data = await mysql('t_audio').select('*')
    ctx.state.data = data
}
const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    const data = await mysql('t_list').select('*').where('cate', body.cate)
    ctx.state.data = data
}
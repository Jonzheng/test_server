const { mysql } = require('../qcloud')
const cos = require('../qcos')

const Bucket = 'audio-1256378396'
const Region = 'ap-guangzhou'

module.exports = async ctx => {
    let body = ctx.request.body
    var openid = body.openid
    var lst = await mysql.raw('insert into t_user(openid, c_date) values (?,now())on duplicate key update u_date = now()', openid);
    ctx.state.data = lst
}
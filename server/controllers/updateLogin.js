const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var openid = body.openid
    var avatarUrl = body.avatarUrl
    var result = await mysql.raw('insert into t_user(openid, c_date) values (?,now())on duplicate key update latest_date = now()', openid);
    if (avatarUrl) await mysql("t_user").where("openid", openid).update({ avatar_url: avatarUrl })
    ctx.state.data = result
}
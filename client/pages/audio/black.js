const config = require('../../config')

const Pre = 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/'

Page({
    data: {
        lst_audio: [],
        icon_play: "../../image/play.png",
        icon_stop: "../../image/stop.png",
    },
    onLoad: function () {
        var that = this
        wx.request({
            url: config.service.uAudioUrl,
            method: 'POST',
            data: {
                cate: 'all',
            },
            success: function (res) {
                console.log(res.data)
                var content = res.data.data.content
                var t_list = res.data.data.t_list
                var lst_dct = []
                console.log(content)
                console.log(t_list)
                for (let i in t_list) {
                    let ele = t_list[i]
                    let file_id = ele["file_id"]
                    lst_dct.push(file_id)
                }
                var lst_audio = []
                for (let i in content) {
                    let ele = content[i]
                    let key = ele["Key"]
                    let size = ele["Size"]
                    let file_id = key.substring(0, key.indexOf("."))
                    let inside = 0
                    if (lst_dct.indexOf(file_id) != -1) inside = 1;
                    let dct_audio = { "file_id": file_id, "src": Pre + key, "inside": inside }
                    lst_audio.push(dct_audio)
                }
                console.log(lst_audio)
                that.setData({
                    lst_audio
                })
            }
        })
    },
    chooseImage: function () {
        var that = this
        that.setData({
            src_audio: ''
        })
        wx.chooseImage({
            count: 1,
            success: function (res) {
                console.log(res)
                that.setData({
                    src_audio: res.tempFilePaths[0]
                })
            }
        })
    },

    edit: function (e) {
        let dataset = e.currentTarget.dataset
        let file_id = dataset['id']
        let src_path = dataset['src']
        let c_name = dataset['c_name']
        let ski = dataset['ski']
        let cate = dataset['cate']
        let level = dataset['level']
        let url = '../b_prepare/prepare?file_id=' + file_id + '&src_path=' + src_path + '&c_name=' + c_name + '&ski=' + ski + '&cate=' + cate + '&level=' + level
        wx.navigateTo({ url: url })
    }

})

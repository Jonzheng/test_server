const audioCtx = new AudioContext();
const config = require('../../config')
const ski_dict = { '0': '触碰', '1': '技能1', '2': '技能2', '3': '技能3' }

const PreAudio = 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/'
const SufAudio = '.mp3'
const PreVideo = 'https://video-1256378396.cos.ap-guangzhou.myqcloud.com/'
const SufVideo = '.MP4'

Page({
    data: {
        myFalse: false,
        icon_play: "../../image/play.png",
        icon_stop: "../../image/stop.png",
        koner: "",
        filePath: '',
        shadow: ''
    },

    onLoad: function (option) {
        var that = this
        console.log(option)
        var file_id = option['file_id']
        var src_audio = PreAudio + file_id + SufAudio
        var src_video = PreVideo + file_id + SufVideo

        this.setData({
            file_id,
            src_audio,
            src_video,
        })

        //如果已经发布/////////////////////////
        //wx.request({
        //    url: config.service.qVideoUrl,
        //    method: 'POST',
        //    data: {
        //        file_id: option['file_id'],
        //    },
        //    success: function (res) {
        //        var src_vd = res.data.data
        //        console.log(src_vd)
        //        let ele_audio = ''
        //        that.setData({
        //            src_vd: src_vd,
        //        })
        //    }
        //})
    },

    load_src: function (e) {
        var th = this
        wx.request({
            url: this.data.src_audio,
            responseType: 'arraybuffer',
            success: function (audioData) {
                audioCtx.decodeAudioData(audioData.data).then(function (decodedData) {
                    var source = audioCtx.createBufferSource();
                    var analyser = audioCtx.createAnalyser();
                    source.buffer = decodedData
                    source.connect(analyser)
                    analyser.connect(audioCtx.destination);

                    analyser.fftSize = 128;
                    var bufferLength = analyser.frequencyBinCount;
                    var dataArray = new Uint8Array(bufferLength);
                    analyser.getByteFrequencyData(dataArray);
                    console.log('-----')

                    source.start()

                    var count = 0
                    var list_o = new Array()
                    function _render() {
                        var that = this
                        count += 1
                        if (count == 421) { //不能超过9s的音频
                            let lst_s = []
                            for (let i=0;i<list_o.length-1;i++){
                                if (list_o[i] < list_o[i + 1] / 2){
                                    list_o[i] = list_o[i + 1] / 2;
                                }
                                if (list_o[i] / 2 > list_o[i + 1]){
                                    list_o[i + 1] = list_o[i] / 2;
                                }
                            }
                            var _max = 0
                            for (let i = 0; i < list_o.length; i++) {
                                if (i % 4 == 0){
                                    let av = (list_o[i] + list_o[i + 1] + list_o[i + 2] + list_o[i + 3]) / 4
                                    let sam = Math.round(av)
                                    lst_s.push(sam)
                                    if (sam > _max) _max = sam
                                }
                            }
                            for (let i = 0; i < lst_s.length - 1; i++) {
                                if (lst_s[i] < lst_s[i + 1] / 2) {
                                    lst_s[i] = Math.round(lst_s[i + 1] / 2);
                                }
                                if (lst_s[i] / 2 > lst_s[i + 1]) {
                                    lst_s[i + 1] = Math.round(lst_s[i] / 2);
                                }
                            }
                            var rate = 100 / _max
                            for (let i = 0; i < lst_s.length; i++) {
                                if (lst_s[i] > 3) lst_s[i] = Math.round(lst_s[i] * rate)
                            }
                            console.log(lst_s)
                            th.setData({
                                shadow: lst_s
                            })
                            return true
                        }
                        analyser.getByteTimeDomainData(dataArray);
                        //analyser.getByteFrequencyData(dataArray);
                        var sum = 0
                        dataArray.forEach(function (v) {
                            sum += v
                        })
                        //console.log(Math.abs(2048 - sum))
                        var h = Math.abs(8192 - sum) / 10
                        if (h < 3) h = 3
                        list_o.push(h)
                        setTimeout(function () {
                            _render.call(that);
                        }, 20);
                    }
                    _render()

                    //function _render() {
                    //    var that = this
                    //    count += 1
                    //    console.log(source)
                    //    if (count == 20){
                    //        return true
                    //    }
                    //    dataArray = new Uint8Array(bufferLength);
                    //    analyser.getByteFrequencyData(dataArray);
                    //    //console.log(dataArray)
                    //    setTimeout(function () {
                    //        _render.call(that);
                    //    }, 200);
                    //}
                    //_render()
                });

            }
        })
    },
    chooseImage: function () {
        var that = this
        that.setData({
            src_image: ''
        })
        wx.chooseImage({
            count: 1,
            success: function (res) {
                console.log(res)
                that.setData({
                    src_image: res.tempFilePaths[0]
                })
            }
        })
    },

    cnameInput: function (e) {
        this.setData({
            c_name: e.detail.value
        })
    },
    titleInput: function (e) {
        this.setData({
            title: e.detail.value
        })
    },
    serifuInput: function (e) {
        this.setData({
            serifu: e.detail.value
        })
    },
    romaInput: function (e) {
        this.setData({
            roma: e.detail.value
        })
    },
    konerInput: function (e) {
        this.setData({
            koner: e.detail.value
        })
    },

    push: function () {
        var that = this
        var src_image = that.data.src_image
        console.log(this.data)

        wx.uploadFile({
            url: config.service.inListUrl,
            filePath: src_image,
            name: 'file',
            formData: {
                file_id: that.data.file_id,
                src_video: that.data.src_video,
                src_audio: that.data.src_audio,
                file_id: that.data.file_id,
                c_name: that.data.c_name,
                title: that.data.title,
                serifu: that.data.serifu,
                koner: that.data.koner,
                roma: that.data.roma,
                src_image: src_image,
                shadow: that.data.shadow.toString()
            },
            header: {
                'content-type': 'multipart/form-data'
            },
            success: function (res) {
                console.log('success')
                console.log(res)
                //that.uploadVideo();
            },

            fail: function (e) {
                console.log('fail')
            }
        })
    }

})

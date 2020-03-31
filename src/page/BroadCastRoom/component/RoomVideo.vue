<template>
  <div class="video-wrapper" v-loading="loading">
    <div v-show="!type" v-html="remoteStream" :class="remoteStream ? 'distant-stream' : ''"></div>
    <div v-show="type" id='local_stream' class="local-stream"></div>
    <div class="btn-wrapper" v-show="type">
      <div class="btn-list-wrapper">
        <div class="btn-item">
          <img v-if="micStatus" :src="btnIcon.micOn" @click="closeMic" alt="">
          <img v-else :src="btnIcon.micOff" @click="openMic" alt="">
          <span>{{micStatus ? '关闭音频' : '开启音频'}}</span>
        </div>
        <div class="btn-item">
          <img v-if="cameraStatus" :src="btnIcon.cameraOn" @click="closeCamera" alt="">
          <img v-else :src="btnIcon.cameraOff" @click="openCamera" alt="">
          <span>{{cameraStatus ? '关闭视频' : '开启视频'}}</span>
        </div>
        <div class="btn-item">
          <img v-if="shareStatus" :src="btnIcon.shareOn" @click="closeScreenShare" alt="">
          <img v-else :src="btnIcon.shareOff" @click="createScreenShare" alt="">
          <span>{{shareStatus ? '停止分享' : '分享屏幕'}}</span>
        </div>
        <div class="btn-item">
          <img v-if="playerStatus" :src="btnIcon.playerOn" @click="leaveRoom" alt="">
          <img v-else :src="btnIcon.playerOff" @click="createClient" alt="">
          <span>{{playerStatus ? '停止直播' : '开始直播'}}</span>
        </div>
      </div>
      <!--<p class="tip">技术支持：知服宝</p>-->
    </div>
    <div v-show="(type && !client) || (!type && !currentBroadCastStats)" class="stop-wrapper">
      <div class="content">
        <img :src="personIcon" alt="头像">
      </div>
    </div>
  </div>
</template>

<script>
// 导入sdk
import axios from 'axios'
import TRTC from 'trtc-js-sdk'

import personIcon from '../../../assets/img/person.png'

import micOn from '../../../assets/img/big-mic-on.png'
import micOff from '../../../assets/img/big-mic-off.png'

import cameraOn from '../../../assets/img/big-camera-on.png'
import cameraOff from '../../../assets/img/big-camera-off.png'

import shareOn from '../../../assets/img/big-share-on.png'
import shareOff from '../../../assets/img/big-share-off.png'

import playerOn from '../../../assets/img/big-player-on.png'
import playerOff from '../../../assets/img/big-player-off.png'

var LibGenerateTestUserSig = require('../../../utils/lib-generate-test-usersig.min.js')

export default {
  name: 'RoomVideo',
  data () {
    return {
      userId: 'user_' + parseInt(Math.random() * 100000000), // 用户id --可更改
      roomId: 123, // 房间号--加入相同房间才能聊
      client: '', // 客户端服务
      remoteStream: '', // 远方播放流
      localStream: '', // 本地流
      screenStream: '', // 分享流
      btnIcon: {
        micOn,
        micOff,
        cameraOn,
        cameraOff,
        shareOn,
        shareOff,
        playerOn,
        playerOff
      },
      personIcon: personIcon,
      micStatus: false,
      cameraStatus: false,
      shareStatus: false,
      playerStatus: false,
      type: null,
      currentBroadCastStats: false,
      userSigConfig: {
        sdkAppId: '',
        userSig: ''
      },
      loading: false
    }
  },
  mounted () {
    this.type = this.$route.query.type
    this.getUserSig(this.userId)
  },
  methods: {
    // 创建链接
    createClient () {
      if (this.shareStatus && this.screeStream) {
        alert('请先关闭分享，再打开')
        return
      }
      if (this.type) {
        this.cameraStatus = true
        this.micStatus = true
      }
      this.shareStatus = false
      this.playerStatus = true
      // 获取签名
      const userId = this.userId

      const sdkAppId = this.userSigConfig.sdkAppId
      const userSig = this.userSigConfig.userSig

      // const config = this.genTestUserSig(userId)
      // const sdkAppId = config.sdkAppId
      // const userSig = config.userSig

      this.client = TRTC.createClient({
        mode: 'videoCall',
        sdkAppId,
        userId,
        userSig
      })
      // 注册远程监听，要放在加入房间前--这里用了发布订阅模式
      this.subscribeStream(this.client)
      // 初始化后才能加入房间
      this.joinRoom()
    },

    // 加入房间
    joinRoom () {
      this.playerStatus = true
      this.client.join({roomId: this.roomId})
        .catch(error => {
          console.error('进房失败 ' + error)
        })
        .then(() => {
          console.log('进房成功')
          // 创建本地流
          this.createStream(this.userId)
          // 播放远端流
          this.playStream(this.client)
        })
    },

    // 创建本地音视频流
    createStream (userId) {
      let audio = true
      let video = false
      if (this.type) {
        audio = true
        video = true
      }
      const localStream = TRTC.createStream({userId, audio, video})
      this.localStream = localStream

      localStream
        .initialize()
        .catch(error => {
          console.error('初始化本地流失败 ' + error)
        })
        .then(() => {
          console.log('初始化本地流成功')
          // 创建好后才能播放 本地流播放 local_stream 是div的id
          localStream.play('local_stream')
          // 创建好后才能发布
          this.publishStream(localStream, this.client)
        })
    },

    // 发布屏幕分享
    createScreenShare () {
      if (!this.client) {
        alert('还没有开始直播，请先开始直播！')
        return
      }
      this.localStream.close()
      this.shareStatus = true
      this.playerStatus = false
      // 取消发布
      this.client.unpublish(this.localStream).then(() => {
        // 取消发布本地流成功
        console.log('取消发布本地流成功')
      })
      // 创建屏幕分享流

      this.micStatus = true
      this.cameraStatus = true
      this.screeStream = TRTC.createStream({audio: true, screen: true})
      // 监听屏幕分享停止事件
      this.screeStream.on('screen-sharing-stopped', event => {
        console.log('screen sharing was stopped')
      })

      // 初始化屏幕分享流
      this.screeStream.initialize().then(() => {
        console.log('screencast stream init success')
        // 发布屏幕分享流
        this.screeStream.play('local_stream')
        this.publishStream(this.screeStream, this.client)

        this.client.publish(this.screeStream).then(() => {
          console.log('screen casting')
        }).catch((e) => {
          console.log('屏幕分享失败:', e)
        })
      })
    },

    // 关闭屏幕分享
    closeScreenShare () {
      // 取消发布
      this.leaveRoom()
      this.shareStatus = false
    },

    // 关闭音频
    closeMic () {
      if (!this.client) {
        alert('还没有开始直播，请先开始直播！')
        return
      }
      if (this.playerStatus && this.localStream) {
        this.localStream.muteAudio()
      }

      if (this.shareStatus && this.screeStream) {
        this.screeStream.muteAudio()
      }
      this.micStatus = false
    },

    // 打开音频
    openMic () {
      if (!this.client) {
        alert('还没有开始直播，请先开始直播！')
        return
      }
      if (this.playerStatus && this.localStream) {
        this.localStream.unmuteAudio()
      }
      if (this.shareStatus && this.screeStream) {
        this.screeStream.unmuteAudio()
      }
      this.micStatus = true
    },

    // 关闭视频
    closeCamera () {
      if (!this.client) {
        alert('还没有开始直播，请先开始直播！')
        return
      }
      if (this.playerStatus && this.localStream) {
        this.localStream.muteVideo()
      }

      if (this.shareStatus && this.screeStream) {
        this.screeStream.muteVideo()
      }
      this.cameraStatus = false
    },

    // 打开视频
    openCamera () {
      if (!this.client) {
        alert('还没有开始直播，请先开始直播！')
        return
      }
      if (this.playerStatus && this.localStream) {
        this.localStream.unmuteVideo()
      }
      if (this.shareStatus && this.screeStream) {
        this.screeStream.unmuteVideo()
      }
      this.cameraStatus = true
    },

    // 发布本地音视频流
    publishStream (localStream, client) {
      client
        .publish(localStream)
        .catch(error => {
          console.error('本地流发布失败 ' + error)
        })
        .then(() => {
          console.log('本地流发布成功')
          if (!this.type) {
            localStream.muteAudio()
            localStream.muteVideo()
          }
        })
    },

    // 订阅远端流--加入房间之前
    subscribeStream (client) {
      client.on('stream-added', event => {
        const remoteStream = event.stream

        remoteStream.on('player-state-changed', event => {
          if (event.state === 'PLAYING') {
            this.currentBroadCastStats = true
          } else {
            this.currentBroadCastStats = false
          }
          console.log(`远端流监控：${event.type} player is ${event.state} because of ${event.reason}`)
        })

        console.log('远端流增加: ' + remoteStream.getId())
        // 订阅远端流
        client.subscribe(remoteStream).then(() => {
          console.log('测试')
        })
      })
    },

    // 播放远端流
    playStream (client) {
      client.on('stream-subscribed', event => {
        const Stream = event.stream
        console.log('远端流订阅成功：' + Stream.getId())
        // 创建远端流标签，因为id是动态的，所以动态创建，用了v-html
        this.remoteStream = `<view id="${'remote_stream-' + Stream.getId()}"  ></view>`
        // 做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
        this.$nextTick(() => {
          // 播放
          Stream.play('remote_stream-' + Stream.getId()).then(() => {
            console.log('播放订阅端流成功！')
          }).catch((e) => {
            const errorCode = e.getCode()
            console.log('播放订阅端流失败：', e, errorCode)
            if (errorCode === 0x4043) {
              Stream.resume()
            }
          })
        })
      })
    },

    // 退出音视频
    leaveRoom () {
      this.shareStatus = false
      this.playerStatus = false
      this.client
        .leave()
        .then(() => {
          console.log('退房成功')
          // 停止本地流，关闭本地流内部的音视频播放器
          // 关闭本地流，释放摄像头和麦克风访问权限

          if (this.localStream) {
            this.localStream.stop()
            this.localStream.close()
            this.localStream = null
          }

          if (this.screeStream) {
            this.screeStream.stop()
            this.screeStream.close()
            this.screeStream = null
          }
          this.client = null
          // 退房成功，可再次调用client.join重新进房开启新的通话。
        })
        .catch(error => {
          console.error('退房失败 ' + error)
          // 错误不可恢复，需要刷新页面。
        })
    },

    // 获取用户签名--前端测试用
    genTestUserSig (userID) {
      /**
       * 腾讯云 SDKAppId，需要替换为您自己账号下的 SDKAppId。
       *
       * 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav ) 创建应用，即可看到 SDKAppId，
       * 它是腾讯云用于区分客户的唯一标识。
       */
      const SDKAPPID = 1400338943
      /**
       * 签名过期时间，建议不要设置的过短
       * <p>
       * 时间单位：秒
       * 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
       */
      const EXPIRETIME = 604800
      /**
       * 计算签名用的加密密钥，获取步骤如下：
       *
       * step1. 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav )，如果还没有应用就创建一个，
       * step2. 单击“应用配置”进入基础配置页面，并进一步找到“帐号体系集成”部分。
       * step3. 点击“查看密钥”按钮，就可以看到计算 UserSig 使用的加密的密钥了，请将其拷贝并复制到如下的变量中
       *
       * 注意：该方案仅适用于调试Demo，正式上线前请将 UserSig 计算代码和密钥迁移到您的后台服务器上，以避免加密密钥泄露导致的流量盗用。
       * 文档：https://cloud.tencent.com/document/product/647/17275#Server
       */
      const SECRETKEY = '2d69c33941d0a74fe5ea76e97f80e493d7e799968a9c2ea1d7f299d82cf74836'

      // a soft reminder to guide developer to configure sdkAppId/secretKey
      if (SDKAPPID === '' || SECRETKEY === '') {
        alert(
          '请先配置好您的账号信息： SDKAPPID 及 SECRETKEY ' +
          '\r\n\r\nPlease configure your SDKAPPID/SECRETKEY in js/debug/GenerateTestUserSig.js'
        )
      }
      const generator = new LibGenerateTestUserSig.LibGenerateTestUserSig(SDKAPPID, SECRETKEY, EXPIRETIME)
      const userSig = generator.genTestUserSig(userID)

      return {
        sdkAppId: SDKAPPID,
        userSig: userSig
      }
    },

    // 获取正式用户签名
    getUserSig (userID) {
      this.loading = true
      axios.post('https://api1.leading-c.cn/mol/v1/appx/live/getTencentApiInfo.do?userId=' + userID).then((response) => {
        const res = response.data
        console.log(res)
        this.userSigConfig = res
        if (!this.type) {
          this.createClient()
        }
      }).catch(function (error) {
        console.log(error)
      }).finally(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style scoped lang="less">
  .video-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    .distant-stream {
      width: 100%;
      height: 100%;
    }
    .local-stream {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
    }
    .btn-wrapper {
      width: 100%;
      height: 80px;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 3;
      background-color: #EEEEEE;
      .btn-list-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        .btn-item {
          flex: 1;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 100px;
          margin: 0 20px;
          cursor: pointer;
          img {
            width: 40px;
            height: 38px;
          }
          span{
            font-size:14px;
            font-weight:400;
            color:rgba(0,0,0,1);
            margin-left: 20px;
          }
          &:first-child{
            img {
              width: 31px;
              height: 40px;
            }
          }
        }
      }
      p.tip {
        text-align: center;
      }
    }
    .stop-wrapper{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      background-color: white;
      justify-content: center;
      align-items: center;
      z-index: 2;
      .content{
        width: 100px;
        height: 100px;
        border-radius: 200px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>

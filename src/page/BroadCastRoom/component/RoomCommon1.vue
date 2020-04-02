<template>
  <div class="video-wrapper">
    <div id='local_stream' class="local-stream">
      <!--<div class="prism-player" id="J_prismPlayer1"></div>-->
      <!--<div class="prism-player" id="J_prismPlayer2"></div>-->
      <video webkit-playsinline playsinline x5-playsinline="" x-webkit-airplay="allow" class="vdo" controls="controls" src="http://api2.leading-c.cn/live/1400330338_123_user_234_main.m3u8" autoplay="autoplay" id="video1"></video>
      <video webkit-playsinline playsinline x5-playsinline="" x-webkit-airplay="allow" class="vdo" controls="controls" src="http://api2.leading-c.cn/live/1400330338_123_user_123_main.m3u8" autoplay="autoplay" id="video2"></video>
    </div>
    <div v-show="false" class="stop-wrapper">
      <div class="content">
        <img :src="personIcon" alt="头像">
      </div>
    </div>
  </div>
</template>

<script>
import personIcon from '../../../assets/img/person.png'
export default {
  name: 'RoomVideo',
  data () {
    return {
      personIcon: personIcon
    }
  },
  mounted () {
    // new Aliplayer({
    //   id: 'J_prismPlayer1', // 容器id
    //   source: 'http://api2.leading-c.cn/live/1400330338_123_user_234_main.flv',
    //   cover: 'http://cdn.img.mtedu.com/images/assignment/day_3.jpg',
    //   width: '100%',
    //   height: '50%',
    //   autoplay: true,
    //   preload: false,
    //   isLive: false
    // })
    this.initPlayer1()
    this.initPlayer2()
  },
  methods: {
    initPlayer1 () {
      new Aliplayer({
        id: 'J_prismPlayer1', // 容器id
        source: 'http://api2.leading-c.cn/live/1400330338_123_user_234_main.flv',
        cover: 'http://cdn.img.mtedu.com/images/assignment/day_3.jpg',
        width: '100%',
        height: '50%',
        autoplay: true,
        preload: false,
        isLive: false
      })
    },
    initPlayer2 () {
      new Aliplayer({
        id: 'J_prismPlayer2', // 容器id
        source: 'http://api2.leading-c.cn/live/1400330338_123_user_123_main.flv',
        cover: 'http://cdn.img.mtedu.com/images/assignment/day_3.jpg',
        width: '100%',
        height: '50%',
        autoplay: true,
        preload: false,
        isLive: false
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
    .local-stream {
      width: 100%;
      height: 100%;
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

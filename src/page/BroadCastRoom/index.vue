<template>
  <div class="room-wrapper">
    <div class="room-top-wrapper">
      <span>HR易【刘秀银】视频直播间</span>
      <span>直播人数：{{currentNum}}</span>
    </div>
    <div class="room-bottom-wrapper">
      <div class="room-video-wrapper">
        <RoomVideo
          v-if="!type"
          @handleUpdateCurrentPersonNum="handleUpdateCurrentPersonNum"
        />
        <RoomCommon
          v-if="type"
        />
      </div>
      <div class="room-comment-wrapper">
        <RoomComment />
      </div>
    </div>
    <div class="root-footer-wrapper">
      技术支持：知服宝
    </div>
  </div>
</template>

<script>
import RoomComment from './component/RoomComment'
import RoomVideo from './component/RoomVideo'
import RoomCommon from './component/RoomCommon'
export default {
  name: 'BroadCastRoom',
  components: {
    RoomVideo,
    RoomComment,
    RoomCommon
  },
  data () {
    return {
      currentNum: 0,
      type: null
    }
  },
  mounted () {
    this.type = this.$route.query.type
  },
  methods: {
    /**
     * 当前的人数
     * /usr/local/51wenyi/data/upload/mol
     */
    handleUpdateCurrentPersonNum (val) {
      this.currentNum = val
    }
  }
}
</script>

<style scoped lang="less">
  .room-wrapper{
    width: 100%;
    height: 100%;
    background-color: #f1f2f4;
    overflow: auto;
    min-width: 1000px;
    min-height: 800px;
    display: flex;
    flex-direction: column;
    .room-top-wrapper{
      width: 100%;
      height: 60px;
      background-color: #78808B;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      box-sizing: border-box;
      padding: 0 20px;
      font-size: 14px;
      color: white;
    }
    .room-bottom-wrapper{
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .room-video-wrapper{
        flex: 1;
        height: 100%;
        background-color: white;
      }
      .room-comment-wrapper{
        width: 300px;
        height: 100%;
        background-color: white;
        margin-left: 20px;
      }
    }
    .root-footer-wrapper{
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999999;
      font-size: 13px;
    }
  }
</style>

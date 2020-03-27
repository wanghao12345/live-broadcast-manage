<template>
  <div class="room-wrapper">
    <div class="room-top-wrapper">【测试】视频直播间</div>
    <div class="room-bottom-wrapper">
      <div class="room-video-wrapper">
        <RoomVideo />
      </div>
      <div class="room-comment-wrapper">
        <RoomComment />
      </div>
    </div>
  </div>
</template>

<script>
import RoomComment from './component/RoomComment'
import RoomVideo from './component/RoomVideo'
export default {
  name: 'BroadCastRoom',
  components: {
    RoomVideo,
    RoomComment
  }
}
</script>

<style scoped lang="less">
  .room-wrapper{
    width: 100%;
    height: 100%;
    background-color: #f1f2f4;
    overflow: auto;
    min-width: 1200px;
    .room-top-wrapper{
      width: 100%;
      height: 50px;
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .room-bottom-wrapper{
      width: 1200px;
      height: 600px;
      margin: 20px auto;
      display: flex;
      justify-content: space-between;
      .room-video-wrapper{
        width: 850px;
        height: 100%;
        background-color: white;
      }
      .room-comment-wrapper{
        flex: 1;
        height: 100%;
        background-color: white;
        margin-left: 20px;
      }
    }
  }
</style>

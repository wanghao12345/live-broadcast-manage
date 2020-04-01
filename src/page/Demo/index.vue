<template>
  <div class="demo-wrapper">
    <video webkit-playsinline playsinline x5-playsinline="" x-webkit-airplay="allow" class="vdo" controls="controls" src="http://api2.leading-c.cn/live/1400330338_123_user_123_main.m3u8" autoplay="autoplay" id="video"></video>
  </div>
</template>

<script>
export default {
  name: 'Demo'
}
</script>

<style scoped lang="less">
  .demo-wrapper{
    width: 300px;
    height: 300px;
    video{
      width: 100%;
      height: 100%;
    }
  }
</style>

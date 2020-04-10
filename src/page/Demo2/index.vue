<template>
  <div class="prism-player" id="J_prismPlayer"></div>
</template>

<script>
export default {
  name: 'Demo2',
  mounted () {
    new Aliplayer({
      id: 'J_prismPlayer', // 容器id
      source: 'http://api2.leading-c.cn/live/1400330338_123_user_123_main.m3u8',
      cover: 'http://cdn.img.mtedu.com/images/assignment/day_3.jpg',
      width: '100%',
      height: '400px',
      autoplay: true,
      preload: false,
      isLive: false
    })
  }
}
</script>

<style scoped lang="less">

</style>

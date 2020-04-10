<template>
<div>
    <div>用户端</div>
    <video id="videoElement" style="height:4rem;"></video>
</div>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
    mounted() {
         if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            "isLive": true,
            url: 'http://api2.leading-c.cn/live/A26389DDCCECE338E05011AC02006E9C.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
    },
}

</script>



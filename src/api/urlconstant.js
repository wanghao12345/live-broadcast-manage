let host = location.host;
let api,WEBAPI;

WEBAPI = 'https://api1.leading-c.cn/'
api = 'https://api1.leading-c.cn/mol/appx/'

let protocolStr = document.location.protocol;
module.exports = {
  host:location.host,
  href:location.href,
  protocol:location.protocol,
  //websocket
  WEBSOCKET: `${protocolStr == 'https:' ? 'wss' : 'ws'}://${WEBAPI.split('//')[1]}`,
  LIVE: {
    GETCOURSELIVECOMMENT: WEBAPI + '/mol/v1/appx/live/getCourseLiveComment.do', //获取直播间评论信息
    SETCOMMENTWALL: WEBAPI + '/mol/v1/appx/live/setCommentOnTheWall.do', //修改上墙的评论其状态为已上墙
    ADDLIVECONTENT: WEBAPI + '/mol/v1/appx/live/addLiveRoomContent.do', //添加直播内容
    ADDCOURSECOMMENT: WEBAPI + '/mol/v1/appx/live/addCourseComment.do', //新增评论
    
  }
}
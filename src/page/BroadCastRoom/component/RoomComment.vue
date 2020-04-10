<template>
  <div class="comment-wrapper">
    <!-- 评论模块 -->
    <div class="comment">
      <div class="mian" v-for="item in commentArr">
        <img :src="item.headImgUrl" alt="" class="img" />
        <!-- <span class="img"></span> -->
        <div class="conten" style="line-height:25px">
          <div>{{ item.createrName }}</div>
          <div>{{ item.cocCreateTime }}</div>
          <div style="padding:2px">{{ item.cocContent }}</div>
        </div>
        <span class="btn" v-if="item.isOnTheWall == 0" @click="onWallBtn(item)"
          >上墙</span
        >
        <span class="btn1" v-else>已上墙</span>
      </div>
      <div class="more" @click="pagerNumAdd" v-if="commentTotal != 0">
        {{
          commentParam.pager.pageNumber < commentPageCount
            ? "点击加载更多"
            : "我也是有底线的"
        }}
      </div>
      <div class="more" v-else>-暂无评论-</div>
    </div>
    <div class="footer">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入讨论内容"
        v-model="commentVal"
        ref="xtextarea"
      >
      </el-input>
      <span @click="sendCommentMsg">发送</span>
    </div>
  </div>
</template>

<script>
var common = require("../../../api/http.js");
var CONSTANT = require("../../../api/urlconstant.js");
export default {
  name: "RoomComment",
  data() {
    return {
      clId: "",
      commentArr: [],
      commentPageCount: "",
      commentTotal: "",
      commentVal: "",
      realOnlineNum: 100,
      commentParam: {
        clId: "",
        pager: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      param: {
        userId: ""
      }
    };
  },
  mounted() {
    var sss = $(document.body).height()
    $('.comment-wrapper').height($(document.body).height())
    console.log(sss);
    
    const { currAccountId, liveId } = this.$route.params;

    this.param.userId = currAccountId;
    this.clId = liveId;
    console.log("aaaa");

    this.getLiveComment();
    this.websocketLine();
  },
  methods: {
    // 加载更多
    pagerNumAdd() {
      // if (this.loadingState) return;
      this.commentParam.pager.pageNumber++;
      this.getLiveComment();
    },
    // 上墙
    onWallBtn(item) {
      let id = item.cocId;
      let that = this;
      // this.$vux.confirm.show({
      //   content: "是否确认上墙",
      //   onCancel() {},
      //   onConfirm() {
      let url = `${CONSTANT.LIVE.SETCOMMENTWALL}?cocId=${id}`;
      common.postAjax(
        url,
        {},
        res => {
          if (!res.data.status) {
            that.commentArr.forEach(item => {
              if (item.cocId == id) {
                item.isOnTheWall = 1;
              }
            });
            that.addParam = {
              commentId: item.cocId,
              commentCreater: item.cocCreater,
              ccCreateBy: that.param.userId, //创建人
              chatContent: item.cocContent, //聊天内容
              clId: that.clId, //直播课程ID
              contentType: 0, //聊天内容类型（0文字1语音2图片）
              isComment: 1, //是否为评论：0否1是
              isReward: 0 //是否为打赏消息：0否1是
            };
            that.sendMsgInfo(that.addParam, id);
          }
        },
        res => {
          console.log(res, "error");
        }
      );
      // }
      // });
      // return;
    },
    sendMsgInfo(param, id) {
      let url = CONSTANT.LIVE.ADDLIVECONTENT;
      common.postAjax(
        url,
        param,
        res => {
          if (!res.data.status) {
            res.data.isPlay = false;
            // this.liveInfoArr.push(res.data);
            // this.inputVal = "";

            let objParam = {
              type: "msg",
              data: res.data
            };
            if (res.data.ccVoice_name) {
              // this.voiceState = "start";
              this.localId = "";
              // this.voiceSeconds = 60;
            }
            this.Cwebsock.send(JSON.stringify(objParam));
            if (res.data.isComment == 1) {
              let objParam1 = {
                type: "isWall",
                data: id
              };
              this.Cwebsock.send(JSON.stringify(objParam1));
            }
          }
        },
        res => {
          this.sendState = false;
          this.voiceSendState = false;
          // this.$vux.loading.hide();
          console.log(res, "error");
        }
      );
    },
    //发送评论
    sendCommentMsg() {
      console.log("aaa");

      let param = {
        clId: this.clId,
        cocContent: common.utf16toEntities(this.commentVal),
        cocCreater: this.param.userId
      };
      let url = CONSTANT.LIVE.ADDCOURSECOMMENT;
      common.postAjax(
        url,
        param,
        res => {
          if (!res.data.status) {
            this.commentArr.unshift(res.data);
            this.commentVal = "";
            let objParam = {
              type: "comment",
              data: res.data
            };
            // setTimeout(() => {
            //   this.$refs.xtextarea.updateAutosize();
            // }, 50);
            this.Cwebsock.send(JSON.stringify(objParam));
          }
        },
        res => {
          console.log(res, "error");
        }
      );
    },
    //获取用户评论
    getLiveComment() {
      this.commentParam.clId = this.clId;
      let url = CONSTANT.LIVE.GETCOURSELIVECOMMENT;
      common.postAjax(
        url,
        this.commentParam,
        res => {
          if (!res.data.status) {
            res.data.liveComment.forEach(item => {
              item.menuState = false;
            });
            this.commentArr = this.commentArr.concat(res.data.liveComment);
            this.commentPageCount = res.data.pager.pageCount;
            this.commentTotal = res.data.pager.totalCount;
          }
        },
        res => {
          console.log(res, "error");
        }
      );
    },
    //websocket连接
    websocketLine() {
      //判断当前浏览器是否支持WebSocket
      // CONSTANT.URL.WEBSOCKET :9090
      let protocolStr = document.location.protocol;
      // let url =  CONSTANT.URL.CONSULTROOM.CONSULTROOMDETAIL.split('/mol')[0];
      var ws_uri = `${CONSTANT.WEBSOCKET}/mol/app/socketServer.do?roomId=${this.clId}&userId=${this.param.userId}`;
      // var Cwebsock =new ReconnectingWebSocket(ws_uri);
      // var Cwebsock =new WebSocket(ws_uri);
      this.Cwebsock = new WebSocket(ws_uri);

      //连接发生错误的回调方法
      this.Cwebsock.onerror = this.CwebsockError;
      //连接成功建立的回调方法
      this.Cwebsock.onopen = this.CwebsockonOpen;
      //接收到消息的回调方法
      this.Cwebsock.onmessage = this.CwebsockMessage;
      //连接关闭的回调方法
      this.Cwebsock.onclose = this.CwebsockClose;
      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      this.Cwebsock.onbeforeunload = function() {};
    },
    //连接发生错误的回调方法
    CwebsockError(e) {
      console.log(e, this.Cwebsock, "ERROR");
      let readyState = this.Cwebsock.readyState;
      if (readyState == 2 || readyState == 3) {
        setTimeout(() => {
          this.websocketLine();
        }, 500);
      }
    },
    //连接发生错误的回调方法
    CwebsockError(e) {
      console.log(e, this.Cwebsock, "ERROR");
      let readyState = this.Cwebsock.readyState;
      if (readyState == 2 || readyState == 3) {
        setTimeout(() => {
          this.websocketLine();
        }, 500);
      }
    },
    //连接成功建立的回调方法
    CwebsockonOpen(e) {
      console.log(e, "SUCCESS");
    },
    //接收到消息的回调方法
    CwebsockMessage(e) {
      console.log("111111");
      if (e.data == "你链接成功了") return;
      let obj = JSON.parse(e.data);

      console.log(obj);
      switch (obj.type) {
        case "comment":
          this.commentArr.unshift(obj.data);
          break;
        case "updateWachers":
          this.realOnlineNum = obj.data + 100;
           this.$emit('handleUpdateCurrentPersonNum', this.realOnlineNum)
          break;

        case "isWall":
          this.commentArr.forEach(item => {
            if (item.cocId == obj.data) {
              item.isOnTheWall = 1;
            }
          });
          break;
        // case "back":
        //   this.liveInfoArr.map((item, index) => {
        //     if (item.ccId == obj.data) {
        //       this.liveInfoArr.splice(index, 1);
        //     }
        //   });
        //   break;
        // case "commmentDelete":
        // this.commentArr.map((item, index) => {
        //   if (item.cocId == obj.data) {
        //     this.commentArr.splice(index, 1);
        //   }
        // });
        // break;
      }
    },
    //连接关闭的回调方法
    CwebsockClose(e) {},
    //离开当前页面后执行
    destroyed: function() {
      document
        .getElementById("app")
        .removeEventListener("touchmove", this.handle, false);
      this.Cwebsock.close();
      clearInterval(this.intervalTimer);
      wx.stopVoice({
        localId: this.localId // 需要停止的音频的本地ID，由stopRecord接口获得
      });
      $("#audioRef").attr("src", "");
    }
  }
};
</script>

<style lang="less" scoped>
.comment-wrapper {
  width: 300px;
  background-color: white;
  margin-left: 20px;
  box-sizing: border-box;
  // width: 100%;
  height: 100%;
  position: relative;
  .comment {
    overflow: auto;
    width: 100%;
    height: 100%;
    min-height: 255px;
    padding: 0 10px;
    box-sizing: border-box;
    padding-bottom: 100px;
    .mian {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      .img {
        width: 50px;
        height: 50px;
        border-radius: 50px;
        margin-right: 10px;
      }
      .btn {
        padding: 2px 5px;
        border: 1px solid #22ac38;
        color: #22ac38;
        border-radius: 5px;
      }
      .btn1 {
        padding: 2px 5px;
        border: 1px solid #999;
        color: #999;
        border-radius: 5px;
      }
      .conten {
        flex: 1;
      }
    }
    .more {
      text-align: center;
      color: #999;
    }
  }
  .footer {
    position: absolute;
    width: 283px;
    left: 0;
    bottom: 0;
    height: 70px;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    span {
      margin: 4px;
      border-radius: 4px;
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      background-color: #22ac38;
    }
  }
}
</style>

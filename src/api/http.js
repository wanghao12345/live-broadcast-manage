//公共方法
var Vue = require('vue');
var axios = require('axios');
axios.defaults.withCredentials = true;

function postAjax(url,param,callBack,failBack=null) {
    axios.post(url, param)
    .then(function (response) {
        callBack(response);
    })
    .catch(function (error) {
        failBack(error);
    });
}

//聊天表情转换
function utf16toEntities(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g;
    // 检测utf16字符正则
    str = str.replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            H = char.charCodeAt(0);
            // 取出高位
            L = char.charCodeAt(1);
            // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
            // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
  }
module.exports = {
    postAjax,
    utf16toEntities
  }
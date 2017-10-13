/**
 * 工具js文件
 */

/**
 * 打印日志
 */
function printLog(log) {
  console.log("打印的日志为：");
  console.log(log);
}

/**
 * HTTP GET请求
 * @param 请求地址
 * @param 请求回调
 */
function httpGet(url, callBack) {
  wx.request({
    url: url,
    method: "GET",
    header: {
      "content-type": "application/xml"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) { },
  })
}

/**
 * 将影人列表转化成string 便于展现
 */
function convertToCastString(casts) {
  var result = "";
  for (var idx in casts) {
    result = result + casts[idx].name + " / ";
  }
  return result.substring(0, result.length - 2);
}

/**
 * 时间戳转化成时间
 * @param 时间戳
 * 1.当天的 几分钟前 几小时前
 * 2.一周以内的 几天前
 * 3.一周以外的 直接日期
 */
function convertToDate(time) {
  
  var result;
  var tempTime = parseInt(time) * 1000;
  var nowTime = new Date().getTime();
  var todayStart = this.getTodayStart();
  if (tempTime - todayStart >= 0) {
    //今天
    var timeSpace = nowTime-tempTime;
    if(timeSpace/3600000<1){
      //1小时之内
      result = parseInt(timeSpace / 60000)+"分钟前";
    } else if (timeSpace / 3600000 < 3){
      //3小时之内
      result = parseInt(timeSpace / 60/60/1000)+ "小时前";
    }else{
      result = new Date(tempTime).toLocaleTimeString();
    }
  } else if (todayStart - tempTime <= 24 * 3600 * 1000) {
    result = "昨天" ;
  } else if (todayStart - tempTime <= 2*24 * 3600 * 1000) {
    result = "前天";
  } else {
    // result = new Date(tempTime).toLocaleDateString();
    result = this.formatDate(tempTime, "MM月dd日");
  }
  return result;
}

/**
 * 获取当天的零点时间戳
 */
function getTodayStart() {
  var start = new Date();
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);
  return start.getTime();
}

/**
 * 格式化时间戳日期
 * @param 时间戳
 * @param 格式化模板  yyyy-MM-dd
 */
function formatDate(timeStamp,format) {
  var that = new Date(timeStamp);
  var date = {
    "M+": that.getMonth() + 1,
    "d+": that.getDate(),
    "h+": that.getHours(),
    "m+": that.getMinutes(),
    "s+": that.getSeconds(),
    "q+": Math.floor((that.getMonth() + 3) / 3),
    "S+": that.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (that.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}



/**
 * js外部引用必须要输出对象或方法 
 * 否则外部不可引用
 */
module.exports = {
  printLog: printLog,
  httpGet: httpGet,
  convertToCastString: convertToCastString,
  convertToDate: convertToDate,
  getTodayStart: getTodayStart,
  formatDate: formatDate
}
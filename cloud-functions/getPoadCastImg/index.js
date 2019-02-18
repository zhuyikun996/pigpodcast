// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { userInfo, podcastname } = event
  var img = ""
  if (podcastname == "dywx"){//得意忘形播客
    img ="https://dwz.cn/mb1sI4N3"
  } else if (podcastname == "gdg"){//郭德纲相声集
    img = "https://dwz.cn/5RB5wd9o"
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    img
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database()
const _ = db.command

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    try {
        return await db.collection('podCastArrayDB_history').where({
            _openid: wxContext.OPENID
        }).remove()
    } catch (e) {
        console.error(e)
    }
}
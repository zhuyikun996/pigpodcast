const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTimeForFriday = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}
const myFormatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
}

var myFormatSecondToHHMMSS = seconds => {
    var totalDuration = Math.ceil(seconds)
    var minuteTime = 0
    var secondTime = 0
    var hourTime = 0
    if (totalDuration >= 60) { //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(totalDuration / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(totalDuration % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    } else {
        secondTime = totalDuration;
    }
    return [hourTime, minuteTime, secondTime].map(formatNumber).join(':')
}

const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    //todate默认参数是当前日期，可以传入对应时间 todate格式为2018-10-05

function getWeeks(dates) {
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    let day = date.getDay();
    var week = show_day[day];
    return week;
}

module.exports = {
    formatTime: formatTime,
    myFormatTime: myFormatTime,
    myFormatSecondToHHMMSS: myFormatSecondToHHMMSS,
    getWeeks: getWeeks,
    formatTimeForFriday: formatTimeForFriday
}
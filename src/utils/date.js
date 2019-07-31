const datePlugin  = {
  format : (format) =>{
    var n = format;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var h = date.getHours();
    //分
    var m = date.getMinutes();
    //秒
    var s = date.getSeconds();
    return Y +'-' + M + '-' +D  ;
  },
  getBirthdayFromIdCard : (idCard) => {
    var birthday = "";
    if (idCard != null && idCard != "") {
      if (idCard.length == 15) {
        birthday = "19" + idCard.substr(6, 6);
      } else if (idCard.length == 18) {
        birthday = idCard.substr(6, 8);
      }

      birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    }

    return birthday;
  },
  getSexForIdCard: (idCard) => {
    if (parseInt(idCard.substr(16, 1)) % 2 == 1) {
      return '男'
    } else {
      return '女'
    }
  },
  getWeek :(dateString) => {
    let date;
    let dateArray = dateString.split("-");
    date = new Date(dateArray[0], Number(dateArray[1]) - 1, dateArray[2]);
    return "星期" + "日一二三四五六".charAt(date.getDay());
  },
  getMinutesFromSecond : (s) => {
    var t = '';
    if (s > -1) {
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (min < 10) { t += "0"; }
      t += min + ":";
      if (sec < 10) { t += "0"; }
      t += sec.toFixed(0);
    }
    return t;
  },
  compare : (d1, d2) => {
    d1 = d1.replace(/\-/gi, "/");
    d2 = d2.replace(/\-/gi, "/");
    let time1 = new Date(d1).getTime();
    let time2 = new Date(d2).getTime();
    if (time1 > time2) {
      return 1;
    } else if (time1 == time2) {
      return 0;
    } else {
      return -1;
    }
  },
  getPreMonth : (date) => {
    let arr = date.split('-');
    let year = arr[0]; //获取当前日期的年份
    let month = arr[1]; //获取当前日期的月份
    let year2 = year;
    let month2 = parseInt(month) - 1;
    if (month2 == 0) {
      year2 = parseInt(year2) - 1;
      month2 = 12;
    }
    let month2Str = month2.toString();
    if (month2 < 10) {
      month2Str = '0' + month2;
    }
    let t2 = year2 + '-' + month2Str;
    return t2;
  },
  /**
   * 获取下一个月
   *
   * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
   */
  getNextMonth : (date) => {
    let arr = date.split('-');
    let year = arr[0]; //获取当前日期的年份
    let month = arr[1]; //获取当前日期的月份
    let year2 = year;
    let month2 = parseInt(month) + 1;
    if (month2 == 13) {
      year2 = parseInt(year2) + 1;
      month2 = 1;
    }
    let month2Str = month2.toString();
    if (month2 < 10) {
      month2Str = '0' + month2;
    }

    let t2 = year2 + '-' + month2Str;
    return t2;
  },
  getWeekStr :(num) => {
    var transWeek = {
      1: '一',
      2: '二',
      3: '三',
      4: '四',
      5: '五',
      6: '六',
      7: '日'
    };
    return '星期' + transWeek[num];
  },
  formatWithPatternDate : function (format, date) {
    if (!date)
      return null;
    var look = function (m) { // Check whether a format character is doubled
        var n = 0;
        while (i + 1 < format.length && format.charAt(i + 1) === m) {
          n++;
          i++;
        }
        return n;
      },
      f1 = function (m, val, len) { // Format a number, with leading zero if necessary
        var n = '' + val;
        if (look(m)) {
          while (n.length < len) {
            n = '0' + n;
          }
        }
        return n;
      },
      i,
      output = '',
      literal = false;

    for (i = 0; i < format.length; i++) {
      if (literal) {
        if (format.charAt(i) === "'" && !look("'")) {
          literal = false;
        } else {
          output += format.charAt(i);
        }
      } else {
        switch (format.charAt(i)) {
          case 'd':
            output += f1('d', date.getDate(), 2);
            break;
          case 'o':
            output += f1('o', (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3);
            break;
          case 'm':
            output += f1('m', date.getMonth() + 1, 2);
            break;
          case 'y':
            output += (look('y') ? date.getFullYear() : (date.getFullYear() % 100 < 10 ? '0' : '') + date.getFullYear() % 100);
            break;
          case 'h':
            var h = date.getHours();
            output += f1('h', (h > 12 ? (h - 12) : (h === 0 ? 12 : h)), 2);
            break;
          case 'H':
            output += f1('H', date.getHours(), 2);
            break;
          case 'i':
            output += f1('i', date.getMinutes(), 2);
            break;
          case 's':
            output += f1('s', date.getSeconds(), 2);
            break;
          case 'a':
            output += date.getHours() > 11 ? '下午' : '上午';
            break;
          case 'A':
            output += date.getHours() > 11 ? 'PM' : 'AM';
            break;
          case "'":
            if (look("'")) {
              output += "'";
            } else {
              literal = true;
            }
            break;
          default:
            output += format.charAt(i);
        }
      }
    }
    return output;
  },
  getAge : function (identityCard) {
    var len = (identityCard + "").length;
    if (len == 0) {
      return 0;
    } else {
      if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
      {
        return 0;
      }
    }
    var strBirthday = "";
    if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
    {
      strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
    }
    if (len == 15) {
      strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
    }
    //时间字符串里，必须是“/”
    var birthDate = new Date(strBirthday);
    var nowDateTime = new Date();
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
    //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  },
  getWeekDa : (num) => {
    let str = '';
    switch (num % 7) {
      case 0:
        str = "日";
        break;
      case 1:
        str = "一";
        break;
      case 2:
        str = "二";
        break;
      case 3:
        str = "三";
        break;
      case 4:
        str = "四";
        break;
      case 5:
        str = "五";
        break;
      case 6:
        str = "六";
        break;
    }
    return str;
  },
  getfutureDay : (num) => {
    var myDate = new Date(), day = myDate.getDate(), month = myDate.getMonth() + 1, year = myDate.getFullYear();

    let array1 = [1, 3, 5, 7, 8, 10, 12];
    let array2 = [4, 6, 9, 11];
    if (array1.indexOf(month)) {
      return num % 31 == 0 ? 31 : num % 31
    }
    if (array2.indexOf(month)) {
      return num % 30 == 0 ? 30 : num % 30
    }
    if (month === 2) {
      if (year / 4 == 0) {
        return num % 29 == 0 ? 29 : num % 29
      } else {
        return num % 28 == 0 ? 28 : num % 28
      }
    }
  },
  addDate : (days) =>  {
    var d = new Date(), day = d.getDate();
    d.setDate(day + days);
    var m = d.getMonth() + 1;
    let strM = m < 10 ? '0' + m : m;
    let strD = d.getDate() < 10 ? '0' + d.getDate() : d.getDate() ;
    return d.getFullYear() + '-' + strM + '-' + strD;
  },
  addDateNew : (date, days)=> {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    var m = d.getMonth() + 1;
    let strM = m < 10 ? '0' + m : m;
    return d.getFullYear() + '-' + strM ;
  },
  getWeekNum : () => {
    return new Date().getDay()
  },
  /**
   * 获取两个str日期的天数差
   * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
   */
  dateDiff: (s1, s2) => {
    let days = s1.getTime() - s2.getTime();
    let num = Math.floor(days / (1000 * 60 * 60 * 24)); // 向下取整
    return num
  }
}

export {
  datePlugin
} ;



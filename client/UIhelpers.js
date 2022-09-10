import {
  Meteor
} from 'meteor/meteor';
import moment from 'moment';
import 'moment/locale/id'
const numeral = require('numeral')

Template.registerHelper('formatRp', function (context, options) {
  if (context != 0) {
    return 'Rp ' + numeral(context).format('0,0');
  } else {
    return 'FREE';
  }
});

Template.registerHelper('formatRpInvoice', function (context, options) {
  if (context != 0) {
    return numeral(context).format('0,0');
  } else {
    return 'FREE';
  }
});

Template.registerHelper('formatDateIDN', function (date) {  
    return moment(date).format("LL")
})


Template.registerHelper('equalsInString', function (a, b) {
  return String(a) === String(b);
});

Template.registerHelper('concatString', function (text1, text2) {
  return text1 + text2;
});

Template.registerHelper('formatKm', function (context, options) {
  if (context)
    return numeral(context).format('0,0') + ' Km';
});

Template.registerHelper('formatQty', function (context, options) {
  if (context != 0) {
    return numeral(context).format('0,0');
  } else {
    return 0;
  }
});

Template.registerHelper('formatStripedDate', function (context, options) {
  if (context)
    return moment(context).format("DD - MM - YYYY");
});

// Template.registerHelper('dateFromISO', function(context, options) {
//   if(context){
//     const dateObject = new Date(context)
//     return dayjs(dateObject).locale('id').format('DD MMMM YYYY');
//   }
//   else{
//     return 'Tidak Ada Data'
//   }
// });

// Template.registerHelper('dateFromISO', function (context, options) {
//   if (context) {
//     const dateObject = new Date(context)
//     return dayjs(dateObject).locale('id').format('DD MMMM YYYY');
//   } else {
//     return 'Tidak Ada Data'
//   }
// });

// Template.registerHelper('formatHRDate', function (context, options) {
//   if (context && context.month && context.year) {
//     if (context.month) {
//       context.month = parseInt(context.month) - 1;
//     }
//     // let result = moment(context);
//     // return result.format("D MMMM YYYY");
//     let dateObject;
//     if (context.year !== "" && context.month !== "" &&
//       context.date && context.date !== "") {
//       dateObject = new Date(context.year, context.month, context.date);
//     }
//     if (dateObject) {
//       let result = dayjs(dateObject).locale('id').format('DD MMMM YYYY');
//       // console.log(result);
//       return result;
//     } else {
//       return "Tidak Ada Data";
//     }
//   } else if (context && typeof context === "object") {
//     return moment(context).format("DD MMM YYYY");
//   } else {
//     return "Tidak Ada Data"
//   }
// });

// Template.registerHelper('formatDateObject', function (context, options) {
//   if (context) {
//     let result = dayjs(context).locale('id').format('DD MMMM YYYY');
//     return result;
//   } else {
//     return "Tidak Ada Data";
//   }
// });

Template.registerHelper('formatWeekMonth', function (context, options) {
  if (context) {
    let start = moment(context).startOf('week').format('DD MMMM YYYY');
    let end = moment(context).endOf('week').format('DD MMMM YYYY');
    return start + ' - ' + end;
  } else {
    return "Tidak Ada Data";
  }
});

Template.registerHelper('formatDateHTML', function (context, options) {
  if (context)
    return moment(context).format("YYYY-MM-DD");
});

Template.registerHelper('formatDateTimeHTML', function (context, options) {
  if (context)
    return moment(context).format("YYYY-MM-DDTHH:mm");
});

Template.registerHelper('formatYear', function (context, options) {
  if (context)
    return moment(context).format("YYYY");
});

Template.registerHelper('formatHRDM', function (context, options) {
  if (context)
    return moment(context).format("MMM YYYY");
});

Template.registerHelper('formatNopol', function (context) {
  if (context) {
    return moment(context).format("MM - YY");
  } else {
    return "XX - XX";
  }
});

Template.registerHelper('formatThickness', function (context) {
  if (context) {
    return context + " mm";
  } else {
    return "-";
  }
});

// Template.registerHelper('formatHRDT', function (context, options) {
//   if (context)
//     // console.log(context)
//     // console.log(moment(context))
//     // return moment(context).format("DD MMM YYYY - HH:mm");
//     return dayjs(context).tz("Asia/Jakarta").locale('id').format('lll') + " WIB";
// });

// Template.registerHelper('formatHRDTD', function (context, options) {
//   if (context)
//     // console.log(context)
//     // console.log(moment(context))
//     // return dayjs(context).format("dddd | DD MMM YYYY - HH:mm");
//     return dayjs(context).tz("Asia/Jakarta").locale('id').format('LLLL') + " WIB";
// });

// Template.registerHelper('formatLocalDate', function (context, options) {
//   if (context)
//     // console.log(context)
//     // console.log(moment(context))
//     // return dayjs(context).format("dddd | DD MMM YYYY - HH:mm");
//     return dayjs(context).locale('id').format('LLLL');
// });

Template.registerHelper('formatDTShort', function (context, options) {
  if (context)
    return moment(context).format("D/MM/YY H:mm");
});

// Template.registerHelper('formatDateShort', function (context, options) {
//   if (context)
//     // return moment(context).format("D/MM/YY");
//     return dayjs(context).tz("Asia/Jakarta").locale('id').format('l');
// });

Template.registerHelper('formatTime', function (context, options) {
  if (context)
    return moment(context).format("hh:mm");
});

Template.registerHelper('toString', function (data) {
  if (data !== null) {
    return data.toString();
  } else {
    return '';
  }
});

// Template.registerHelper('uiCheckRole', function (pattern, extra) {
//   let loggedInUser = Meteor.user();
//   let roleArray = uiServerPatterns[pattern].slice()

//   if (pattern != 0) {
//     roleArray.push('admin');
//   }
//   roleArray.push('superadmin', 'romoParoki');

//   if (typeof extra !== 'undefined' && typeof extra === 'string') {
//     let extraRoles = extra.split(',');
//     extraRoles.forEach(function (data) {
//       roleArray.push(data.trim());
//     })
//   }

//   return Roles.userIsInRole(loggedInUser, roleArray);
// });

Template.registerHelper('equals', function (a, b, checkType) {
  // if(checkType == true){
  //   console.log("a " + a + " " + typeof a);
  //   console.log("b " + b + " " + typeof b);
  // }
  // console.log(a)
  // console.log(b)
  return a == b;
});

Template.registerHelper('greaterThan', function (a, b) {
  return a > b;
});

Template.registerHelper('subtract', function (a, b) {
  return parseInt(a) - parseInt(b);
});

Template.registerHelper('greaterThanEqual', function (a, b) {
  return parseInt(a) >= parseInt(b);
  // console.log(a)
  // console.log(b)
});

Template.registerHelper('lessThanEqual', function (a, b) {
  return parseInt(a) <= parseInt(b);
});

Template.registerHelper('percentOf', function (a, b) {
  if (a && b) {
    let perc = (parseInt(a) / parseInt(b)) * 100;
    return perc + " %";
  }
});

Template.registerHelper('lessThan', function (a, b) {
  return parseInt(a) < parseInt(b);
  // console.log(a)
  // console.log(b)
});

Template.registerHelper('notEqual', function (a, b) {
  return a != b;
});


Template.registerHelper('preventUndefined', function (value) {
  if (value == undefined) {
    return "";
  } else {
    return value;
  }
});

Template.registerHelper('getSex', function (value) {
  if (value === "m" || value === "L") {
    return "Pria";
  } else if (value === "f" || value === "P") {
    return "Wanita";
  } else {
    return '-';
  }
});

Template.registerHelper('formatDow', function (value) {
  if (value == 1) {
    return "Minggu";
  } else if (value == 2) {
    return "Senin";
  } else if (value == 3) {
    return "Selasa";
  } else if (value == 4) {
    return "Rabu";
  } else if (value == 5) {
    return "Kamis";
  } else if (value == 6) {
    return "Jumat";
  } else if (value == 7) {
    return "Sabtu";
  } else {
    return '-';
  }
});




Template.registerHelper('isNaN', function (value) {
  function isNumber(n) {
    return typeof n == 'number' && !isNaN(n - n);
  }
  return isNaN(parseInt(value));
});


Template.registerHelper('isBoolean', function (value) {
  if (value == true || value == false) {
    return true
  }
});

Template.registerHelper('getInvoiceStatus', function (value) {
  if (value == true) {
    return "Active"
  } else {
    return "Void"
  }
});

Template.registerHelper('getRequestStatus', function (value) {
  if (value == 10) {
    return "Draft"
  } else if (value === 70) {
    return "Approved"
  } else if (value === 80) {
    return "Completed"
  } else if (value === 90) {
    return "Rejected"
  }
});


Template.registerHelper('isSelf', function (user) {
  return Meteor.userId() === this.params._id;
});

Template.registerHelper('listNotEmpty', function (array) {
  return array.length > 1;
});


Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.registerHelper('decremented', function (index) {
  index--;
  return index;
});

Template.registerHelper('parsePhone', function (value) {
  if (value && !isNaN(value)) {
    const spaceRemoved = value.replace(/\s/g, '');
    if (!isNaN(spaceRemoved)) {
      return spaceRemoved;
    } else {
      return value;
    }
  }
});

// Template.registerHelper('formatHRDateShort', function (context, options) {
//   if (context && context.month && context.year) {
//     // console.log('ada month')
//     if (context.month) {
//       context.month = parseInt(context.month) - 1;
//     }
//     // let result = moment(context);
//     // return result.format("D MMMM YYYY");
//     let dateObject;
//     if (context.year !== "" && context.month !== "" &&
//       context.date && context.date !== "") {
//       dateObject = new Date(context.year, context.month, context.date);
//     }
//     if (dateObject) {
//       let result = dayjs(dateObject).locale('id').format('DD/MM/YY');
//       // console.log(result);
//       return result;
//     } else {
//       return "";
//     }
//   } else if (context && moment(context).isValid()) {
//     return moment(context).format("DD MMM YYYY");
//   } else {
//     return ""
//   }
// });


// Template.registerHelper('getUsername', function (value) {
//   if (value) {
//     Meteor.call('getUsername', function (error, result) {
//       if (error) {

//       } else {
//         return result.username;
//       }
//     })
//   } else {
//     return "Sine Username"
//   }
// });

Template.registerHelper('calculateAge', function (dob, sessionDate) {
  // console.log(sessionDate)
  if (dob && sessionDate) {
    const age = moment.duration(moment(sessionDate).diff(moment(dob)));
    return age.years() + " tahun " + age.months() + " bulan " + age.days() + " hari ";
  } else if (dob && !sessionDate) {
    sessionDate = new Date();
    const age = moment.duration(moment(sessionDate).diff(moment(dob)));
    return age.years() + " tahun " + age.months() + " bulan " + age.days() + " hari ";
  }
});


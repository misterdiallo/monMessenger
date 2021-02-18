var moment = require('moment');
moment.locale('fr');

function content(user, msg) {
    return {
        user,
        time: moment().format("ddd HH:mm"),
        msg
    }
}
module.exports = content;
var mongoose = require('mongoose');

var NotificationSchema = mongoose.Schema({
    notification_receiver: { type: mongoose.Schema.Types.ObjectId, unique: true },
    notification_list: {
        type: [{
            title: {
                type: String,
                require: true
            },
            message: {
                type: String,
                require: true
            },
            icon: {
                type: String,
                require: true
            },
            date: {
                type: String,
                default: new Date()
            }
        }],
        default: []
    }
}, {
    timestamps: true
});

var Notification = module.exports = mongoose.model('notifications', NotificationSchema);



module.exports.addNotif = function(notif, callback) {
    var query = { notification_receiver: notif.user }
    update = {
        $push: {
            notification_list: notif.notif
        }
    }
    options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    };

    // Find the document
    Notification.findOneAndUpdate(query, update, options, callback);
}


module.exports.removeNotif = function(notification, callback) {
    Notification.findOneAndDelete({
            _id: notification
        },
        (err, res) => {
            if (err)
                res.json({
                    success: false,
                    message: 'Notice not deleted!'
                });
            else
                res.json({
                    success: true,
                    message: 'Notice deleted!'
                });
        });
}


module.exports.getNoticesByID = function(id, callback) {
    Notice.find({
            _id: id
        }, (err, res) =>
        res.send(res.json())
    );
}
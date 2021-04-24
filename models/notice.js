var mongoose = require('mongoose');

function is_url(str)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }
}

var NoticeSchema = mongoose.Schema({
    notice_title: String,
    notice_content:{type: String, require:true},
    notice_links:[String]
},
{timestamps: true}
);

var Notice = module.exports = mongoose.model('Notices',NoticeSchema);

module.exports.addNotice = function (newNotice, callback) {
    newNotice.notice_links.forEach(element => {
        if(!is_url(element))
            return false;
    });
    newNotice.save(callback);
}


module.exports.updateNotice = function (notice, callback) {
    notice.notice_links.array.forEach(element => {
        if(!is_url(element))
            return false;
    });
    Notice.findOneAndUpdate({_id: notice._id},
        {$set: {notice_title: notice.notice_title,
            notice_content: notice.notice_content,
            notice_links: notice.notice_links
        }}, 
        {'new': true, 'safe': true, 'upsert': true},(err, res )=> {
            res.send(res.json())
        });
}


module.exports.removeNotice = function (notice, callback) {
    Notice.findOneAndDelete({_id: notice},
        (err, res )=> {
            if (err)
            res.json({ success: false, message: 'Notice not deleted!'});
            else
                res.json({ success: true, message: 'Notice deleted!'});
    });
}


module.exports.getNoticesByID = function (id, callback) {
    Notice.find({_id:id}, (err,res)=>
        res.send(res.json())
    );
}
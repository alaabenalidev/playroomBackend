var mongoose = require('mongoose');

var challengeSchema = mongoose.Schema({
    title: {type: String, require:true},
    description:{type: String, require:true},
    date_fin:{type: Date, require:true},
    langue:{type: String, require:true},  
    points_cadeaux:{type: Number, require:true},
    list_livre:[{
        _id_user:{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            unique: true,
            ref: 'Users'
        },
        _id_livre:{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            unique: true,
            ref: 'Livres'
        },
        date_commit:{type:Date,default:Date.now()}
    }],
    winner:{type:String,require:true,default:""}
},
{timestamps: true}
);

var Challenge = module.exports = mongoose.model('Challenges',challengeSchema);

module.exports.addChallenge = function (newChallenge, callback) {
    newChallenge.save(callback);
}

module.exports.updateLivre = function (challenge, callback) {
    Challenge.findOneAndUpdate({_id: challenge._id},
        {$set: {notice_title: notice.notice_title,
            notice_content: notice.notice_content,
            notice_links: notice.notice_links
        }}, 
        {'new': true, 'safe': true, 'upsert': true},(err, res )=> {
            res.send(res.json())
        });
}

module.exports.removeLivre = function (challenge, callback) {
    Challenge.findOneAndDelete({_id: challenge},
        (err, res )=> {
            if (err)
            res.json({ success: false, message: 'Challenge not deleted!'});
            else
                res.json({ success: true, message: 'Challenge deleted!'});
    });
}

module.exports.getChallengeByID = function (id, callback) {
    Challenge.find({_id:id}, (err,res)=>
        res.send(res.json())
    );
}
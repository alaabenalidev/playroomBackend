var mongoose = require('mongoose');

var ContactUsSchema = mongoose.Schema({
    email: {type: String, require: true},
    name_mailer: {type: String, require: true},
    message:{type: String, require: true},
    reply_message: {type: String, require: true, default:null},
    isReplied: {type: Boolean, value:true || false, default: false},
    reply_mail: {type:mongoose.Schema.Types.ObjectId,require:true, ref:'Users'}
},
{timestamps: true}
);

var ContactUs = module.exports = mongoose.model('Contact us',ContactUsSchema);

module.exports.addContactUs = function (newMessage, callback) {
    newMessage.save(callback);
}


module.exports.getContactByID = function (id, callback) {
    ContactUs.find({_id:id}, (err,res)=>
        res.send(res.json())
    );
}

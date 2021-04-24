var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    roleName:{ type: String,require:true, unique: true,lowercase: true},
    admin:{ type:Boolean, default: false }
},
{timestamps: true}
);

var Role = module.exports = mongoose.model('Roles',UserSchema);

module.exports.getAllRolles = function (value, callback) {
    Role.find({}, (err,res)=>
        res.send(res.json())
    );
}

module.exports.addRole = function (newRole, callback) {
    newRole.save(callback);
}
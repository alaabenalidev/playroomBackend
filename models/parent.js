var mongoose = require('mongoose');

var ParentSchema = mongoose.Schema({
    id_parent: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        unique: true,
        ref: 'Users'
    },
    cin: {
        type: String,
        unique: true,
        index: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        index: true
    },
    children_list: [{
        _id:false,
        child: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        typeChild: String,
        default:[]
    }]
}, {
    timestamps: true
});

var Parent = module.exports = mongoose.model('Parent', ParentSchema);


module.exports.addParent = function (newParent, callback) {
    newParent.save(callback);
}

module.exports.getParentById = function (id, callback) {
    Parent.findById(id, callback);
}

module.exports.getParentByStudent = function (id, callback) {
    User.find({
        children_list: id
    }, callback);
}

module.exports.addParent = function (newParent, callback) {
    console.log(newParent)
    newParent.save(callback);
}

module.exports.addChildren = function (newChildren, callback) {
    newChildren.save(callback);
}

module.exports.getAllChildrenByID = function (id, callback) {
    var ChildrenList = {
        __v: false,
        _id: false,
        id_parent: false,
        timestamps: false
    };
    Parent.find({
            _id: id
        }, ChildrenList, (err, res) =>
        res.send(res.json())
    );
}

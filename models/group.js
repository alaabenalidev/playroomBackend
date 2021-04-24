var mongoose = require('mongoose');

var GroupSchema = mongoose.Schema({
    group_photo: {
        type: Buffer,
        default: null
    },
    group_creator: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    group_description: String,
    group_name: {
        type: String,
        require: true
    },
    isClass: {
        type: Boolean,
        default: false,
        require: true
    },
    isGroup: {
        type: Boolean,
        default: false,
        require: true
    },
    isEvent: {
        type: Boolean,
        default: false,
        require: true
    },
    event: {
        date_start: Date,
        date_end: Date,
        phonenumber: String,
        email: String,
        website: String,
        adress: String,
    },
    class: {
        date_start: Date,
            date_end: Date,
            graduation: String,
            university: String,
            degree: String,
            level: Number,
            infoClass: String
    },
    members: [{
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        default: null
    }],
    group_posts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Posts'
    }],
    isArchived: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

var Group = module.exports = mongoose.model('Groups', GroupSchema);

module.exports.addGroup = function(newGroup, callback) {
    let group = new Group(newGroup);
    group.save(async function(err, savedData) {
        await Group.findById(savedData._id).populate('members').exec((err, result) => {
            return callback(err, result)
        })

    })
}

module.exports.getAllGroups = function(value, callback) {
    Group.find({}, (err, res) =>
        res.send(res.json())
    );
}

module.exports.getGroupByName = function(groupName, callback) {
    const query = {
        group_name: groupName
    };
    Group.findOne(query, callback);
}

module.exports.getAllEvents = function(value, callback) {
    Group.find({
            isClass: false
        }, (err, res) =>
        res.send(res.json())
    );
}

module.exports.getAllClasses = function(value, callback) {
    Group.find({
            isClass: true
        }, (err, res) =>
        res.send(res.json())
    );
}
var mongoose = require('mongoose');

var ChildSchema = mongoose.Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, require: true, unique: true, ref: 'Users' },
    /*own_events_list: { type: [mongoose.Schema.Types.ObjectId], ref: 'Groups', default: [] },
    own_groups_list: { type: [mongoose.Schema.Types.ObjectId], ref: 'Groups', default: [] },
    notice_list: { type: [mongoose.Schema.Types.ObjectId], ref: 'Notices', default: [] },*/
    parents_list: {
        type: [{
            _id: false,
            child: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            typeChild: String
        }],
        default: []
    },
    challenge_list:[{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        unique: true,
        ref: 'Challenges'
    }],
    ConnectDuration: {
        type: Number,
        require: true
    },
    point_fidelite:{type:Number, require:true, default:0}
}, { timestamps: true });

var Child = module.exports = mongoose.model('Childs', ChildSchema);

module.exports.addChild = function(newChild, callback) {
    newChild.save(callback);
}

module.exports.addEvent = function(challenge, callback) {
    Child.update({
        id_user: challenge.id_user
    }, {
        $push: {
            own_events_list: challenge.challengeId
        }
    }, (err, res) => {
        if (err) {
            console.log(err);
            return false;
        } else {
            return callback;
        }
    });
}

module.exports.getAllParentByIDTeacher = function(id_teacher, callback) {

    var listParent = {
        __v: false,
        _id: false,
        id_student: false,
        own_events_list: false,
        timestamps: false
    };

    Child.find({
            $and: [
                { id_student: new mongoose.mongo.ObjectID(id_student) }
            ]
        }, listParent, (err, res) =>
        res.send(res.json())
    );
}

module.exports.addClass = function(newClass, callback) {
    newClass.save(callback);
}

module.exports.getAllClassesByIDTeacher = function(idTeacher, callback) {

    var listClasses = {
        __v: false,
        _id: false,
        id_teacher: false,
        own_events_list: false,
        notice_list: false,
        timestamps: false
    };
    Teacher.find({ id_teacher: new mongoose.mongo.ObjectID(value.id_teacher) }, listClasses, (err, res) =>
        res.send(res.json())
    );
}


module.exports.getClassByIDTeacher = function(value, callback) {

    var classItem = {
        __v: false,
        _id: false,
        id_teacher: false,
        own_events_list: false,
        notice_list: false,
        timestamps: false
    };

    Teacher.find({
            $and: [
                { id_teacher: new mongoose.mongo.ObjectID(value.id_teacher) },
                { Own_classes_list: value.id_class }
            ]
        }, classItem, (err, res) =>
        res.send(res.json())
    );
}



module.exports.addEvent = function(newEvent, callback) {
    newEvent.save(callback);
}

module.exports.getAllEventsByIDStudent = function(id_student, callback) {

    var listEvents = {
        __v: false,
        _id: false,
        id_teacher: false,
        own_parent_list: false,
        timestamps: false
    };
    Teacher.find({ id_student: id_student }, listEvents, (err, res) =>
        res.send(res.json())
    );
}

module.exports.getEventByIDTeacher = function(value, callback) {

    var eventItem = {
        __v: false,
        _id: false,
        id_teacher: false,
        own_classes_list: false,
        notice_list: false,
        timestamps: false
    };

    Teacher.find({
            $and: [
                { id_teacher: new mongoose.mongo.ObjectID(value.id_teacher) },
                { own_events_list: value.id_event }
            ]
        }, eventItem, (err, res) =>
        res.send(res.json())
    );
}

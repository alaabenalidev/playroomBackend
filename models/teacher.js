var mongoose = require('mongoose');

var TeacherSchema = mongoose.Schema({
    id_teacher: {type:mongoose.Schema.Types.ObjectId,require:true, unique:true, ref:'Users'},
    notice_list:{type:[mongoose.Schema.Types.ObjectId], ref:'Notices', default:[]},
    own_classes_list: {type:[mongoose.Schema.Types.ObjectId], ref:'Groups', default:[]},
    own_events_list: {type:[mongoose.Schema.Types.ObjectId], ref:'Groups', default:[]},
    own_groups_list: {type:[mongoose.Schema.Types.ObjectId], ref:'Groups', default:[]}
},
{timestamps: true}
);

var Teacher = module.exports = mongoose.model('Teachers',TeacherSchema);

module.exports.addTeacher = function (newTeacher, callback) {
    newTeacher.save(callback);
}

module.exports.addNotice = function (teacher, callback) {
    Teacher.update({
        id_teacher: teacher.id_teacher
    }, {
        $push: {
            notice_list: teacher.noticeid
        }
    }, (err, res) => {
        if (err) {
            console.log(err);
            return false;
        }
        else{
            console.log('sss')
            return callback;
        }
    });
}

module.exports.getAllNoticesByIDTeacher = function (id_teacher, callback) {

    var listNotices = { 
        __v: false,
        _id: false,
        id_teacher:false,
        own_classes_list:false,
        own_events_list:false,
        timestamps:false
    };

    Teacher.find({$and: [
        {id_teacher: new mongoose.mongo.ObjectID(id_teacher)}]},listNotices, (err,res) =>
            res.send(res.json())
    );
}

module.exports.getNoticeByIDTeacher = function (value, callback) {

    var itemNotices = { 
        __v: false,
        _id: false,
        id_teacher:false,
        own_classes_list:false,
        own_events_list:false,
        timestamps:false
    };

    Teacher.find({$and: [
        {id_teacher: new mongoose.mongo.ObjectID(value.id_teacher)},
        {notice_list: value.id_notice}]},itemNotices, (err,res) =>
            res.send(res.json())
    );
}

module.exports.addClass = function (newClass, callback) {
    newClass.save(callback);
}

module.exports.getAllClassesByIDTeacher = function (idTeacher, callback) {
    
    var listClasses = { 
        __v: false,
        _id: false,
        id_teacher:false,
        own_events_list:false,
        notice_list:false,
        timestamps:false
    };
    Teacher.find(
        {id_teacher: new mongoose.mongo.ObjectID(value.id_teacher)},listClasses, (err,res)=>
        res.send(res.json())
    );
}


module.exports.getClassByIDTeacher = function (value, callback) {

    var classItem = { 
        __v: false,
        _id: false,
        id_teacher:false,
        own_events_list:false,
        notice_list:false,
        timestamps:false
    };

    Teacher.find({$and: [
        {id_teacher: new mongoose.mongo.ObjectID(value.id_teacher)},
        {Own_classes_list: value.id_class}]},classItem, (err,res) =>
            res.send(res.json())
    );
}



module.exports.addEvent = function (newEvent, callback) {
    newEvent.save(callback);
}

module.exports.getAllEventsByIDTeacher = function (idTeacher, callback) {
    
    var listEvents = { 
        __v: false,
        _id: false,
        id_teacher:false,
        own_classes_list:false,
        notice_list:false,
        timestamps:false
    };
    Teacher.find(
        {id_teacher: new mongoose.mongo.ObjectID(value.id_teacher)},listEvents, (err,res)=>
        res.send(res.json())
    );
}

module.exports.getEventByIDTeacher = function (value, callback) {

    var eventItem = { 
        __v: false,
        _id: false,
        id_teacher:false,
        own_classes_list:false,
        notice_list:false,
        timestamps:false
    };

    Teacher.find({$and: [
        {id_teacher: new mongoose.mongo.ObjectID(value.id_teacher)},
        {own_events_list: value.id_event}]}, eventItem , (err,res) =>
            res.send(res.json())
    );
}
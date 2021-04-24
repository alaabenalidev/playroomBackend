const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
var Teacher = require('../models/teacher');

router.post('/add', (req, res) => {

    Teacher.addTeacher(req.body, (err, notice) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: 'Failed to add Notice'
            });
        } else {
            res.json({
                success: true,
                notice: notice
            });
        }
    });
});

router.post('/addteacher', (req, res) => {

    let teacher = new Teacher({ id_teacher: req.body.idUser })
    Teacher.addTeacher(teacher, (err, user) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: 'Failed to add teacher'
            });
        } else {
            res.json({
                success: true,
                user: user
            });
        }
    });
});

router.post('/addnotice', (req, res) => {

    Teacher.update({
        id_teacher: String(req.body.id_teacher)
    }, {
        $push: {
            notice_list: String(req.body.notice_id)
        }
    }, {
        new: true,
        upsert: true,
    }, (err, result) => {
        if (err) {
            console.log(err);
            return false;
        } else {
            res.send({
                success: true
            })
        }
    });
});

router.get('/get/notice', function(req, res) {
    Teacher.find({}, function(err, notices) {
        res.send(notices);
    });
});

router.get('/get/:idUser/groups/classes', function(req, res) {
    var option = {
        __v: false,
        _id: false,
        id_teacher: false,
        notice_list: false,
        own_groups_list: false,
        own_events_list: false,
        createdAt: false,
        updatedAt: false
    };
    Teacher.find({ id_teacher: req.params.idUser }, option, function(err, groups) {
        res.send(groups);
    });
});

router.get('/get/:idUser/groups/events', function(req, res) {
    var option = {
        __v: false,
        _id: false,
        id_teacher: false,
        notice_list: false,
        own_classes_list: false,
        own_groups_list: false,
        createdAt: false,
        updatedAt: false
    };

    Teacher.find({ id_teacher: req.params.idUser }, option, function(err, groups) {
        res.send(groups);
    });
});

router.get('/get/:idUser/groups/groups', function(req, res) {
    var option = {
        __v: false,
        _id: false,
        id_teacher: false,
        notice_list: false,
        own_classes_list: false,
        own_events_list: false,
        createdAt: false,
        updatedAt: false
    };

    Teacher.find({ id_teacher: req.params.idUser }, option, function(err, groups) {
        res.send(groups);
    });
});

router.get('/getnoticesteacher/:id', function(req, res) {
    Teacher.find({
        id_teacher: req.params.id
    }).populate('notice_list').exec((err, notices) => {
        res.send(notices);
    });
});

router.post('/add/group/', function(req, res) {
    let idGroup = req.body.idGroup
    let idUser = req.body.idUser
    let push = ''
    if (req.body.isGroup)
        push = {
            $push: {
                own_groups_list: idGroup
            }
        }
    else if (req.body.isClass)
        push = {
            $push: {
                own_classes_list: idGroup
            }
        }
    else if (req.body.isEvent)
        push = {
            $push: {
                own_events_list: idGroup
            }
        }

    Teacher.update({
        id_teacher: idUser
    }, push, {
        new: true,
        upsert: true,
    }, (err, result) => {
        if (err) {
            console.log(err);
            return false;
        } else {
            res.send({
                success: true
            })
        }
    });
})

router.delete('/delete/notice/:iduser/:id', (req, res) => {
    let iduser = req.params.iduser
    let id = req.params.id
    Teacher.findOne({
        id_teacher: iduser
    }, function(err, me) {
        for (var i = 0; i <= me.notice_list.length; i++) {
            if (String(me.notice_list[i]) == String(id)) {
                me.notice_list.splice(i, 1);
                break;
            }
        }
        me.save(function(err, us) {
            if (err) {
                console.log(err)
                res.send({
                    success: false
                })

            } else {
                res.send({
                    success: true
                })
            }
        });
    });
});

router.delete('/delete/group/:idUser/:idGroup/:isClass/:isEvent/:isGroup', (req, res) => {
    console.log(req.params)
    let iduser = req.params.idUser
    let id = req.params.idGroup
    if (Boolean(req.params.isClass))
        Teacher.findOne({
            id_teacher: iduser
        }, function(err, me) {
            console.log(me)
            for (var i = 0; i <= me.own_classes_list.length; i++) {
                if (String(me.own_classes_list[i]) == String(id)) {
                    console.log('yes class')
                    me.own_classes_list.splice(i, 1);
                    break;
                }
            }
            me.save(function(err, us) {
                if (err) {
                    console.log(err)
                    res.send({
                        success: false
                    })

                } else {
                    res.send({
                        success: true
                    })
                }
            });
        });
    else if (Boolean(req.params.isEvent))
        Teacher.findOne({
            id_teacher: iduser
        }, function(err, me) {
            for (var i = 0; i <= me.own_events_list.length; i++) {
                if (String(me.own_events_list[i]) == String(id)) {
                    console.log('yes Event')
                    me.own_events_list.splice(i, 1);
                    break;
                }
            }
            me.save(function(err, us) {
                if (err) {
                    console.log(err)
                    res.send({
                        success: false
                    })

                } else {
                    res.send({
                        success: true
                    })
                }
            });
        });
    else
        Teacher.findOne({
            id_teacher: iduser
        }, function(err, me) {
            for (var i = 0; i <= me.own_groups_list.length; i++) {
                if (String(me.own_groups_list[i]) == String(id)) {
                    console.log('yes Event')
                    me.own_groups_list.splice(i, 1);
                    break;
                }
            }
            me.save(function(err, us) {
                if (err) {
                    console.log(err)
                    res.send({
                        success: false
                    })

                } else {
                    res.send({
                        success: true
                    })
                }
            });
        });
});

module.exports = router;
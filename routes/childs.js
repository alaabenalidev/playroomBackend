const express = require('express');
const router = express.Router();
const Child = require('../models/child');

router.post('/addchild', (req, res) => {
    console.log(req.body)
    let child = new Child({id_user:req.body.id_user,ConnectDuration:req.body.ConnectDuration})
    Child.addChild(child, (err, user) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: 'Failed to add Child'
            });
        } else {
            res.json({
                success: true,
                user: user
            });
        }
    });
});

router.post('/addpoints', (req, res) => {

    console.log(req.body)
    Child.addPoints(
        { id_user: req.body.id_user, point_fidelite: req.body.point_fidelite },
        (err, data) => {
            console.log(err)
            console.log(data)
            if (err) {
                console.log(err);
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

router.get('/get/Child/:id', function(req, res) {
    Child.findOne({
        id_Child: req.params.id
    }).populate('parents_list.child').exec((err, parent) => {
        if (err) {
            res.send({
                success: false,
                msg: err
            })
        } else if (!parent) {
            res.send({
                success: false,
            })
        } else
            res.send({
                success: true,
                parent: parent
            });
    });
});



router.get('/get/:idUser/groups/events', function(req, res) {
    var option = {
        __v: false,
        _id: false,
        id_Child: false,
        notice_list: false,
        own_classes_list: false,
        createdAt: false,
        updatedAt: false
    };

    Child.find({
        id_Child: req.params.idUser
    }, option, function(err, groups) {
        res.send(groups);
    });
});

router.get('/get/:idUser/groups/groups', function(req, res) {
    var option = {
        __v: false,
        _id: false,
        id_Child: false,
        notice_list: false,
        own_classes_list: false,
        own_events_list: false,
        parents_list: false,
        createdAt: false,
        updatedAt: false
    };

    Child.find({ id_Child: req.params.idUser }, option, (err, groups) => {
        if (err)
            res.send({ success: false })
        if (!groups)
            res.send({ success: false })
        res.send({ success: true, group: groups });
    });
});


router.get('/getnoticesChild/:id', function(req, res) {
    Child.find({
        id_Child: req.params.id
    }).populate('notices_list').exec((err, notices) => {
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
    else
        push = {
            $push: {
                own_events_list: idGroup
            }
        }
    Child.update({
        id_Child: idUser
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
    Child.findOne({
        id_Child: iduser
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


router.delete('/delete/group/:idUser/:idGroup/:isEvent/:isGroup', (req, res) => {
    console.log(req.params)
    let iduser = req.params.idUser
    let id = req.params.idGroup
    if (Boolean(req.params.isEvent))
        Child.findOne({
            id_Child: iduser
        }, function(err, me) {
            console.log(me.own_events_list)
            me.own_events_list.remove(id)
                /*for (var i = 0; i <= me.own_events_list.length; i++) {
                    if (String(me.own_events_list[i]) == String(id)) {
                        console.log('yes events')
                        me.own_classes_list.splice(i, 1);
                        break;
                    }
                }*/
            console.log(me.own_events_list)
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
        Child.findOne({
            id_Child: iduser
        }, function(err, me) {
            for (var i = 0; i <= me.own_groups_list.length; i++) {
                if (String(me.own_groups_list[i]) == String(id)) {
                    console.log('yes Groups')
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
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
var Parent = require('../models/parent');
const User = require('../models/user');
var randtoken = require('rand-token');
const nodemailer = require('nodemailer')
var Student = require('../models/student');


// create reusable transporter object using the default SMTP transport
let smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'Najehok.2020@gmail.com', // generated ethereal user
        pass: 'Najehok1234' // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

router.post('/addparent', (req, res) => {

    let parent = new Parent({ id_parent: req.body.idUser,cin:req.body.cin,phoneNumber:req.body.phoneNumber })
    Parent.addParent(parent, (err, user) => {
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


router.get('/getparent/:userId', (req, res) => {
    Parent.find({ id_parent: req.params.userId }, (err, parent) => {
        if (err)
            res.send({ success: false })
        else {
            if (!parent)
                res.send({ success: false })
            else
                res.send({
                    success: true,
                    parent: parent
                })
        }
    })
})


// Update child temporarySecret
router.put('/sendVerificationChild', (req, res, next) => {
    let random = randtoken.generate(8);
    console.log(random)
    User.findByIdAndUpdate(req.body.childId, {
        $set: {
            temporarytoken: random
        }
    }, (error, data) => {
        console.log(data)
        var mailOptions = {
            from: 'Najehok Staff, Najehok.2020@gmail.com',
            to: data.email,
            subject: 'Code Confirmation',
            text: random,
            html: random
        }
        smtpTransport.sendMail(mailOptions, function(error, response) {
            if (error) {
                console.log(error);
            } else
                console.log(info);
        });
        if (error) {
            console.log(error)
            res.send({
                success: false,
                msg: error
            })
        } else if (data) {
            res.json({
                success: true,
            })
        } else
            res.json({
                success: false,
            })
    })
})

router.get('/', function(req, res) {
    Parent.find().populate('children_list.child').exec((err, parent) => {
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
            res.send({ success: true, parent: parent });
    });
});

router.get('/get/parent/:id', function(req, res) {
    Parent.findOne({ id_parent: req.params.id }).populate('children_list.child').exec((err, parent) => {
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
            res.send({ success: true, parent: parent });
    });
});

router.put('/addchild', (req, res) => {
    console.log(req.body)
    let childId = req.body.childId
    let parent = req.body.parentId
    User.findOne({ _id: childId }, (err, child) => {
        if (err) {
            res.json({
                msg: 'Something wrong',
                success: false
            })
        }
        if (!child)
            res.json({
                msg: 'Child not exist or not verified',
                success: false
            })
        else {
            Parent.findOneAndUpdate({
                id_parent: parent
            }, {
                $push: {
                    children_list: {
                        child: childId
                    }
                }
            }, (err, result) => {
                Student.findOne({ id_user: childId })
                if (err) {
                    console.log(err);
                    res.send({
                        msg: 'Something wrong',
                        success: false
                    })
                }
                if (!result) {
                    res.send({
                        msg: 'Error to update',
                        success: false
                    })
                } else {
                    Student.findOneAndUpdate({ id_user: childId }, {
                        $push: {
                            parents_list: {
                                child: parent
                            }
                        }
                    }, (err, updateStudent) => {
                        if (err) {
                            console.log(err);
                            res.send({
                                msg: 'Something wrong',
                                success: false
                            })
                        }
                        if (!updateStudent) {
                            res.send({
                                msg: 'Error to update',
                                success: false
                            })
                        }
                        res.send({
                            success: true
                        })
                    })

                }
            });
        }
    })
});

router.put('/deletechild', (req, res) => {
    console.log(req.body)
    let childId = req.body.childId
    let parent = req.body.parentId
    User.findOne({ _id: childId }, (err, child) => {
        if (err) {
            res.send({
                msg: 'Something wrong',
                success: false
            })
        }
        if (!child)
            res.send({
                msg: 'Child not exist or not verified',
                success: false
            })
        else {
            Parent.findOneAndUpdate({
                id_parent: parent
            }, {
                $pull: {
                    children_list: { child: childId }
                }
            }, (err, result) => {
                console.log(result)
                if (err) {
                    console.log(err);
                    res.send({
                        msg: 'Something wrong',
                        success: false
                    })
                }
                if (!result) {
                    res.send({
                        msg: 'Error to update',
                        success: false
                    })
                } else {
                    Student.findOneAndUpdate({ id_student: childId }, {
                        $pull: {
                            parents_list: { child: parent }
                        }
                    }, (err, updateStudent) => {
                        console.log(updateStudent)
                        if (err) {
                            console.log(err);
                            res.send({
                                msg: 'Something wrong',
                                success: false
                            })
                        }
                        if (!updateStudent) {
                            res.send({
                                msg: 'Error to update',
                                success: false
                            })
                        }
                        res.send({
                            success: true
                        })
                    })

                }
            });
        }
    })
});


router.get('/get/children', function(req, res) {
    Student.find({}, function(err, notices) {
        res.send(notices);
    });
});




router.delete('/delete/:idUser/child/:idChild', (req, res) => {
    Parent.findOne({
        id_Student: req.params.idUser
    }, function(err, me) {
        for (var i = 0; i <= me.children_list.length; i++) {
            if (String(me.children_list[i]) == String(req.params.idChild)) {
                console.log('yes children')
                me.children_list.splice(i, 1);
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
})

router.delete('/delete/:idUser', (req, res) => {
    console.log(req.params)
    let idUser = req.params.idUser
    Parent.findOneAndDelete({ id_parent: idUser }, function(err, result) {
        if (err) {
            console.log(err)
            res.send({ success: false })
        } else {
            res.send({ success: true })
        }
    })

});

module.exports = router;
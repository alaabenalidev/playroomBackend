const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
const nodemailer = require('nodemailer')
const User = require('../models/user');
const Parent = require('../models/parent');
const Student = require('../models/student');
const config = require('../config/database');
//const multer = require('multer');
const path = require("path");
//const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
//var upload = require('./upload');
//const storage = new GridFsStorage({ url : mongoURI})

//var smtpTransport = nodemailer.createTransport("smtps://Najehok.2020@gmail.com:"+encodeURIComponent('Najehok1234') + "@smtp.gmail.com:587");

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

router.get('/findbyemailorusername/:value', (req, res) => {
    const value = req.params.value;
    User.getUserByEmailOrUsername(String(value), (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({
                success: true,
                user
            });
        } else
            return res.json({
                success: false,
                msg: "No one found"
            });
    });
});

router.get('/findbyid/:value', (req, res) => {
    const value = req.params.value;
    User.getUserById(String(value), (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({
                success: true,
                user
            });
        } else
            return res.json({
                success: false,
                msg: "No one found"
            });
    });
});

router.get('/findbyemailorusernamesearch/:value', (req, res) => {
    const value = req.params.value;
    User.getUserByEmailOrUsernameOrFullNameSearch(String(value), (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({
                success: true,
                user
            });
        } else
            return res.json({
                success: false,
                msg: "No one found"
            });
    });
});

router.get('/findbyname/:value', (req, res) => {
    const value = req.params.value;
    User.getUserByName(String(value), (err, user) => {
        console.log(user);
        if (err) throw err;
        if (user) {
            console.log(user);
            return res.json({
                success: true,
                user
            });
        } else
            return res.json({
                success: false,
                msg: "No one found"
            });
    });
});

router.get('/checkusername/:username', (req, res) => {
    const username = req.params.username;
    User.getUserByUsername(String(username), (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({
                success: false,
                msg: "Username exist"
            });
        } else
            return res.json({
                success: true,
                msg: "Username not exist"
            });
    });
});

router.get('/checkemail/:email', (req, res) => {
    const email = req.params.email;
    User.getUserByEmail(String(email), (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({
                success: false,
                msg: "Email exist"
            });
        } else
            return res.json({
                success: true,
                msg: "Email not exist"
            });
    });
});

router.get('/checkphone/:value', (req, res) => {
    const phoneNumber = req.params.value;
    User.getUserByPhoneNumber(String(phoneNumber), (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({
                success: false,
                msg: "Email exist"
            });
        } else
            return res.json({
                success: true,
                msg: "Email not exist"
            });
    });
});

// Register
router.post('/signup', (req, res, next) => {
    let newUser = new User({
        avatar: req.body.avatar,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birthday: req.body.birthday,
        country: req.body.country,
        address: {
            street: req.body.address,
            city: req.body.city,
            postalCode: req.body.codePostal
        },
        phoneNumber: req.body.phoneNumber,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.idRole
    });

    let success = true
    User.addUser(newUser, (err, user) => {
        if (err == null)
            if (!user)
                res.json({
                    success: false,
                    msg: 'Failed to register user'
                });
            else {
                var to = user.email;
                var mailOptions = {
                    from: 'Najehok Staff, Najehok.2020@gmail.com',
                    to: to,
                    subject: 'Confirm account Najehok',
                    text: 'Hello ' + user.first_name + ', thank you for registering at Najehok.tn.',
                    html: 'Hello<strong> ' + user.first_name + '</strong>,<br><br>You are now admin in Najehok.tn.'
                }
                smtpTransport.sendMail(mailOptions, function(error, response) {
                    if (error) {
                        console.log(error);
                    } else
                        console.log(info);
                });
                res.json({
                    success: true,
                    user: user,
                    msg: 'User registered'
                });
            }

    });
});


router.get('/numberusers', function(req, res) {
    User.countDocuments({}, function(err, cpt) {
        res.json(cpt);
    })
})

// login
router.post('/login', (req, res, next) => {
    const logUser = req.body.logUser;
    const password = req.body.password;

    User.getUserByEmailOrUsernameAdmin(logUser, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({
                success: false,
                msg: "User not foud"
            });
        }
        if (user.role.admin == false) {
            return res.json({
                success: false,
                msg: "User not foud"
            });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: "JWT " + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }

                });
            } else {
                return res.json({
                    success: false,
                    msg: "Wrong Password"
                });

            }
        });
    })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    res.json({
        user: req.user
    });
});

// get Profile by Id
router.get('/profile/:id', function(req, res) {
    User.findOne({
        _id: req.params.id
    }, function(err, user) {
        res.json({
            user: user
        });
    })
});

router.put('/addchild', (req, res) => {
    console.log(req.body)
    let childId = String(req.body.childId)
    let parent = String(req.body.parentId)
    let typeFamily = String(req.body.typeFamily)
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
                        child: childId,
                        typeChild: typeFamily
                    }
                }
            }, (err, result) => {
                Student.findOne({ id_student: childId })
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
                        $push: {
                            parents_list: {
                                child: parent,
                                typeChild: typeFamily
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

module.exports = router;
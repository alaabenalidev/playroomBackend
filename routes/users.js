const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
var fs = require('fs');

const nodemailer = require('nodemailer')
const User = require('../models/user');
const config = require('../config/database');
const path = require("path");
const crypto = require("crypto");
var fs = require('fs');



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

router.get('/getallusers', (req, res) => {
    User.find({}).populate('role').exec((err, result) => {
        if (err)
            console.log(err)
        else {
            console.log(result)
            res.send(result)
        }
    })
})

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

async function checkpassworduser(userId, oldpassword) {
    User.findById(userId, (err, user) => {
        if (err)
            return false
        if (!user)
            return false

        const matchPassword = bcrypt.compare(oldpassword, user.password)
        if (matchPassword)
            return true
        else
            return false
    })
}

router.get('/checkpassworduser/:userId/:password', (req, res) => {

    if (!checkpassworduser())
        res.send({ success: false })
    else {
        res.send({ success: true })
    }
})

router.get('/findbyemailorusernamechild/:value', (req, res) => {
    const value = req.params.value;
    console.log(value)
    var user = {
        __v: false,
        isAccountVerified: false,
        updatedAt: false,
        password: false,
        temporary: false
    };
    User.findOne({
        $or: [{
                email: String(value)
            },
            {
                username: String(value)
            }
        ]
    }, user).populate('role').exec(function(err, result) {
        if (err) {
            console.log(err)
            res.send({
                success: false
            })
        } else {
            console.log(result)
            if (!result)
                res.send({
                    success: false
                })
            else if (result.role.roleName == 'student') {
                res.send({
                    success: true,
                    child: result
                })
            } else {
                res.send({
                    success: false
                })
            }
        }
    });
});

router.get('/findbyid/:value', (req, res) => {
    const value = req.params.value;
    User.getUserById(value, (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({
                success: true,
                user: user
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
    let users = []
    var user = {
        __v: false,
        isAccountVerified: false,
        updatedAt: false,
        password: false,
        temporary: false
    };
    User.find({
        $or: [{
                email: {
                    $regex: ".*" + String(value) + "+@.*"
                }
            },
            {
                username: {
                    $regex: ".*" + String(value) + ".*"
                }
            },
            {
                first_name: {
                    $regex: ".*" + String(value) + ".*"
                }
            },
            {
                last_name: {
                    $regex: ".*" + String(value) + ".*"
                }
            }
        ]
    }, user).populate('role').exec(function(err, result) {

        if (err) {
            console.log(err)
            res.send({
                success: false
            })
        } else {
            result.forEach(element => {
                if (element.role.admin == false)
                    users.push(element)
            })
            res.send({
                success: true,
                user: users
            })
        }
    });

});

router.put('/updateprofilepassword', (req, res) => {
    console.log(req.body)
    console.log(checkpassworduser(req.body.userId, req.body.oldPassword))
    res.send({ success: false })
})

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
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        full_name: req.body.full_name,
        birthday: req.body.birthday,
        gender: req.body.gender,
        country: req.body.country,
        address: {
            street: req.body.address,
            city: req.body.city,
            postalCode: req.body.codePostal
        },
        phoneNumber: req.body.phoneNumber,
        role: req.body.idRole,
        isAccountVerified: (req.body.isAccountVerified) ? req.body.isAccountVerified : false
    });


    User.addUser(newUser, (err, savedData) => {
        if (err) {
            console.log(err)
            throw err
        } else {
            if (savedData) {
                var to = savedData.email;
                var mailOptions = {
                    from: 'Najehok Staff, Najehok.2020@gmail.com',
                    to: to,
                    subject: 'Confirm account Najehok',
                    text: 'Hello ' + savedData.full_name + ', thank you for registering at Najehok.tn. Please click on the following link to complete your activation: http://localhost:4200/activate/' + savedData.temporarytoken,
                    html: '<!DOCTYPE html><html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style type="text/css">@media screen {@font-face {font-family: \'Lato\';font-style: normal;font-weight: 400;src: local(\'Lato Regular\'), local(\'Lato-Regular\'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format(\'woff\');}@font-face {font-family: \'Lato\';font-style: normal;font-weight: 700;src: local(\'Lato Bold\'), local(\'Lato-Bold\'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format(\'woff\');} @font-face {font-family: \'Lato\';font-style: italic;font-weight: 400;src: local(\'Lato Italic\'), local(\'Lato-Italic\'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format(\'woff\');}@font-face {font-family: \'Lato\';font-style: italic;font-weight: 700;src: local(\'Lato Bold Italic\'), local(\'Lato-BoldItalic\'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format(\'woff\');}}/* CLIENT-SPECIFIC STYLES */body,table,td,a {-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;}table,td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}img {-ms-interpolation-mode: bicubic;}/* RESET STYLES */img {border: 0;height: auto;line-height: 100%;outline: none;text-decoration: none;}table {border-collapse: collapse !important;}body {height: 100% !important;margin: 0 !important;padding: 0 !important;width: 100% !important;}/* iOS BLUE LINKS */a[x-apple-data-detectors] {color: inherit !important;text-decoration: none !important;font-size: inherit !important;font-family: inherit !important;font-weight: inherit !important;line-height: inherit !important;}/* MOBILE STYLES */@media screen and (max-width:600px) {h1 {font-size: 32px !important;line-height: 32px !important;}}/* ANDROID CENTER FIX */div[style*="margin: 16px 0;"] {margin: 0 !important;}</style></head><body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;"><!-- HIDDEN PREHEADER TEXT --><div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: \'Lato\', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We\'re thrilled to have you here! Get ready to dive into your new account. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"><!-- LOGO --><tr><td bgcolor="#FFA73B" align="center"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td></tr></table></td></tr><tr><td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;"><h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome' + savedData.full_name + '!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" /></td></tr></table></td></tr><tr><td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;">We\'re excited to have you get started. First, you need to confirm your account. Just press the button below.</p></td></tr><tr><td bgcolor="#ffffff" align="left"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;"><table border="0" cellspacing="0" cellpadding="0"><tr><td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="http://localhost:4200/activate/' + savedData.temporarytoken + '" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td></tr></table></td></tr></table></td></tr> <!-- COPY --><tr><td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;">If that doesn\'t work, copy and paste the following link in your browser:</p></td></tr> <!-- COPY --><tr><td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;"><a href="http://localhost:4200/activate/' + savedData.temporarytoken + '" target="_blank" style="color: #FFA73B;">http://localhost:4200/activate/' + savedData.temporarytoken + '</a></p></td></tr><tr><td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;">If you have any questions, just reply to this email—we\'re always happy to help out.</p></td></tr><tr><td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;">Cheers,<br>Najehok Team</p></td></tr></table></td></tr><tr><td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2><p style="margin: 0;"><a href="localhost:4200" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p></td></tr></table></td></tr><tr><td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;"></td></tr></table></body></html>'
                }
                // smtpTransport.sendMail(mailOptions, function(error, response) {
                //     if (error) {
                //         console.log(error);
                //     } else
                //         console.log(info);
                // });
                let userR = new User(savedData)
                userR.avatar = ''
                res.send({
                    success: true,
                    user: userR,
                    msg: 'User registered'
                })
            } else {
                console.log('user not added')
                res.send({
                    success: false,
                    user: null,
                    msg: 'Failed to register user'
                });
            }
        }
    });
});

// Route to activate the user's account	
router.put('/activate/:token', function(req, res) {
    console.log(req.params.token)
    User.findOne({
        temporarytoken: req.params.token
    }, function(err, user) {
        if (err) throw err; // Throw error if cannot login
        var token = req.params.token; // Save the token from URL for verification 

        // Function to verify the user's token
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Activation with error'
                }); // Token is expired
            } else if (!user) {
                res.json({
                    success: false,
                    message: 'Activation link has expired.'
                }); // Token may be valid but does not match any user in the database
            } else {
                user.temporarytoken = false; // Remove temporary token
                user.isAccountVerified = true; // Change account status to Activated
                // Mongoose Method to save user into the database
                user.save(function(err) {
                    if (err) {
                        console.log(err); // If unable to save user, log error info to console/terminal
                    } else {
                        // If save succeeds, create e-mail object
                        var to = user.email;
                        var mailOptions = {
                                from: 'Najehok Staff, Najehok.2020@gmail.com',
                                to: to,
                                subject: 'Confirm account Najehok',
                                text: 'Hello ' + user.first_name + ', thank you for registering at Najehok.tn.',
                                html: 'Hello<strong> ' + user.first_name + '</strong>,<br><br>Thank you for registering at Najehok.tn.'
                            }
                            // Send e-mail object to user
                        smtpTransport.sendMail(mailOptions, function(error, response) {
                            if (err)
                                console.log(err); // If unable to send e-mail, log error info to console/terminal
                        });
                        res.json({
                            success: true,
                            message: 'Account activated!'
                        }); // Return success message to controller
                    }
                });
            }
        });
    });
});


// Route to send user a new activation link once credentials have been verified
router.put('/resend', function(req, res) {
    User.findOne({
        username: req.body.logUser
    }).select('username name email temporarytoken').exec(function(err, user) {
        if (err) throw err; // Throw error if cannot connect
        user.temporarytoken = jwt.sign({
            username: user.username,
            email: user.email
        }, secret, {
            expiresIn: '24h'
        }); // Give the user a new token to reset password
        // Save user's new token to the database
        user.save(function(err) {
            if (err) {
                console.log(err); // If error saving user, log it to console/terminal
            } else {
                // If user successfully saved to database, create e-mail object
                var mailOptions = {
                    from: 'Localhost Staff, staff@localhost.com',
                    to: user.email,
                    subject: 'Localhost Activation Link Request',
                    text: 'Hello ' + user.first_name + ', You recently requested a new account activation link. Please click on the following link to complete your activation: http://localhost:4200/activate/' + user.temporarytoken,
                    html: 'Hello<strong> ' + user.first_name + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://localhost:4200/activate/' + user.temporarytoken + '">Active Account</a>'
                };

                // Function to send e-mail to user
                smtpTransport.sendMail(mailOptions, function(err, info) {
                    if (err) console.log(err); // If error in sending e-mail, log to console/terminal
                });
                res.json({
                    success: true,
                    message: 'Activation link has been sent to ' + user.email + '!'
                }); // Return success message to controller
            }
        });
    });
});

// login
router.post('/login', (req, res, next) => {
    const logUser = req.body.logUser;
    const password = req.body.password;

    User.getUserByEmailOrUsername(logUser, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({
                success: false,
                msg: "User not foud"
            });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                let userR = new User({
                    _id: user._id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                })
                const token = jwt.sign(userR.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });
                /*const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });*/

                res.json({
                    success: true,
                    token: "JWT " + token,
                    user: {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
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
}), async(req, res, next) => {
    res.json({
        user: await req.user
    });
});


// get Profile by Id
router.get('/profile/:id', function(req, res) {
    User.findOne({
        _id: req.params.id
    }).populate('role').exec(function(err, user) {
        /*let userR = new User(user)
        let buff = new Buffer(userR.avatar).toString('base64');
        userR.avatar = buff*/
        res.json({
            // imgStr: buff.toString(),
            user: user
        });
    })
});


// Update User
router.put('/update', (req, res, next) => {
    User.findByIdAndUpdate(req.body._id, {
        $set: req.body
    }, (error, data) => {
        console.log(data)
        if (error) {
            console.log(error)
            res.send({
                success: false,
                msg: error
            })
        } else {
            res.json({
                success: true,
                user: data,
                msg: 'Profile updated successfully'
            })
            console.log('Profile updated successfully')
        }
    })
})

router.delete('/disable/:userId', (req, res) => {
    let disable = {
        isAccountDisabled: true
    }
    User.findByIdAndUpdate(req.params.userId, disable, (err, isDisabled) => {
        if (err)
            res.send({ success: false })
        if (!isDisabled)
            res.send({ success: false })
        res.send({ success: true })
    })
})

module.exports = router;
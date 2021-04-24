const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const randomstring = require('randomstring');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
const nodemailer = require('nodemailer')



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

var validateEmail = function(Email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(Email)
};

var validateFullName = function(name) {
    var regex = '\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\<|\,|\>|\?|\/|\""|\;|\:|\s';
    return re.test(name)
}

//User Schema
const UserSchema = mongoose.Schema({
    //avatar: { type: Buffer, default: null },
    username: {
        type: String,
        require: true,
        lowercase: true,
        minlength: 4,
        maxlength: 20,
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
        index: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        validate: validateEmail,
        index: true
    },
    password: {
        type: String,
        require: true
    },
    full_name: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 30
    },
    birthday: {
        type: Date,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    address: {
        street: {
            type: String,
            default: null
        },
        city: {
            type: String,
            require: true
        },
        postalCode: {
            type: Number,
            require: true
        }
    },
    role: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'Roles'
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    isAccountDisabled: {
        type: Boolean,
        default: false
    },
    temporarytoken: {
        type: String
    }
}, {
    timestamps: true
}, {
    deleted_at: Date
})

const User = module.exports = mongoose.model('Users', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
    const query = {
        username: username
    };
    User.findOne(query, callback);
}


module.exports.getUserByEmail = function(email, callback) {
    const query = {
        email: email
    };
    User.findOne(query, callback);
}

module.exports.getUserByPhoneNumber = function(phonenumber, callback) {
    const query = {
        phoneNumber: phonenumber
    };
    User.findOne(query, callback);
}

module.exports.getUserByEmailOrUsername = function(logUser, callback) {

    var user = {
        __v: false,
        isAccountVerified: false,
        updatedAt: false,
        //password:false,
        temporary: false
    };
    User.findOne({
        $or: [{
                email: logUser
            },
            {
                username: logUser
            }
        ]
    }, user).populate('role').exec(callback);;
}

module.exports.getUserByEmailOrUsernameAdmin = function(logUser, callback) {

    var user = {
        __v: false,
        isAccountVerified: false,
        updatedAt: false,
        //password:false,
        temporary: false
    };
    User.findOne({
        $or: [{
                email: logUser
            },
            {
                username: logUser
            }
        ]
    }, user).populate('role').exec(callback);
}

module.exports.getUserByEmailOrUsernameOrFullNameSearch = function(logUser, callback) {

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
                    $regex: logUser,
                    "$options": "i"
                }
            },
            {
                username: {
                    $regex: logUser,
                    "$options": "i"
                }
            },
            {
                first_name: {
                    $regex: logUser,
                    "$options": "i"
                }
            },
            {
                last_name: {
                    $regex: logUser,
                    "$options": "i"
                }
            }
        ]
    }, user).populate('role').exec(function(err, result) {
        let users = []
        if (err) {
            console.log(err)
            result.send({
                success: false
            })
        } else {
            result.forEach(element => {
                if (element.role.admin == false)
                    users.push(element)
            })
            result.send({
                success: true,
                user: users
            })
        }
    });
}

module.exports.getUserByName = function(value, callback) {

    var user = {
        __v: false,
        isAccountVerified: false,
        updatedAt: false,
        password: false,
        temporary: false
    };
    User.find({
        $or: [{
                first_name: value
            },
            {
                last_name: value
            }
        ]
    }, user, callback);
}


module.exports.addUser = async function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            const secretToken = randomstring.generate();
            newUser.temporarytoken = jwt.sign({
                username: newUser.username,
                email: newUser.email
            }, secret, {
                expiresIn: '24h'
            }); // Create a token for activating account through e-mail;

            newUser.save(async function(err, savedData) {
                return await callback(err, savedData)

            })
        });
    });
}

module.exports.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMatch) {
        if (err) {
            return callback(err, false);
        }
        return callback(null, isMatch);
    });
};

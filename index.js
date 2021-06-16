const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Port number
const port = 3000;
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const users = require('./routes/users');
const roles = require('./routes/roles');
const contactUs = require('./routes/contactus');
const parents = require('./routes/parent');
const childs = require('./routes/childs');
const livres = require('./routes/livres')
const groups = require('./routes/group');
const challenges = require('./routes/challenges');
const usersAdmin = require('./routes/userA');




MongoClient.connect(config.database, (err, Database) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log("Connected to MongoDB");

    const db = Database.db("NajehokDB");
    const server = app.listen(port, () => {
        console.log("Server started on port " + port + "...");
    });
});


mongoose.connect(config.database);


// CORS Middle Ware
app.use(cors());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
    next();
});


// Body Parser MW
app.use(bodyParser.json({limit: '100mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}))
//Passport MW
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/roles', roles);
app.use('/contactus', contactUs);
app.use('/challenges', challenges);
app.use('/livres', livres);
app.use('/groups', groups);
app.use('/parents', parents);
app.use('/childs', childs);
app.use('/usersadmin', usersAdmin);

// Start Server
/*app.listen(port, () => {
    console.log("Server started on port " + port);
});*/

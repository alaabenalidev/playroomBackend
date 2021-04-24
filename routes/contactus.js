const express = require('express');
/*const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();*/
const router = express.Router();
var Contactus = require('../models/contactus');

router.post('/add/message', (req, res) => {

    const contactus = new Contactus({
        email: req.body.email,
        name_mailer: req.body.name_mailer,
        message: req.body.message
    });

    Contactus.addContactUs(contactus, (err, role) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: 'Failed to add contactus'
            });
        } else {
            res.json({
                success: true,
                msg: 'contactus added'
            });
        }
    });
});


router.put('/add/reply', (req, res) => {
    Contactus.findOneAndUpdate(req.body.id, {$set:{reply_message:req.body.reply_message,reply_mail:req.body.reply_mail,isReplied:true}}, (err, result) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to update contactus'
            });
        } else {
            res.json({
                success: true,
                msg: 'Contactus successffly update'
            });
        }
    });
});




router.get('/get/messages', function (req, res) {
    Contactus.find({}).populate('reply_mail').exec(function (err, data) {
        res.json(data)
      if (err) {
        return res.json({error:err})
      }
    })
});

router.get('/get/messages/sent', function (req, res) {
    Contactus.find({isReplied:true}).populate('reply_mail').exec(function (err, data) {
        res.json(data)
      if (err) {
        return res.json({error:err})
      }
    })
});

router.get('/get/messages/unsend', function (req, res) {
    Contactus.find({isReplied:false}).populate('reply_mail').exec(function (err, data) {
        res.json(data)
      if (err) {
        return res.json({error:err})
      }
    })
});


router.delete('/delete/message/:id', (req, res) => {
    console.log(req.params.id)
    Contactus.remove({_id:req.params.id}, function (err) {
        if (err) {
            res.send({success:false})
        }
        res.send({success:true})
    });
});


router.get('/numbermails', function (req, res) {
    Contactus.countDocuments({}, function (err, cpt) {
        res.json(cpt);
    })
})

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
var Challenge = require('../models/challenge');

router.post('/add',(req,res) => {
    let date_fin = new Date(req.body.date_fin)
    let challenge = new Challenge({
        title : req.body.title,
        description : req.body.description,
        date_fin : date_fin,
        langue : req.body.langue,
        points_cadeaux : req.body.points_cadeaux
    })
    Challenge.addChallenge(challenge, (err, challenge) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to add Challenge' });
        } else {
            res.json({ success: true, challenge: challenge });
        }
    });
}
);

router.get('/get/challenge', function(req, res) {
    Challnege.find({}, function(err, notices) {
      res.send(notices);  
    });
});

router.get('/getchallengebyid/:id', function(req, res) {
    console.log(req.params.id)
    let id = req.params.id
    Challenge.find({_id:id}, function(err, challenge) {
        (err)? res.send({success:false ,challenge:challenge}) : res.send({success:true ,challenge:challenge})
    });
});

router.post('/getnoticeuser', function(req, res) {
    Notice.find(
        {_id:{
            $in : req.body 
        }
    }, function(err, notices) {
      res.send(notices);  
    });
});

router.put('/update',function(req,res){
    let updateChallenge = new Notice(req.body)
    Challenge.findOneAndUpdate({_id:updateChallenge._id},{
        $set:{
            title:updateChallenge.notice_title, 
            description:updateChallenge.description,
            date_fin:updateChallenge.date_fin,
            date_fin:updateChallenge.date_fin,
            langue:updateChallenge.langue,
            points_cadeaux:updateChallenge.points_cadeaux,
            list_livre:updateChallenge.list_livre
        }},(err, result) => {
            if(err){
                console.log(err)
                res.json({success:false})
            }
            else
                res.json({success:true})
        })
})

/*router.get('/get/roles',(req,res)=>{

    Role.getAllRolles((err,res)=>{
        if (err) {
            res.json({ success: false, msg: 'Failed to add role' });
        } else {
            res.json({ success: true, msg: 'Role added' });
        }
    })
});*/

router.delete('/delete/:id',(req,res)=>{
    let id=req.params.id
    Challenge.findByIdAndDelete(id, function (err) {
        if (err) return next(err);
        res.send({success:true});
});
});

module.exports = router;
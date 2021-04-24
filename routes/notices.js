const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
var Notice = require('../models/notice');

router.post('/add',(req,res) => {
    let notice = new Notice({
        notice_title : req.body.notice_title,
        notice_content : req.body.notice_content,
        notice_links : req.body.notice_links
    })
    Notice.addNotice(notice, (err, notice) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to add Notice' });
        } else {
            res.json({ success: true, notice: notice });
        }
    });
}
);

router.get('/get/notice', function(req, res) {
    Notice.find({}, function(err, notices) {
      res.send(notices);  
    });
});

router.get('/getnoticebyid/:id', function(req, res) {
    let id = req.params.id
    Notice.find({_id:id}, function(err, notice) {
        (err)? res.send({success:false ,notice:notice}) : res.send({success:true ,notice:notice})
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
    let updateNotice = new Notice(req.body)
    Notice.findOneAndUpdate({_id:updateNotice._id},{
        $set:{
            notice_title:updateNotice.notice_title, 
            notice_content:updateNotice.notice_content,
            notice_links:updateNotice.notice_links
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
    Notice.findByIdAndDelete(id, function (err) {
        if (err) return next(err);
        res.send({success:true});
});
});

module.exports = router;
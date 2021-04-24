const express = require('express');
const router = express.Router();
var Livre = require('../models/livre');



router.post('/add',(req,res) => {
    let livre = new Livre({
        child_id: req.body.child_id,
        title:  req.body.title,
        description: req.body.description,
        auteur: req.body.auteur,
        language: req.body.language,  
        avis: req.body.avis,
        file_pdf: req.body.file_pdf,
        video: req.body.video,
        quizs: req.body.quizs,
    })
    Livre.addLivre(livre, (err, livre) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to add livre' });
        } else {
            res.json({ success: true, livre: livre });
        }
    });
}
);

router.get('/get/livre', function(req, res) {
    Livre.find({}, function(err, livres) {
      res.send(livres);  
    });
});

router.get('/getlivrebyuserid/:id', function(req, res) {
    console.log(req.params.id)
    let id = req.params.id
    Livre.find({child_id:id}, function(err, livre) {
        (err)? res.send({success:false ,livre:[]}) : res.send({success:true ,livre:livre})
    });
});

router.post('/getlivreuser', function(req, res) {
    Livre.find(
        {_id:{
            $in : req.body 
        }
    }, function(err, livres) {
      res.send(livres);  
    });
});

router.put('/update',function(req,res){
    let updatelivre = new livre(req.body)
    Livre.findOneAndUpdate({_id:updatelivre._id},{
        $set:{
            title:updatelivre.livre_title, 
            description:updatelivre.description,
            date_fin:updatelivre.date_fin,
            date_fin:updatelivre.date_fin,
            langue:updatelivre.langue,
            points_cadeaux:updatelivre.points_cadeaux,
            list_livre:updatelivre.list_livre
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
    Livre.findByIdAndDelete(id, function (err) {
        if (err) return next(err);
        res.send({success:true});
});
});

module.exports = router;
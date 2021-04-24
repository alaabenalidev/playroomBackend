const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
var Role = require('../models/Role');

router.post('/add/role',(req,res) => {

    const role = new Role({
        roleName: req.body.roleName,
        admin: req.body.admin || false
    });

    Role.addRole(role, (err, role) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to add role' });
        } else {
            res.json({ success: true, msg: 'Role added' });
        }
    });
}
);

router.get('/get/roles', function(req, res) {
    Role.find({}, function(err, roles) {
      res.send(roles);  
    });
  });

/*router.get('/get/roles',(req,res)=>{

    Role.getAllRolles((err,res)=>{
        if (err) {
            res.json({ success: false, msg: 'Failed to add role' });
        } else {
            res.json({ success: true, msg: 'Role added' });
        }
    })
});*/

router.delete('/delete/role',(req,res)=>{
    Role.findByIdAndDelete(req.body._id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
});
});

module.exports = router;
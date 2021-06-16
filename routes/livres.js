const express = require("express");
const router = express.Router();
var Livre = require("../models/livre");
const Child = require("../models/child");

router.post("/add", (req, res) => {
  let livre = new Livre({
    child_id: req.body.child_id,
    title: req.body.title,
    description: req.body.description,
    auteur: req.body.auteur,
    language: req.body.language,
    file_pdf: req.body.file_pdf,
    video: req.body.video,
    quizs: req.body.quizs,
  });
  Livre.addLivre(livre, (err, livre) => {
    if (err) {
      console.log(err);
      res.json({ success: false, msg: "Failed to add livre" });
    } else {
      Child.addPoints(
        { id_user: req.body.child_id, point_fidelite: 30 },
        (err, data) => {
          if (err) {
            console.log(err);
            res.json({ success: false, msg: "Failed to add livre" });
          } else res.json({ success: true, livre: livre });
        }
      );
    }
  });
});

router.get("/", function (req, res) {
  var livreProjection = {
    __v: false,
    file_pdf: false,
  };
  Livre.find({}, livreProjection, function (err, livres) {
    res.send(livres);
  });
});

router.get("/search/:input", function (req, res) {
  Livre.find(
    { title: { $regex: req.params.input, $options: "i" } },
    function (err, livres) {
      err
        ? res.send({ success: false, livres: livres })
        : livres.length == 0
        ? res.send({ success: false, livres: [] })
        : res.send({ success: true, livres: livres });
    }
  );
});

router.get("/getlivrebyuserid/:id", function (req, res) {
  let id = req.params.id;
  Livre.find({ child_id: id }, function (err, livre) {
    err
      ? res.send({ success: false, livre: [] })
      : res.send({ success: true, livre: livre });
  });
});

router.get("/getlivrebyid/:id", function (req, res) {
  let id = req.params.id;
  Livre.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { new: true })
    .populate("child_id")
    .exec((err, result) => {
      res.send({ success: true, book: result });
    });

  // Livre.find({ _id: id }, function (err, challenge) {
  //   err
  //     ? res.send({ success: false, challenge: challenge })
  //     : res.send({ success: true, challenge: challenge });
  // });
});

router.post("/getlivreuser", function (req, res) {
  Livre.find(
    {
      _id: {
        $in: req.body,
      },
    },
    function (err, livres) {
      res.send(livres);
    }
  );
});

router.put("/update", function (req, res) {
  let updatelivre = new livre(req.body);
  Livre.findOneAndUpdate(
    { _id: updatelivre._id },
    {
      $set: {
        title: updatelivre.livre_title,
        description: updatelivre.description,
        date_fin: updatelivre.date_fin,
        date_fin: updatelivre.date_fin,
        langue: updatelivre.langue,
        points_cadeaux: updatelivre.points_cadeaux,
        list_livre: updatelivre.list_livre,
      },
    },
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else res.json({ success: true });
    }
  );
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

router.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  Livre.findByIdAndDelete(id, function (err) {
    if (err) return next(err);
    res.send({ success: true });
  });
});

module.exports = router;

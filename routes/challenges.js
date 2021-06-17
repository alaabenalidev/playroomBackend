const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
var Challenge = require("../models/challenge");
const Child = require("../models/child")

router.post("/add", (req, res) => {
  let date_fin = new Date(req.body.date_fin);
  let challenge = new Challenge({
    title: req.body.title,
    description: req.body.description,
    date_fin: date_fin,
    langue: req.body.langue,
    points_cadeaux: req.body.points_cadeaux,
  });
  Challenge.addChallenge(challenge, (err, challenge) => {
    if (err) {
      console.log(err);
      res.json({ success: false, msg: "Failed to add Challenge" });
    } else {
      res.json({ success: true, challenge: challenge });
    }
  });
});

router.post("/addparticipant", function (req, res) {
  let challengeId = req.body.challengeId;
  let userId = req.body.idUser;
  let bookId = req.body.idBook;
  Challenge.addParticipant(
    { userId, bookId, challengeId },
    function (err, participe) {
      if ((participe = false)) res.send({ success: false });
      res.send({ success: true });
    }
  );
});

router.post("/setwinner", function (req, res) {
  let userId = req.body.idUser;
  let challengeId = req.body.challengeId;
  Challenge.setWinner({ userId, challengeId }, function (err, winner) {
    if ((participe = false)) {
      res.send({ success: false });
    } else {
      Child.addPoints(
        { id_user: req.body.idUser, point_fidelite: req.body.points_cadeaux },
        (err, data) => {
          if (err) {
            console.log(err);
            res.json({ success: false, msg: "Failed to add livre" });
          } else res.json({ success: true, livre: livre });
        }
      );
      res.send({ success: true });
    }
  });
});

router.get("/", function (req, res) {
  Challenge.find({})
    .populate("list_livre._id_livre")
    .populate("winner")
    .exec(function (err, challenges) {
      res.send({ challenges: challenges });
    });
});

router.get("/participated/:memberId", function (req, res) {
  Challenge.find(
    { "list_livre._id_user": req.params.memberId },
    function (err, challenges) {
      res.send({ challenges: challenges });
    }
  );
});

router.get("/search/:input", function (req, res) {
  Challenge.find(
    { title: { $regex: req.params.input, $options: "i" } },
    function (err, challenges) {
      err
        ? res.send({ success: false, challenges: [] })
        : challenges.length == 0
        ? res.send({ success: false, challenges: [] })
        : res.send({ success: true, challenges: challenges });
    }
  );
});

router.get("/getchallengebyid/:id", function (req, res) {
  let id = req.params.id;
  Challenge.find({ _id: id }, function (err, challenge) {
    err
      ? res.send({ success: false, challenge: challenge })
      : res.send({ success: true, challenge: challenge });
  });
});

router.post("/getnoticeuser", function (req, res) {
  Notice.find(
    {
      _id: {
        $in: req.body,
      },
    },
    function (err, notices) {
      res.send(notices);
    }
  );
});

router.put("/update", function (req, res) {
  let updateChallenge = new Notice(req.body);
  Challenge.findOneAndUpdate(
    { _id: updateChallenge._id },
    {
      $set: {
        title: updateChallenge.notice_title,
        description: updateChallenge.description,
        date_fin: updateChallenge.date_fin,
        langue: updateChallenge.langue,
        points_cadeaux: updateChallenge.points_cadeaux,
        list_livre: updateChallenge.list_livre,
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
  Challenge.findByIdAndDelete(id, function (err) {
    if (err) return next(err);
    res.send({ success: true });
  });
});

module.exports = router;

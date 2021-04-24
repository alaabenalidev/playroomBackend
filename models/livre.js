var mongoose = require("mongoose");

var livreSchema = mongoose.Schema(
  {
    child_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Users",
    },
    title: { type: String, require: true },
    description: { type: String, require: true },
    auteur: { type: String, require: true },
    language: { type: String, require: true },
    avis: [
      {
        _id_user: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          unique: true,
          ref: "Users",
        },
        date_commit: { type: Date, default: Date.now() },
        rate: { type: Number, require: true },
      },
    ],
    file_pdf: { type: String, require: true },
    video: String,
    quizs: [
      {
        question: { type: String, require: true },
        suggestion: [{ type: String, require: true }],
        correct_answer: { type: Number, require: true },
      },
    ],
  },
  { timestamps: true }
);

var Livre = (module.exports = mongoose.model("Livres", livreSchema));

module.exports.addLivre = function (newLivre, callback) {
  newLivre.save(callback);
};

module.exports.updateLivre = function (livre, callback) {
  Livre.findOneAndUpdate(
    { _id: livre._id },
    {
      $set: {
        notice_title: notice.notice_title,
        notice_content: notice.notice_content,
        notice_links: notice.notice_links,
      },
    },
    { new: true, safe: true, upsert: true },
    (err, res) => {
      res.send(res.json());
    }
  );
};

module.exports.removeLivre = function (livre, callback) {
  Livre.findOneAndDelete({ _id: livre }, (err, res) => {
    if (err) res.json({ success: false, message: "Livre not deleted!" });
    else res.json({ success: true, message: "Livre deleted!" });
  });
};

module.exports.getLivreByID = function (id, callback) {
  Notice.find({ _id: id }, (err, res) => res.send(res.json()));
};

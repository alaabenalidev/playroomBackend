/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

// Validate Function to check post title length
let titleLengthChecker = (title) => {
  // Check if post title exists
  if (!title) {
    return false; // Return error
  } else {
    // Check the length of title
    if (title.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid title
    }
  }
};

// Validate Function to check if valid title format
let alphaNumericTitleChecker = (title) => {
  // Check if title exists
  if (!title) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid title
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(title); // Return regular expression test results (true or false)
  }
};

// Array of Title Validators
const titleValidators = [
  // First Title Validator
  {
    validator: titleLengthChecker,
    message: 'Title must be more than 5 characters but no more than 50'
  },
  // Second Title Validator
  // {
  //   validator: alphaNumericTitleChecker,
  //   message: 'Title must be alphanumeric'
  // }
];

// Validate Function to check body length
let bodyLengthChecker = (body) => {
  // Check if body exists
  if (!body) {
    return false; // Return error
  } else {
    // Check length of body
    if (body.length < 5 || body.length > 500) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid body
    }
  }
};

// Array of Body validators
const bodyValidators = [
  // First Body validator
  {
    validator: bodyLengthChecker,
    message: 'Body must be more than 5 characters but no more than 500.'
  }
];

// Validate Function to check comment length
let commentLengthChecker = (comment) => {
  // Check if comment exists
  if (!comment[0]) {
    return false; // Return error
  } else {
    // Check comment length
    if (comment[0].length < 1 || comment[0].length > 200) {
      return false; // Return error if comment length requirement is not met
    } else {
      return true; // Return comment as valid
    }
  }
};

// Array of Comment validators
const commentValidators = [
  // First comment validator
  {
    validator: commentLengthChecker,
    message: 'Comments may not exceed 200 characters.'
  }
];

// Post Model Definition
const PostSchema = new Schema({
  title: { type: String, default:'',validator: titleLengthChecker},
  banner:{ type: Buffer, default: null},
  body: { type: String,default:'' },
  url:{type: String,default:''},
  post_owner: { type: mongoose.Schema.Types.ObjectId, ref:'Users',require:true },
  likes: { type: Number, default: 0 },
  likedBy: [{type: mongoose.Schema.Types.ObjectId, ref:'Users'}],
  comments: [{
    comment: { type: String, validate: commentValidators },
    commentator: { type: mongoose.Schema.Types.ObjectId, ref:'Users',require:true },
    date:{ type: Date, default: Date.now()}
  }]
},{
  timestamps: true
});

// Export Module/Schema
module.exports = mongoose.model('Posts', PostSchema);

// Add new Post

module.exports.addPost = (newPost, callback) => {

    newPost.save(callback);

}

// Get Post by URL

module.exports.getPostByID = (search, callback) => {

    Post.findById(search.id, callback);

}


// Update Post
module.exports.postUpdate = (req, callback) => {

    Post.update(

        { _id: req.id },

        {

            $set: {

                url: req.post.url,

                title: req.post.title,

                hero: req.post.hero,

                date: req.post.date,

                category: req.post.category,

                body: req.post.body

            }

        },

        callback

    )
}
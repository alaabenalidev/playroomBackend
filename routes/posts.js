const User = require('../models/user'); // Import User Model Schema
const Post = require('../models/post'); // Import post Model Schema
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
/* ===============================================================
   CREATE NEW post
=============================================================== */
router.post('/newpost', async (req, res) => {
    console.log(await req.body.file)
    // Check if post title was provided
    if (!req.body.title && !req.body.body && await !req.body.banner) {
        res.json({
            success: false,
            message: 'post title is required.'
        }); // Return error message
    } else {
        // Check if post body was provided
        if (!req.body.body) {
            res.json({
                success: false,
                message: 'post body is required.'
            }); // Return error message
        } else {
            // Check if post's creator was provided
            if (!req.body.user) {
                res.json({
                    success: false,
                    message: 'post creator is required.'
                }); // Return error
            } else {
                // Create the post object for insertion into database
                const post = new Post({
                    title: req.body.title, // Title field
                    body: req.body.body, // Body field
                    post_owner: req.body.user, // CreatedBy field
                    banner: req.body.banner,
                    url: req.body.url
                });
                // Save post into database
                post.save((err, post) => {
                    // Check if error
                    if (err) {
                        // Check if error is a validation error
                        if (err.errors) {
                            // Check if validation error is in the title field
                            if (err.errors.title) {
                                res.json({
                                    success: false,
                                    message: err.errors.title.message
                                }); // Return error message
                            } else {
                                // Check if validation error is in the body field
                                if (err.errors.body) {
                                    res.json({
                                        success: false,
                                        message: err.errors.body.message
                                    }); // Return error message
                                } else {
                                    res.json({
                                        success: false,
                                        message: err
                                    }); // Return general error message
                                }
                            }
                        } else {
                            res.json({
                                success: false,
                                message: err
                            }); // Return general error message
                        }
                    } else {
                        res.json({
                            success: true,
                            post: post,
                            message: 'Post saved!'
                        }); // Return success message
                    }
                });
            }
        }
    }
});

/* ===============================================================
   GET ALL postS
=============================================================== */
router.get('/allposts', (req, res) => {
    // Search database for all post posts
    post.find({}, (err, posts) => {
        // Check if error was found or not
        if (err) {
            res.json({
                success: false,
                message: err
            }); // Return error message
        } else {
            // Check if posts were found in database
            if (!posts) {
                res.json({
                    success: false,
                    message: 'No posts found.'
                }); // Return error of no posts found
            } else {
                res.json({
                    success: true,
                    posts: posts
                }); // Return success and posts array
            }
        }
    }).sort({
        '_id': -1
    }); // Sort posts from newest to oldest
});

/* ===============================================================
   GET SINGLE post
=============================================================== */
router.get('/singlepost/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
        res.json({
            success: false,
            message: 'No post ID was provided.'
        }); // Return error message
    } else {
        // Check if the post id is found in database
        Post.findOne({
            _id: req.params.id
        }, (err, post) => {
            // Check if the id is a valid ID
            if (err) {
                res.json({
                    success: false,
                    message: 'Not a valid post id'
                }); // Return error message
            } else {
                // Check if post was found by id
                if (!post) {
                    res.json({
                        success: false,
                        message: 'Post not found.'
                    }); // Return error message
                } else {
                    res.json({
                        success: true,
                        post: post
                    }); // Return success

                }
            }
        });
    }
});

/* ===============================================================
   GET comment post
=============================================================== */
router.get('/commentpost/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
        res.json({
            success: false,
            message: 'No post ID was provided.'
        }); // Return error message
    } else {
        // Check if the post id is found in database
        Post.findOne({
            _id: req.params.id
        }, (err, post) => {
            // Check if the id is a valid ID
            if (err) {
                res.json({
                    success: false,
                    message: 'Not a valid post id'
                }); // Return error message
            } else {
                // Check if post was found by id
                if (!post) {
                    res.json({
                        success: false,
                        message: 'Post not found.'
                    }); // Return error message
                } else {
                    res.json({
                        success: true,
                        comments: post.comments
                    }); // Return success

                }
            }
        }).populate('comments.commentator');
    }
});

/* ===============================================================
   UPDATE post POST
=============================================================== */
router.put('/updatepost', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
        res.json({
            success: false,
            message: 'No post id provided'
        }); // Return error message
    } else {
        // Check if id exists in database
        Post.findOne({
            _id: req.body._id
        }, (err, post) => {
            // Check if id is a valid ID
            if (err) {
                res.json({
                    success: false,
                    message: 'Not a valid post id'
                }); // Return error message
            } else {
                // Check if id was found in the database
                if (!post) {
                    res.json({
                        success: false,
                        message: 'post id was not found.'
                    }); // Return error message
                } else {
                    // Check who user is that is requesting post update
                    User.findOne({
                        _id: req.body.post_owner
                    }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            }); // Return error message
                        } else {
                            // Check if user was found in the database
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'Unable to authenticate user.'
                                }); // Return error message
                            } else {
                                    post.title = req.body.title; // Save latest post title
                                    post.body = req.body.body; // Save latest body
                                    post.url = req.body.url
                                    post.save((err) => {
                                        if (err) {
                                            if (err.errors) {
                                                res.json({
                                                    success: false,
                                                    message: 'Please ensure form is filled out properly'
                                                });
                                            } else {
                                                res.json({
                                                    success: false,
                                                    message: err
                                                }); // Return error message
                                            }
                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'post Updated!'
                                            }); // Return success message
                                        }
                                    });
                            }
                        }
                    });
                }
            }
        });
    }
});


/* ===============================================================
   UPDATE post POST
=============================================================== */
router.put('/updatecomment', (req, res) => {
    console.log(req.body)
    // Check if id was provided
    if (!req.body._id) {
        res.json({
            success: false,
            message: 'No comment id provided'
        }); // Return error message
    } else {
        // Check if id exists in database
        Post.findOne({
            'comments._id':req.body._id
        }, (err, post) => {
            // Check if id is a valid ID
            if (err) {
                res.json({
                    success: false,
                    message: 'Not a valid post id'
                }); // Return error message
            } else {
                // Check if id was found in the database
                if (!post) {
                    res.json({
                        success: false,
                        message: 'post id was not found.'
                    }); // Return error message
                } else {
                    // Check who user is that is requesting post update
                    User.findOne({
                        _id: req.body.commentator._id
                    }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            }); // Return error message
                        } else {
                            // Check if user was found in the database
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'Unable to authenticate user.'
                                }); // Return error message
                            } else {
                                    post.comments.comment = req.body.comment; // Save latest post title
                                    post.save((err) => {
                                        if (err) {
                                            if (err.errors) {
                                                res.json({
                                                    success: false,
                                                    message: 'Please ensure form is filled out properly'
                                                });
                                            } else {
                                                res.json({
                                                    success: false,
                                                    message: err
                                                }); // Return error message
                                            }
                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'post Updated!'
                                            }); // Return success message
                                        }
                                    });
                            }
                        }
                    });
                }
            }
        });
    }
});

/* ===============================================================
   DELETE post POST
=============================================================== */
router.delete('/deletepost/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
        res.json({
            success: false,
            message: 'No id provided'
        }); // Return error message
    } else {
        // Check if id is found in database
        post.findOne({
            _id: req.params.id
        }, (err, post) => {
            // Check if error was found
            if (err) {
                res.json({
                    success: false,
                    message: 'Invalid id'
                }); // Return error message
            } else {
                // Check if post was found in database
                if (!post) {
                    res.json({
                        success: false,
                        messasge: 'post was not found'
                    }); // Return error message
                } else {
                    // Get info on user who is attempting to delete post
                    User.findOne({
                        _id: req.body.userId
                    }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            }); // Return error message
                        } else {
                            // Check if user's id was found in database
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'Unable to authenticate user.'
                                }); // Return error message
                            } else {
                                // Check if user attempting to delete post is the same user who originally posted the post
                                if (user._id !== post.post_owner) {
                                    res.json({
                                        success: false,
                                        message: 'You are not authorized to delete this post post'
                                    }); // Return error message
                                } else {
                                    // Remove the post from database
                                    post.remove((err) => {
                                        if (err) {
                                            res.json({
                                                success: false,
                                                message: err
                                            }); // Return error message
                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'post deleted!'
                                            }); // Return success message
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});

/* ===============================================================
   LIKE post POST
=============================================================== */
router.put('/likepost', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body._id) {
        res.json({
            success: false,
            message: 'No id was provided.'
        }); // Return error message
    } else {
        // Search the database with id
        Post.findOne({
            _id: req.body._id
        }, (err, post) => {
            // Check if error was encountered
            if (err) {
                res.json({
                    success: false,
                    message: 'Invalid post id'
                }); // Return error message
            } else {
                // Check if id matched the id of a post post in the database
                if (!post) {
                    res.json({
                        success: false,
                        message: 'That post was not found.'
                    }); // Return error message
                } else {
                    // Get data from user that is signed in
                    User.findOne({
                        _id: req.body.userId
                    }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({
                                success: false,
                                message: 'Something went wrong.'
                            }); // Return error message
                        } else {
                            // Check if id of user in session was found in the database
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'Could not authenticate user.'
                                }); // Return error message
                            } else {
                                // Check if the user who liked the post has already liked the post post before
                                if (post.likedBy.includes(user._id)) {
                                    res.json({
                                        success: false,
                                        message: 'You already liked this post.'
                                    }); // Return error message
                                } else {
                                    // Check if user who liked post has previously disliked a post
                                    post.likes++; // Incriment likes
                                    post.likedBy.push(user._id); // Add liker's username into array of likedBy
                                    // Save post post
                                    post.save((err) => {
                                        if (err) {
                                            res.json({
                                                success: false,
                                                message: 'Something went wrong.'
                                            }); // Return error message
                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'post liked!'
                                            }); // Return success message
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});

/* ===============================================================
   DISLIKE post POST
=============================================================== */
router.put('/dislikepost', (req, res) => {
    // Check if id was provided inside the request body
    if (!req.body._id) {
        res.json({
            success: false,
            message: 'No id was provided.'
        }); // Return error message
    } else {
        // Search database for post post using the id
        Post.findOne({
            _id: req.body._id
        }, (err, post) => {
            // Check if error was found
            if (err) {
                res.json({
                    success: false,
                    message: 'Invalid post id'
                }); // Return error message
            } else {
                // Check if post post with the id was found in the database
                if (!post) {
                    res.json({
                        success: false,
                        message: 'That post was not found.'
                    }); // Return error message
                } else {
                    // Get data of user who is logged in
                    User.findOne({
                        _id: req.body.userId
                    }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({
                                success: false,
                                message: 'Something went wrong.'
                            }); // Return error message
                        } else {
                            // Check if user was found in the database
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'Could not authenticate user.'
                                }); // Return error message
                            } else {
                                // Check if user has previous disliked this post
                                if (post.likedBy.includes(user._id)) {
                                    post.likes--; // Decrease likes by one
                                    const arrayIndex = post.likedBy.indexOf(user._id); // Check where username is inside of the array
                                    post.likedBy.splice(arrayIndex, 1); // Remove username from index
                                    // Save post data
                                    post.save((err) => {
                                        // Check if error was found
                                        if (err) {
                                            res.json({
                                                success: false,
                                                message: 'Something went wrong.'
                                            }); // Return error message
                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'post disliked!'
                                            }); // Return success message
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});

/* ===============================================================
   COMMENT ON post POST
=============================================================== */
router.post('/comment', (req, res) => {
    // Check if comment was provided in request body
    if (!req.body.comment) {
        res.json({
            success: false,
            message: 'No comment provided'
        }); // Return error message
    } else {
        // Check if id was provided in request body
        if (!req.body._id) {
            res.json({
                success: false,
                message: 'No id was provided'
            }); // Return error message
        } else {
            // Use id to search for post post in database
            Post.findOne({
                _id: req.body._id
            }, (err, post) => {
                // Check if error was found
                if (err) {
                    res.json({
                        success: false,
                        message: 'Invalid post id'
                    }); // Return error message
                } else {
                    // Check if id matched the id of any post post in the database
                    if (!post) {
                        res.json({
                            success: false,
                            message: 'post not found.'
                        }); // Return error message
                    } else {
                        // Grab data of user that is logged in
                        User.findOne({
                            _id: req.body.userId
                        }, (err, user) => {
                            // Check if error was found
                            if (err) {
                                res.json({
                                    success: false,
                                    message: 'Something went wrong'
                                }); // Return error message
                            } else {
                                // Check if user was found in the database
                                if (!user) {
                                    res.json({
                                        success: false,
                                        message: 'User not found.'
                                    }); // Return error message
                                } else {
                                    // Add the new comment to the post post's array
                                    post.comments.push({
                                        comment: req.body.comment, // Comment field
                                        commentator: req.body.userId // Person who commented
                                    });
                                    // Save post post
                                    post.save((err,result) => {
                                        // Check if error was found
                                        if (err) {
                                            res.json({
                                                success: false,
                                                message: 'Something went wrong.'
                                            }); // Return error message
                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'Comment saved',
                                            }); // Return success message
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    }
});

module.exports = router;
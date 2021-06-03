const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
const { 
  logger,
  validateUserId,
  validateUser,
  validatePost
} = require('../middleware/middleware');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', logger, (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.json(users)
    })
    .catch(next)
});

router.get('/:id', logger, validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', logger, validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.user)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
});

router.put('/:id', logger, validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.user)
    .then(update => {
      Users.getById(req.params.id)
        .then(updatedUser => {
          res.status(200).json(updatedUser)
        })
        .catch(next)
    })
    .catch(next)
});

router.delete('/:id', logger, validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.getById(req.user.id)
    .then(findDeleted => {
      Users.remove(req.user.id)
        .then(user => {
          res.status(200).json(findDeleted)
        })
        .catch(next)
    })
    .catch(next)
});

router.get('/:id/posts', logger, validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(next);
});

router.post('/:id/posts', logger, validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Posts.insert(req.post)
    .then(post => {
      res.json(post)
    })
    .catch(next)
});

// do not forget to export the router
module.exports = router;
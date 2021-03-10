const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model')
const Posts = require('../posts/posts-model');

// The middleware functions also need to be required
const { validateUser, logger, validateUserId, validatePost } = require('../middleware/middleware');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await Users.get(req.body)
    res.json(users)
  } catch (err) {
    next(err)
  }
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, logger, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  
  // try {
  //   const changes = await Users.update(req.params.id, req.body)
  //   res.json(changes)
  // } catch (err) {
  //   next(err)
  // }
  
  Users.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
});

//has a bug where it will delete the user, but the id is hidden somewhere, whenever a post is made, the id index continues to leave off where the last deleted post was on the index.
router.delete('/:id', validateUserId, (req, res, next) => {
  Users.remove(req.params.id)
    .then(() => {
      res.status(200).json({
        message: `User with id ${req.params.id} has been deleted`
      })
    })
    .catch(next)
});

router.get("/:id/posts", validateUserId, (req, res, next) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      next(error);
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  const messageInfo = { user_id: req.params.id, ...req.body };

  Posts.insert(messageInfo)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      next(error);
    });
});



module.exports = router

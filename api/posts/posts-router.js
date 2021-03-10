const express = require('express')

const Posts = require('./posts-model')
const validatePost = require('../middleware/middleware')

const router = express.Router()

router.get('/', (req, res, next) => {
  Posts.get()
    .then(post => {
      res.status(200).json(post)
    })
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  Posts.getById(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(next)
})

router.use((error, req, res, next) => {
  res.status(500).json({
    info: "Error occured inside postsRouter",
    message: error.message,
    stack: error.stack,
  });
});





module.exports = router
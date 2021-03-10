const express = require('express');

const server = express();

server.use(express.json())

// global middlewares and the user's router need to be connected here
const userRouter = require('./users/users-router')
server.use('/api/users', userRouter)

const postRouter = require('./posts/posts-router')
server.use('/api/posts', postRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
    custom: 'something went terrible in general',
  })
})

module.exports = server;

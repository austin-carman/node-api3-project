const Users = require('../users/users-model');

function logger(req, res, next) {
  console.log('logger->', 'method:', [req.method], 'url:', req.path, 'timestamp:', Date.now());
  next()
}

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if(!user) {
        res.status(404).json({ message: "user not found" })
      } else {
          req.user = user
          next()
      }
    })
    .catch(next);
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if(!name) {
    next({
      message: "missing required name field",
      status: 400
    })
  } else {
    req.user = { name: req.body.name.trim() }
    next()
  }

}

function validatePost(req, res, next) {
  const { text } = req.body;
  if(!text) { 
    next({
      message: "missing required text field",
      status: 400
    })
  } else {
    req.post = { text: req.body.text.trim(), user_id: req.params.id} 
    next()
  }
}

// do not forget to export these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}

const express = require('express'); 
const router = express.Router(); 

//importing in User Model 
const User = require('./models').User;

//importing middleware for handler & authentication
const {asyncHandler} = require('../middleware/async-handler'); 
const { authenticateUser } = require('../middleware/auth-user'); 


router.get('/users',authenticateUser, asyncHandler(async (req,res) => {
    const user = req.currentUser;
    res.json(user); 
})); 

router.post('/users', asyncHandler(async(req, res) => {
    try {
        await User.create(req.body);
        res.status(201).location('/').end(); 
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });
        } else {
          throw error;
        }
      }
})); 

module.exports = router; 
const express = require('express'); 
const router = express.Router(); 

//importing in User Model 
const User = require('../models').User;

//importing middleware for handler & authentication
const { asyncHandler } = require('../middleware/async-handler'); 
const { authenticateUser } = require('../middleware/auth-user'); 


//Route that returns all props & values associated with authenticated users
router.get('/users',authenticateUser, asyncHandler(async (req,res) => {
    const user = req.currentUser;

    res.json({ 
      id: user.id, 
      emailAddress: user.emailAddress, 
      firstName: user.firstName, 
      lastName: user.lastName, 
    }); 

    //checking to see if all users with be returned without authentication
    // const user = await User.findAll({
    //   attributes: [
    //     "id", 
    //     "firstName", 
    //     "lastName",
    //     "emailAddress", 
    //     "password"
    //   ]
    // }); 
    // res.json(user); 
})); 

//Route that creates a new user
router.post('/users', async(req, res) => {
try{
  const user = await User.create(req.body);   
    res.status(201)
      .location("/")
      .end(); 

  } catch (error) {

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error; 
    }
  }
}); 

module.exports = router; 
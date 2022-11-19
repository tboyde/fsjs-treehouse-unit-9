const express = require('express'); 
const router = express.Router(); 

//importing Course model 
const Course = require('../models').Course; 
const User = require('../models').User; 

//importing middleware for handler & authentication
const {asyncHandler} = require('../middleware/async-handler'); 
const { authenticateUser } = require('../middleware/auth-user'); 

router.get('/courses', asyncHandler(async(req,res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User, 
        as: 'user', 
      }
    ]
  })
  res.json(courses)
    .status(200); 

})); 

router.get('/courses/:id ', asyncHandler(async(req,res) => {
  try {
    const courses = await Course.create(req.body); 
    res.status(200)
      .location(`/courses/${course.id}`)
      .end(); 
      
  } catch (error){
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
  } else {
    throw error; 
  }
}
}));

router.post('/courses', ); 

router.put('/courses/:id', ); 

router.delete('/courses/:id', )




module.exports = router; 
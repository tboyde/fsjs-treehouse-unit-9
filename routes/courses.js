const express = require('express'); 
const router = express.Router(); 

//importing User & Course model 
const { User , Course } = require('../models'); 

//importing middle}ware for handler & authentication
const {asyncHandler} = require('../middleware/async-handler'); 
const { authenticateUser } = require('../middleware/auth-user'); 

//Route that returnes all the courses and users associated with each course
router.get('/courses', asyncHandler(async(req,res) => {
  const courses = await Course.findAll({
    attributes: [
      'id', 
      'title', 
      'description', 
      'estimatedTime', 
      'materialsNeeded', 
    ], 
    include: [
      {
        model: User, 
        as: 'courseOwner',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'], 
      }
    ]
  })
  res.json(courses)
    .status(200); 
})); 

//Route that responds course that corresponds with id parameter and the user assocaited with that course
router.get('/courses/:id', asyncHandler(async(req,res, next) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: [
      'id', 
      'title', 
      'description', 
      'estimatedTime', 
      'materialsNeeded', 
    ], 
    include: [
      {
        model: User, 
        as: 'courseOwner', 
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'], 
      }
    ]
  }); 
  res.json(course); 
}));

//Route that creates a new course 
router.post('/courses', authenticateUser, async(req, res)=> {
  try {
    const user = req.currentUser;

    const course = await Course.create({
      title: req.body.title, 
      description: req.body.description, 
      estimatedTime: req.body.estimatedTime, 
      materialsNeeded: req.body.materialsNeeded, 
      userId: user.id, 
    }); 

    res.status(201)
      .location(`courses/${course.id}`)
      .end(); 

  } catch (error){
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error; 
    }
  }
}); 

//Route that updates a selected course
router.put('/courses/:id', authenticateUser, async(req, res) => {
  try {
    const user = req.currentUser; 
    const course = await Course.findByPk(req.params.id); 
    if (course.userId === user.id){
      await course.update(req.body)
      res.status(204).end()
    } else {
      res.status(403)
        .json({message: `Access Denied: ${course.title} can only be updated by the course owner.`})
        .end(); 
    }
  } catch(error){
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error; 
    }
  }
}); 

//Route that deletes a selected course
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const user = req.currentUser; 
  const course = await Course.findByPk(req.params.id); 

  if (course.userId === user.id){
    await course.destroy()
    res.status(204).end()
  } else {
    res.status(403)
      .json({message: `Forbidden: ${course.title} can only be deleted by the course owner.`})
      .end()
  }
})); 

module.exports = router; 
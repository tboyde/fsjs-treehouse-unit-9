
const express = require('express'); 
const router = express.Router(); 

// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

router.get('/users', (req,res) => {
    res.json({
        message: 'You just requested the user data!',
      });
}); 

// router.post('/users', (req, res) => {
//     res.json({
//         message: 'You just !',
//       });
// })

module.exports = router; 
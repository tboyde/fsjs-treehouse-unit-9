'use strict'; 

//importing basic-auth module,  & User model
const auth = require('basic-auth');
const bcrypt = require('bcrypt'); 
const User  = require('../models').User; 


exports.authenticateUser = async (req, res, next) => {
    let message; 

    // Parsing user credentials from the Authorization header
    const credentials = auth(req); 

    //If the user credientals are available
    if (credentials){
    //try to retrieve user data by username
    const user = await User.findOne({ where: { emailAddress: credentials.name}}); 
        if (user){
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated){
                console.log(`Authentication for ${user.emailAddress} successful!`); 
                
                //stores users request object
                req.currentUser = user; 
            } else {
                message = `Sorry, authentication failed for user associated with ${user.emailAddress}`;
            }
        } else {
            message = `User information was not successfully retrieved. Information received is not associated with an account`;
        }
    } else {
        message = 'Auth header not found';
    }
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
      } else {
        next();
    }
}
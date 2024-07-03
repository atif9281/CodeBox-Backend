const jwt = require('jsonwebtoken');
const prisma = require('../models/prismaClient'); // Assuming prismaClient is correctly configured

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };
  
  const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    // Calculate cookie expiration time
    const cookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN || 90; // Default to 90 days if env variable is not set
    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000), // Convert days to milliseconds
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    // Remove sensitive data from user object
    const { password, ...userData } = user;

    res.status(statusCode).json({ status: 'success', token, data: { user: userData } });
};
  
  exports.signup = async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
  
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
  
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email address is already in use.'
        });
      }
  
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password, // Ensure you handle password hashing
          // passwordConfirm // Ensure you validate and handle password confirmation
        }
      });
  
      // Send JWT token
      createSendToken(newUser, 201, res);
  
      // Optionally redirect user after successful signup
      // res.redirect(url);
      // console.log('Send token sent', url);
  
    } catch (error) {
      next(error); // Handle errors appropriately
    }
  };
  
  exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // User not found
            return res.status(401).json({ status: 'error', message: 'Incorrect email or password' });
        }

        const passwordsMatch = (user.password === password); 
        if (!passwordsMatch) {
            return res.status(401).json({ status: 'error', message: 'Incorrect email or password' });
        }

        // Send JWT token if login successful
        createSendToken(user, 200, res);

    } catch (error) {
        next(error); // Forward error to error handling middleware
    }
};
  
  exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' , message : 'cookies cleared successfully!' });
  };
  
  
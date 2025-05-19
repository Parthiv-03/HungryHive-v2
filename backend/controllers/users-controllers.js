const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUsers = async (req, res, next) => {
  const userid = req.params.userid;

  if(!userid){
      let users;
      try {
        users = await User.find({}, '-password');
      } catch (err) {
        const error = new HttpError(
          'Fetching users failed, please try again later.',
          500
        );
        return next(error);
      }
      res.json({users: users.map(user => user.toObject({ getters: true }))});
  }
  else{
      try {
        orders = await User.findById(userid);
      } catch (err) {
        const error = new HttpError(
            'Fetching ordre failed, please try again later.',
            500
        );
        return next(error);
      }
    res.json({orders: orders.toObject()});
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({message: 'Logged in!',userid: existingUser._id});
};

const checkuser = async (req,res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        exists: true,
        userId: existingUser._id
      });
    } else {
      return res.status(200).json({
        exists: false
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).json({
      message: 'Error checking user'
    });
  }
};


const createUser = async (req, res) => {
  const { email, name} = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(201).json({
        user: existingUser,
        message: 'User Found successfully'
      });
    }

    // Create a new user
    const newUser = new User({
      name: name || 'User', // Default to 'Unknown' if no name is provided
      email,
    });

    // Save the user in the database
    await newUser.save();

    return res.status(201).json({
      user: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      message: 'Error creating user'
    });
  }
};

const updateUser = async (req,res) => {
  const userId = req.params.id;
  const { name, email, phone_number, address } = req.body.profile; 

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone_number,
        address,
      },
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: updatedUser.toObject({ getters: true }) });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
}

// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST endpoint to send OTP
const getOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  // Generate 6-digit OTP
  const otp = generateOTP();

  // Create reusable transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
      },
  });

  // Email content
const mailOptions = {
  from: `"HungryHive OTP Service" <${process.env.EMAIL_USER}>`,  
  to: email,
  subject: "Your HungryHive OTP Code",  // Changed subject
  html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2 style="color: #FFA500;">Welcome to HungryHive!</h2>
          <p>Thank you for using our food ordering service.</p>
          <p>Your OTP code is:</p>
          <h3 style="color: #FF6347;"><b>${otp}</b></h3>
          <p>Please use this OTP to complete your verification and start ordering delicious food!</p>
          <br>
          <footer style="color: #888;">
              <p>HungryHive Team</p>
              <p>Your trusted Food ordering system</p>
          </footer>
      </div>
  `, // Updated HTML content
};


  try {
      // Send mail with defined transport object
      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: 'OTP sent successfully', otp });
  } catch (error) {
      return res.status(500).json({ error: 'Failed to send OTP', details: error.toString() });
  }
};


exports.getUsers = getUsers;
exports.login = login;

exports.createUser= createUser;
exports.updateUser= updateUser;
exports.getOTP = getOTP;
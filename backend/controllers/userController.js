const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendOtpEmail = require("../utils/sendEmail.js")
const {Booking} =require("../models/bookingModel.js");
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// 🔐 Register (only superadmin can create other users)
exports.registerUser = async (req, res) => {
  try {

    const { name, email,phoneNo, password, role} = req.body;
    console.log(email)
    console.log(role);
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNo,
    });
     await newUser.save();

    res.status(201).json({ message: 'User created successfully',newUser });

  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// 🔐 Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email ' });
    }

    const passMatched = await bcrypt.compare(password, user.password);

    if (!passMatched) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};



exports.logoutUser = (req, res) => {
  res.clearCookie('token'); // If using cookies
  res.status(200).json({ message: 'Logged out successfully' });
};




// 4. Get logged-in user’s profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// 5. Admin gets all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};



// 6. Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

exports.updateImage = async (req, res) => {
  const profileImage = req.file.path;
  if (!profileImage) {
    throw new ApiError(400, " profileImage is not found")
  }
  const uploadedImage = await uploadOnCloudinary(profileImage)
  if (!uploadedImage.url) {
    throw new ApiError(500, " profileImage uploaded url missing")
  }

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    {
      $set:
      {
        avatar: uploadedImage.url
      }
    },
    {
      new: true
    }).select("-password")
  user.save()
  res
    .status(200)
    .json( user, "avatar image update successfully")
}



exports.sendOtpForPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    await sendOtpEmail({ email: user.email, name: user.name, otp });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

exports.verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword; // hashed with pre-save
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during reset' });
  }
};

exports.getUserDashboard = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id });
  res.json({
    success: true,
    data: {
      stats: {
        totalBookings: bookings.length,
        upcomingEvents: bookings.filter((b) => new Date(b.createdAt) > new Date()).length,
        averageRating: 4.8, // placeholder
      },
      upcomingBookings: bookings.slice(0, 3),
    },
  });
};

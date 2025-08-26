const User = require('../Models/user.models.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signinController = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        const error = new Error("All fields are required")
        error.statusCode = 400
        throw error
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const generateToken = (userId) => {
            return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION || '1d'
            })
        }

        res.status(200).json({
            message: "Login successful",
            user,
            token: generateToken(user._id)
        })
    } catch (error) {
        console.error('Error during sign-in:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const registerUser = async (req, res, next) => {
  try {
    const { name, password, email, preferences } = req.body;

    if (!name || !email || !password) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        preferences
    });

    if (!user) {
        const error = new Error("User creation failed");
        error.statusCode = 500;
        throw error;
    }

    console.log("User Created Successfully")

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    res.status(201).json({
        message: "User created successfully",
        user: createdUser
    });

    } catch (error) {
        next(error);
    }
};

const logoutController = (req, res) => {
    res.status(200).json({ message: "Logout successful" });
}

module.exports = { signinController, registerUser, logoutController }
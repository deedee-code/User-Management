const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if(!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if(password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userResponse = { ...newUser._doc };
        delete userResponse.password;

        return res.status(201).json({
            message: 'User registered successfully',
            user: userResponse,
            token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userResponse = { ...user._doc };
        delete userResponse.password;

        return res.status(200).json({
            message: 'Welcome to your dashboard page!',
            user: userResponse,
            token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = code;
        user.otpExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP Code',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Password Reset Request</h2>
                <p>Dear User,</p>
                <p>You requested to reset your password. Please use the OTP code below to proceed:</p>
                <div style="font-size: 20px; font-weight: bold; margin: 20px 0; color: #4CAF50;">
                ${code}
                </div>
                <p>This OTP code is valid for <strong>10 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,</p>
                <p><strong>Doris Owoeye</strong></p>
            </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: 'OTP Code sent to your email',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

const verifyOtpAndResetPassword = async (req, res) => {
    const { email, code, newPassword, confirmPassword } = req.body;

    if (!email || !code || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.resetOtp !== code || user.otpExpire < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP Code' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        user.resetOtp = undefined;
        user.otpExpire = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgetPassword,
    verifyOtpAndResetPassword
}
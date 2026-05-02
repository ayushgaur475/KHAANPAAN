import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import nodemailer from "nodemailer";

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    //checking if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists." });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email.",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password.",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getUserInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        res.json({ success: true, name: user.name, coins: user.coins, email: user.email, phone: user.phone, photo: user.photo, bio: user.bio });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const phoneLogin = async (req, res) => {
  const { phone, name } = req.body;
  try {
    let user = await userModel.findOne({ phone });

    if (!user) {
      // Create new user if doesn't exist
      user = new userModel({
        name: name || "User",
        phone: phone,
        email: phone + "@khaanpaan.com", // Dummy email to satisfy any existing logic that expects email
      });
      await user.save();
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await userModel.findOne({ email });
    if (!user) {
      user = new userModel({ name: "User", email });
    }
    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    // Nodemailer configuration (Switched to Brevo for Render compatibility)
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"KHAANPAAN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "KHAANPAAN Login OTP",
      text: `Your OTP for login is: ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #ff4c24;">KHAANPAAN OTP</h2>
          <p>Your OTP for login is: <b style="font-size: 24px; color: #ff4c24;">${otp}</b></p>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `
    };

    console.log(`DEBUG: Attempting to send OTP to ${email}...`);
    await transporter.sendMail(mailOptions);
    console.log(`✅ DEBUG: OTP sent successfully to ${email}`);
    res.json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.error("❌ DEBUG ERROR: OTP Sending Failed:", error.message);
    res.json({ success: false, message: "Error sending OTP." });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await userModel.findOne({ email, otp });

    if (!user || user.otpExpire < new Date()) {
      return res.json({ success: false, message: "Invalid or expired OTP." });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying OTP." });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { name, email, phone, bio } = req.body;
    const userId = req.userId || req.body.userId;
    let updateData = { name, email, phone, bio };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    
    res.json({ 
      success: true, 
      message: "Profile updated successfully", 
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        photo: updatedUser.photo,
        bio: updatedUser.bio,
        coins: updatedUser.coins
      } 
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating profile" });
  }
};

export { loginUser, registerUser, getUserInfo, phoneLogin, sendOtp, verifyOtp, updateUserInfo };

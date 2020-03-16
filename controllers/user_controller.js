const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DeletedUsers = require("../models/DeletedUsers");
const RequestBanRemovalUsers = require("../models/RequestBanRemovalUsers");
const SendOtp = require("sendotp");
const axios = require("axios");
const cloudinary = require("cloudinary");
let {
  messageTemplate,
  email1,
  email2,
  email3,
  email4,
  email5,
  email6,
  email7
} = require("./assets/services");

const sendOtp = new SendOtp(process.env.MSG91_API_KEY, messageTemplate);

require("dotenv").config();

sendVerificationLink = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    if (user.isEmailVerified === true) {
      return res.status(400).json({ message: "Already Verified!" });
    } else {
      let token = Date.now() + user._id + Math.random(10000000000);
      user.verifyEmail.token = token;
      user.verifyEmail.expiresIn = Date.now() + 3600000;
      await user.save();
      await email1(user._id, user.name, email, token);
    }
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

forgetPasswordEmail = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    let token = Date.now() + user._id + Math.random(10000000000);
    user.resetPwd.token = token;
    user.resetPwd.expiresIn = Date.now() + 3600000;
    await user.save();
    await email2(user._id, user.name, email, token);
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

mailToBannedUsers = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    await email3(user.name, email);
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

sendRemoveBanOnRequest = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    let token = Date.now() + user._id + Math.random(10000000000);
    user.verifyEmail.token = token;
    user.verifyEmail.expiresIn = Date.now() + 3600000;
    await user.save();
    await email4(user.name, email, token);
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

sendRemoveBanByAdmin = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    let token = Date.now() + user._id + Math.random(10000000000);
    user.verifyEmail.token = token;
    user.verifyEmail.expiresIn = Date.now() + 3600000;
    await user.save();
    await email5(user.name, email, token);
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

sendRemoveBanOnRequestVerified = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    await email6(user.name, email);
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

sendRemoveBanByAdminVerified = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    await email7(user.name, email);
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

module.exports.register = async (req, res) => {
  let { fname, lname, email, contact, password, cpassword, role } = req.body;
  var name;
  if (lname === "") name = fname;
  else name = fname + " " + lname;
  if (!name || !email || !contact || !password || !role)
    return res.status(400).json({ message: "All fields are mandatory!" });
  let emailRegex = /^\S+@\S+\.\S+/,
    phoneRegex = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/,
    passwordRegex = /^[\S]{8,}/;
  if (emailRegex.test(email)) {
    if (passwordRegex.test(String(password))) {
      if (phoneRegex.test(Number(contact))) {
        let user =
          (await User.findOne({ email })) || (await User.findOne({ contact }));
        if (user) {
          return res
            .status(400)
            .json({ message: "Email or Contact already registered with us!" });
        } else {
          let img = {
            id: process.env.RANDOM_IMG_ID,
            url: process.env.RANDOM_IMG_URL
          };
          let newUser = {
            name,
            email,
            password,
            role,
            contact,
            img
          };
          if (
            (await DeletedUsers.findOne({ email: email })) ||
            (await DeletedUsers.findOne({ contact: contact }))
          ) {
            return res.status(400).json({ message: "Your EmailId is Banned!" });
          }
          const salt = await bcrypt.genSalt(10);
          newUser.password = await bcrypt.hash(newUser.password, salt);
          user = await User.create(newUser);
          (temp = 1), (temp1 = 1);
          try {
            await sendVerificationLink(newUser.email);
          } catch (err) {
            temp = 0;
            console.log(err);
          }
          try {
            await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
              if (data.type === "error") temp1 = 0;
              else {
                user.otpExpiresIn = Date.now() + 600000;
                user.save();
                sendOtp.setOtpExpiry("10"); //in minutes
              }
            });
          } catch (err) {
            console.log(err);
          }
          if (temp === 0) {
            return res.status(400).json({
              success: false,
              message: "Registeration Successful!",
              error: "Verification Email cannot be sent. Login to recieve!"
            });
          } else if (temp1 === 0) {
            return res.status(400).json({
              success: false,
              message: "Registeration Successful!",
              error: "OTP cannot be sent. Login to recieve!"
            });
          } else if (temp === 0 && temp1 === 0) {
            return res.status(400).json({
              success: false,
              message: "Registeration Successful!",
              error:
                "Verification Email & OTP cannot be sent. Login to recieve!"
            });
          } else {
            res.status(200).json({
              success: true,
              message:
                "Registeration Successful! Verify Your Email Address & Mobile Number!"
            });
          }
        }
      } else {
        return res.status(400).json({ message: "Contact number not valid!" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters long!" });
    }
  } else {
    return res.status(400).json({ message: "EmailID is not valid!" });
  }
};

module.exports.login = async (req, res) => {
  let { email, mobile, password } = req.body;
  var user;
  user =
    (await User.findOne({ email: email })) ||
    (await User.findOne({ contact: mobile }));
  let user1 =
    (await DeletedUsers.findOne({ email: email })) ||
    (await DeletedUsers.findOne({ contact: mobile }));
  if (user1) {
    return res.status(401).json({
      success: false,
      message:
        "You are Banned from our services! If you did it accidently or think it's incorrect then you can request our admins to remove ban!"
    });
  }
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Wrong Credentials!" });
  } else if (
    isMatch &&
    user.isEmailVerified === false &&
    user.isContactVerified === false
  ) {
    if (
      user.verifyEmail.expiresIn >= Date.now() &&
      user.otpExpiresIn >= Date.now()
    ) {
      return res.status(401).json({
        success: false,
        message: "Verify your EmailID & your Mobile Number!"
      });
    } else if (user.verifyEmail.expiresIn < Date.now()) {
      await sendVerificationLink(user.email);
      return res.status(401).json({
        success: false,
        message: "Verify your EmailID Now!"
      });
    } else if (user.otpExpiresIn < Date.now()) {
      await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
        user.otpExpiresIn = Date.now() + 600000;
        user.save();
        sendOtp.setOtpExpiry("10"); //in minutes
      });
      return res.status(401).json({
        success: false,
        message: "Verify your Mobile No. Now!"
      });
    } else {
      await sendVerificationLink(user.email);
      await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
        user.otpExpiresIn = Date.now() + 600000;
        user.save();
        sendOtp.setOtpExpiry("10"); //in minutes
      });
      return res.status(401).json({
        success: false,
        message: "Verify your EmailID & your Mobile Number now!"
      });
    }
  } else if (isMatch && user.isContactVerified === false) {
    if (user.otpExpiresIn >= Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Verify your Mobile No.!" });
    } else {
      await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
        user.otpExpiresIn = Date.now() + 600000;
        user.save();
        sendOtp.setOtpExpiry("10"); //in minutes
      });
      return res
        .status(401)
        .json({ success: false, message: "Verify your Mobile No. now!" });
    }
  } else if (isMatch && user.isEmailVerified === false) {
    if (user.verifyEmail.expiresIn >= Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID!" });
    } else {
      await sendVerificationLink(user.email);
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID now!" });
    }
  } else {
    if (user.resetPwd.token) {
      user.resetPwd.token = undefined;
      user.resetPwd.expiresIn = undefined;
      user.save();
    }
    const token = jwt.sign(
      {
        type: "user",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          role: user.role
        }
      },
      process.env.secret,
      {
        expiresIn: 604800 // for 1 week time in milliseconds
      }
    );
    return res
      .header("x-auth-token", token)
      .status(200)
      .json({ success: true, message: "Logged In!", token: token });
  }
};

module.exports.verifyEmail = async (req, res) => {
  let { email, token } = req.params;
  let user = await User.findOne({ email: email });
  if (user) {
    if (user.isEmailVerified === true && user.isContactVerified === true) {
      const token = jwt.sign(
        {
          type: "user",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({ success: true, message: "Already Verified" });
    } else if (
      user.isEmailVerified === true &&
      user.isContactVerified === false
    ) {
      if (user.otpExpiresIn >= Date.now())
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your Mobile No."
        });
      else {
        await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
          user.otpExpiresIn = Date.now() + 600000;
          user.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        });
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your Mobile No. Now"
        });
      }
    } else if (
      user.verifyEmail.expiresIn >= Date.now() &&
      user.verifyEmail.token === token &&
      user.isContactVerified === true
    ) {
      user.isEmailVerified = true;
      user.verifyEmail.token = undefined;
      user.verifyEmail.expiresIn = undefined;
      await user.save();
      const token = jwt.sign(
        {
          type: "user",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({
          success: true,
          message: "Email Verified! You can login now!",
          token: token
        });
    } else if (
      user.verifyEmail.expiresIn >= Date.now() &&
      user.verifyEmail.token === token &&
      user.isContactVerified === false
    ) {
      user.isEmailVerified = true;
      user.verifyEmail.token = undefined;
      user.verifyEmail.expiresIn = undefined;
      await user.save();
      if (user.otpExpiresIn >= Date.now()) {
        res.status(200).json({
          success: true,
          message: "Email Verified! Verify your Mobile no.!"
        });
      } else {
        await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
          user.otpExpiresIn = Date.now() + 600000;
          user.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        });
        res.status(200).json({
          success: true,
          message: "Email Verified! Verify your Mobile no. now!"
        });
      }
    } else {
      await sendVerificationLink(user.email);
      res.status(400).json({ message: "Invalid Request or Link Expired!" });
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.verifyContact = async (req, res) => {
  let { contact } = req.params;
  let { otp } = req.body;
  let user = await User.findOne({ contact: contact });
  if (user) {
    if (user.isContactVerified === true && user.isEmailVerified === true) {
      const token = jwt.sign(
        {
          type: "user",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({ success: true, message: "Already Verified!" });
    } else if (
      user.isContactVerified === true &&
      user.isEmailVerified === false
    ) {
      if (user.verifyEmail.expiresIn >= Date.now())
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your email Id."
        });
      else {
        await sendVerificationLink(user.email);
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your email Id now."
        });
      }
    } else {
      await sendOtp.verify(contact, otp, async (error, data) => {
        console.log(data);
        if (data.type == "success") {
          if (
            user.otpExpiresIn >= Date.now() &&
            user.isEmailVerified === true
          ) {
            user.isContactVerified = true;
            user.otpExpiresIn = undefined;
            await user.save();
            const token = jwt.sign(
              {
                type: "user",
                data: {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  contact: user.contact,
                  role: user.role
                }
              },
              process.env.secret,
              {
                expiresIn: 604800 // for 1 week time in milliseconds
              }
            );
            res
              .header("x-auth-token", token)
              .status(200)
              .json({
                success: true,
                message: "Contact Verified. You can login now!",
                token: token
              });
          } else if (
            user.otpExpiresIn >= Date.now() &&
            user.isEmailVerified === false
          ) {
            user.isContactVerified = true;
            user.otpExpiresIn = undefined;
            await user.save();
            if (user.verifyEmail.expiresIn >= Date.now()) {
              res.status(200).json({
                success: true,
                message: "Contact Verified. Need to verify your Email!"
              });
            } else {
              await sendVerificationLink(user.email);
              res.status(200).json({
                success: true,
                message: "Contact Verified. Need to verify your Email now!"
              });
            }
          }
        }
        if (data.type == "error") {
          if (user.otpExpiresIn < Date.now())
            await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
              user.otpExpiresIn = Date.now() + 600000;
              user.save();
              sendOtp.setOtpExpiry("10"); //in minutes
            });
          res.status(400).json({ message: "Invalid Request or Link Expired!" });
        }
      });
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.retryContactVerification = async (req, res) => {
  let { contact } = req.params;
  let user = await User.findOne({ contact: contact });
  if (user) {
    if (user.isContactVerified === true && user.isEmailVerified === true) {
      const token = jwt.sign(
        {
          type: "user",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({
          success: true,
          message: "Already Verified!",
          token: token
        });
    } else if (user.isContactVerified === true) {
      if (user.verifyEmail.expiresIn >= Date.now())
        res.status(200).json({
          success: true,
          message: "Contact Already Verified! Need to verify Email Id."
        });
      else {
        sendVerificationLink(user.email);
        res.status(200).json({
          success: true,
          message: "Contact Already Verified! Need to verify Email Id now."
        });
      }
    } else {
      let response = await axios.post(
        `${process.env.MSG91_RESENDOTP_URL}${contact}&authkey=${process.env.MSG91_API_KEY}`
      );
      console.log(response);
      if (
        response.data.type === "error" &&
        response.data.message === "No OTP request found to retryotp"
      ) {
        res
          .status(400)
          .json({ message: "Can't retry OTP without trying Verification" });
      } else if (
        response.data.type === "success" &&
        user.isEmailVerified === false
      ) {
        if (user.verifyEmail.expiresIn >= Date.now())
          res.status(200).json({
            success: true,
            message: "Called! Need to verify Email Id."
          });
        else if (response.data.type === "success") {
          sendVerificationLink(user.email);
          res.status(200).json({
            success: true,
            message: "Called! Need to verify Email Id now."
          });
        }
      } else if (response.data.type === "error") {
        res.status(400).json({ message: "OTP not sent" });
      } else {
        res.status(200).json({
          success: true,
          message: "Otp Send via call."
        });
      }
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.sendForgetEmail = async (req, res) => {
  let { emailormobile } = req.params;
  let user =
    (await User.findOne({ email: emailormobile })) ||
    (await User.findOne({ contact: emailormobile }));
  if (user) {
    if (user.isContactVerified === true && user.isEmailVerified === true) {
      if (!user.resetPwd.token || user.resetPwd.expiresIn < Date.now()) {

        forgetPasswordEmail(user.email);
        res.status(200).json({ message: "Forget Password Email Sent!" });
      } else res.status(400).json({ message: "Already Availed!" });
    } else if (
      user.isContactVerified === true &&
      user.isEmailVerified === false
    ) {
      if (user.verifyEmail.expiresIn >= Date.now())
        res.status(200).json({
          message: "Verify your email Id first."
        });
      else {
        await sendVerificationLink(user.email);
        res.status(200).json({
          message: "Verify your email Id first now."
        });
      }
    } else if (
      user.isEmailVerified === true &&
      user.isContactVerified === false
    ) {
      if (user.otpExpiresIn >= Date.now())
        res.status(200).json({
          message: "Verify your Mobile No. first."
        });
      else {
        await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
          user.otpExpiresIn = Date.now() + 600000;
          user.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        });
        res.status(200).json({
          message: "Verify your Mobile No. first now."
        });
      }
    } else {
      if (
        user.verifyEmail.expiresIn >= Date.now() &&
        user.otpExpiresIn >= Date.now()
      )
        res.status(200).json({
          message: "Verify your email Id first & Mobile No."
        });
      else if (
        user.verifyEmail.expiresIn < Date.now() &&
        user.otpExpiresIn >= Date.now()
      ) {
        await sendVerificationLink(user.email);
        res.status(200).json({
          message: "Verify your email Id first now & Mobile No."
        });
      } else if (
        user.verifyEmail.expiresIn >= Date.now() &&
        user.otpExpiresIn < Date.now()
      ) {
        await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
          user.otpExpiresIn = Date.now() + 600000;
          user.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        });
        res.status(200).json({
          message: "Verify your email Id first & Mobile No. now"
        });
      } else {
        await sendVerificationLink(user.email);
        await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
          user.otpExpiresIn = Date.now() + 600000;
          user.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        });
        res.status(200).json({
          message: "Verify your email Id first now and Mobile No. now"
        });
      }
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.forgetPassword = async (req, res) => {
  let { email, token } = req.params;
  let { password, confirmPassword } = req.body;
  let user = await User.findOne({ email: email });
  if (user) {
    if (user.resetPwd.token != token)
      return res.json({ success: false, message: "You don't have access!" });
    else if (user.resetPwd.expiresIn < Date.now()) {
      forgetPasswordEmail(user.email);
      return res.json({
        success: false,
        message: "Time Expired! New Email is sent!"
      });
    } else {
      if (
        !user.isEmailVerified &&
        !user.isContactVerified &&
        user.otpExpiresIn >= Date.now() &&
        user.verifyEmail.expiresIn >= Date.now()
      )
        res.status(400).json({ message: "Get yourself verified!" });
      else if (
        !user.isEmailVerified &&
        !user.isContactVerified &&
        user.otpExpiresIn < Date.now() &&
        user.verifyEmail.expiresIn < Date.now()
      ) {
        await sendVerificationLink(user.email);
        await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
          user.otpExpiresIn = Date.now() + 600000;
          user.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        });
        res.status(400).json({
          message: "Verify your email Id & Contact No now."
        });
      } else if (!user.isEmailVerified) {
        if (user.verifyEmail.expiresIn >= Date.now())
          res.status(400).json({
            message: "Verify your email Id first."
          });
        else {
          await sendVerificationLink(user.email);
          res.status(400).json({
            message: "Verify your email Id first now."
          });
        }
      } else if (!user.isContactVerified) {
        if (user.otpExpiresIn >= Date.now())
          res.status(200).json({
            message: "Verify your Mobile No. first."
          });
        else {
          await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
            user.otpExpiresIn = Date.now() + 600000;
            user.save();
            sendOtp.setOtpExpiry("10"); //in minutes
          });
          res.status(200).json({
            message: "Verify your Mobile No. first now."
          });
        }
      } else {
        if (password === confirmPassword) {
          if (await bcrypt.compare(password, user.password))
            return res.status(400).json({
              message:
                "Password stored with us and your entered passwords are same!"
            });
          const salt = await bcrypt.genSalt(10);
          password = await bcrypt.hash(password, salt);
          await User.updateOne(
            { _id: user.id },
            {
              $set: {
                password: password,
                resetPwd: { token: undefined, expiresIn: undefined }
              }
            }
          );
          return res
            .status(200)
            .json({ message: "Password Reset Successfully!" });
        } else {
          return res
            .status(400)
            .json({ message: "Password and Confirm Password doesn't Match!" });
        }
      }
    }
  } else {
    return res.status(400).json({ message: "No such User!" });
  }
};

module.exports.profile = async (req, res) => {
  let user = await User.findById(req.user.data._id);
  id = user._id;
  isEmailVerified = user.isEmailVerified;
  isContactVerified = user.isContactVerified;
  name = user.name;
  email = user.email;
  contact = user.contact;
  role = user.role;
  return res.status(200).json({
    _id: id,
    isEmailVerified: isEmailVerified,
    isContactVerified: isContactVerified,
    name: name,
    email: email,
    contact: contact,
    role: role
  });
};

module.exports.updateUserFields = async (req, res) => {
  let user = await User.findById({ _id: req.user.data._id });
  let { name, password, confirmPassword } = req.body;
  passwordRegex = /^[\S]{8,}/;
  if (passwordRegex.test(String(password))) {
    if (password != confirmPassword) {
      res
        .status(400)
        .json({ message: "Password and Confirm Password doesn't Match!" });
    } else if (
      user.name === name &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.status(400).json({ message: "Entries Are Same Already!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      await User.updateOne(
        { _id: req.user.data._id },
        { $set: { name: name, password: password } }
      );
      res.status(200).json({ message: "Updated Successfully!" });
    }
  }
};

module.exports.updateUser = async (req, res) => {
  let user = await User.findById({ _id: req.user.data._id });
  let { name, password, confirmPassword } = req.body;
  if (name === undefined) name = user.name;
  if (password === undefined && confirmPassword === undefined) {
    password = user.password;
    confirmPassword = user.confirmPassword;
  }
  passwordRegex = /^[\S]{8,}/;
  if (passwordRegex.test(String(password))) {
    if (password != confirmPassword) {
      res
        .status(400)
        .json({ message: "Password and Confirm Password doesn't Match!" });
    } else {
      let temp = await bcrypt.compare(password, user.password);
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      if (req.file === undefined) {
        if (user.name === name && temp)
          return res.status(400).json({ message: "Entries Are Same Already!" });
        await User.updateOne(
          { _id: req.user.data._id },
          { $set: { name: name, password: password } }
        );
      } else {
        if (user.img.id != process.env.RANDOM_IMG_ID)
          await cloudinary.uploader.destroy(user.img.id, (error, result) => {
            console.log(result);
          });
        await User.updateOne(
          { _id: req.user.data._id },
          {
            $set: {
              name: name,
              password: password,
              img: { id: req.file.public_id, url: req.file.url }
            }
          },
          (err, done) => {
            if (err)
              return res.status(400).json({ message: "Something went wrong." });
          }
        );
      }
      res.status(200).json({ message: "Updated Successfully!" });
    }
  }
};

module.exports.deleteUser = async (req, res) => {
  let user = await User.findById(req.params.id);
  if (user) {
    deletedUser = await DeletedUsers.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      isEmailVerified: user.isEmailVerified,
      isContactVerified: user.isContactVerified,
      contact: user.contact,
      role: user.role,
      img: {
        id: user.img.id,
        url: user.img.url
      }
    });
    deletedUser.save();
    await mailToBannedUsers(deletedUser.email);
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Deleted Successfully!" });
  } else {
    if (await DeletedUsers.findOne({ deletedID: req.params.id })) {
      res.status(400).json({ message: "Already Deleted!" });
    } else {
      res.status(400).json({ message: "No such User!" });
    }
  }
};

module.exports.removeUserBan = async (req, res) => {
  let user = await DeletedUsers.findById(req.params.id);
  let requestedUser = await RequestBanRemovalUsers.findById(req.params.id);
  if (user) {
    userAdded = await User.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      isEmailVerified: user.isEmailVerified,
      isContactVerified: user.isContactVerified,
      contact: user.contact,
      role: user.role,
      img: {
        id: user.img.id,
        url: user.img.url
      }
    });
    if (
      userAdded.isEmailVerified === false &&
      userAdded.isContactVerified === false
    ) {
      await sendOtp.send(userAdded.contact, "GetMyPGOnline", (err, data) => {
        if (data.type === "error") temp1 = 0;
        else {
          userAdded.otpExpiresIn = Date.now() + 600000;
          userAdded.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        }
      });
      if (requestedUser) await sendRemoveBanOnRequest(userAdded.email);
      else await sendRemoveBanByAdmin(userAdded.email);
    } else if (userAdded.isContactVerified === false) {
      await sendOtp.send(userAdded.contact, "GetMyPGOnline", (err, data) => {
        if (data.type === "error") temp1 = 0;
        else {
          userAdded.otpExpiresIn = Date.now() + 600000;
          userAdded.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        }
      });
      if (requestedUser) await sendRemoveBanOnRequestVerified(userAdded.email);
      else await sendRemoveBanByAdminVerified(userAdded.email);
    } else if (userAdded.isEmailVerified === false) {
      if (requestedUser) await sendRemoveBanOnRequest(userAdded.email);
      else await sendRemoveBanByAdmin(userAdded.email);
    } else {
      if (requestedUser) await sendRemoveBanOnRequestVerified(userAdded.email);
      else await sendRemoveBanByAdminVerified(userAdded.email);
    }
    await DeletedUsers.deleteOne({ _id: req.params.id });
    if (requestedUser)
      await RequestBanRemovalUsers.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Ban Removed Successfully!" });
  } else {
    res.status(400).json({ message: "No such User!" });
  }
};

module.exports.requestRemoveBan = async (req, res) => {
  let user = await DeletedUsers.findOne({ email: req.params.email });
  let requestedUser = await RequestBanRemovalUsers.findOne({
    email: req.params.email
  });
  let { reason } = req.body;
  if (user && !requestedUser) {
    userAdded = await RequestBanRemovalUsers.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      role: user.role,
      reason: reason
    });
    res.status(200).json({ message: "Requested Successfully!" });
  } else if (requestedUser) {
    res.status(200).json({ message: "Your Request is Already in Process!" });
  } else {
    let user1 = await User.findOne({ email: req.params.email });
    if (user1)
      return res
        .status(400)
        .json({ message: "You are not banned from our services!" });
    return res.status(400).json({ message: "You are not registered yet!" });
  }
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DeletedUsers = require("../models/DeletedUsers");
const RequestBanRemovalUsers = require("../models/RequestBanRemovalUsers");
const nodemailer = require("nodemailer");
require("dotenv").config();

sendVerificationLink = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    if (user.isVerified === true) {
      return res.status(400).json({ message: "Already Verified!" });
    } else {
      let token = Date.now() + user._id + Math.random(10000000000);
      user.verifyEmail.token = token;
      user.verifyEmail.expiresIn = Date.now() + 3600000;
      const message = `<center style="min-width:580px;width:100%">
      <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Almost done, <strong style="color:#24292e!important">${user.name}</strong>! To complete your <strong>Get-My-PG-Online</strong> sign up, we just need to verify your email address: <strong style="color:#24292e!important">${email}</strong>.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}'>Verify Your Email Address</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
      <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}</p>
      <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You’re receiving this email because you recently created a new Get-My-PG-Online account or added a new email address. If this wasn’t you, please ignore this email.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.password
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      let mailOptions = {
        from: `GET MY PG ONLINE <${process.env.email}>`,
        to: email,
        subject: "Please Verify your E-mail Address",
        html: message,
        attachments: [
          {
            filename: "GetMyPG-Online.JPG",
            path: __dirname + "/assets/GetMyPG-Online.JPG",
            cid: "unique"
          }
        ]
      };
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return 0;
        }
        console.log("Message sent: %s", info.messageId);
      });
      await user.save();
    }
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

mailToBannedUsers = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">You are Banned <strong style="color:#24292e!important">${user.name}</strong>! To talk to our admin at <strong>Get-My-PG-Online</strong> and to request them to remove the ban from your email address: <strong style="color:#24292e!important">${email}</strong> then click the button below.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/requestremoveban/${email}'>Contact Us</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You are banned from using all of Get-My-PG-Online's features. This may be due to someone creating fake ID using your Email or you don't want to continue using our services!</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/requestremoveban/${email}. You’re receiving this email because your email ID was registered with us and you have been banned.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let mailOptions = {
      from: `GET MY PG ONLINE <${process.env.email}>`,
      to: email,
      subject: "You are Banned from our Services!",
      html: message,
      attachments: [
        {
          filename: "GetMyPG-Online.JPG",
          path: __dirname + "/assets/GetMyPG-Online.JPG",
          cid: "unique"
        }
      ]
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return 0;
      }
      console.log("Message sent: %s", info.messageId);
    });
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

module.exports.register = async (req, res) => {
  let { name, email, contact, password, role } = req.body;
  if (!name || !email || !contact || !password || !role) {
    return res.status(400).json({ message: "All fields are mandatory!" });
  }
  let emailRegex = /^\S+@\S+\.\S+/,
    phoneRegex = /(^[6-9]{1}[0-9]{9}$)/,
    passwordRegex = /^[\S]{8,}/;
  if (emailRegex.test(email)) {
    if (passwordRegex.test(String(password))) {
      if (phoneRegex.test(Number(contact))) {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ message: "User already registered!" });
        } else {
          let newUser = {
            name,
            email,
            password,
            role,
            contact
          };
          if (await DeletedUsers.findOne({ email: email })) {
            res.status(400).json({ message: "Your EmailId is Banned!" });
          }
          const salt = await bcrypt.genSalt(10);
          newUser.password = await bcrypt.hash(newUser.password, salt);
          user = await User.create(newUser);
          temp = 1;
          try {
            await sendVerificationLink(newUser.email);
          } catch (err) {
            temp = 0;
            console.log(err);
          }
          if (temp === 0) {
            return res.status(400).json({
              success: false,
              message: "Registeration Successful!",
              error: "Verification Email cannot be sent. Login to recieve!"
            });
          } else {
            res.status(200).json({
              success: true,
              message: "Registeration Successful! Verify Your Email Address!"
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
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Wrong Credentials." });
  } else if (isMatch && user.isVerified == false) {
    if (user.verifyEmail.expiresIn >= Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID!" });
    } else {
      await sendVerificationLink(user.email);
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID!" });
    }
  } else {
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
      .json({ success: true, token: token });
  }
};

module.exports.verifyEmail = async (req, res) => {
  let { email, token } = req.params;
  let user = await User.findOne({ email: email });
  if (user) {
    if (user.isVerified === true) {
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
      user.verifyEmail.expiresIn >= Date.now() &&
      user.verifyEmail.token === token
    ) {
      user.isVerified = true;
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
        .json({ success: true, message: "Email Verified", token: token });
    } else {
      await sendVerificationLink(user.email);
      res.status(400).json({ message: "Invalid Request or Link Expired!" });
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.profile = async (req, res) => {
  let user = await User.findById(req.user.data._id);
  id = user._id;
  isVerified = user.isVerified;
  name = user.name;
  email = user.email;
  password = user.password; //removed before publishing
  contact = user.contact;
  role = user.role;
  return res.status(200).json({
    _id: id,
    isVerified: isVerified,
    name: name,
    email: email,
    password: password,
    contact: contact,
    role: role
  });
};

module.exports.updateUser = async (req, res) => {
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

module.exports.deleteUser = async (req, res) => {
  let user = await User.findById(req.params.id);
  if (user) {
    if (user.role == "admin") {
      res.status(400).json({ message: "Cannot Delete User!" });
    } else {
      deletedUser = await DeletedUsers.create({
        _id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        isVerified: user.isVerified,
        contact: user.contact,
        role: user.role
      });
      deletedUser.verifyEmail.token = undefined;
      deletedUser.verifyEmail.expiresIn = undefined;
      deletedUser.save();
      await mailToBannedUsers(deletedUser.email);
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Deleted Successfully!" });
    }
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
  if (user) {
    userAdded = await User.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      isVerified: user.isVerified,
      contact: user.contact,
      role: user.role
    });
    if (userAdded.isVerified === false) {
      let token = Date.now() + user._id + Math.random(10000000000);
      userAdded.verifyEmail.token = token;
      userAdded.verifyEmail.expiresIn = Date.now() + 3600000;
      await userAdded.save();
      await sendVerificationLink(userAdded.email);
    } else {
      await mailToBannedUsers(userAdded.email);
    }
    await DeletedUsers.deleteOne({ _id: req.params.id });
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
    res.status(400).json({ message: "You can't request!" });
  }
};

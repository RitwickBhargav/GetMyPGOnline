const nodemailer = require("nodemailer");

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

module.exports.messageTemplate =
  "Your One Time Password is: {{otp}}. This Code is valid only for 10 Minutes. Do not give this code to anyone, even if they say they are from GetMyPGOnline! \n\nIf you didn't request this code, simply ignore this message.\n\nThanks,\nTeam Get My PG Online";

module.exports.email1 = async (_id, name, email, token) => {
  const message = `<center style="min-width:580px;width:100%">
  <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Almost done, <strong style="color:#24292e!important">${name}</strong>! To complete your <strong>Get-My-PG-Online</strong> sign up, we just need to verify your email address: <strong style="color:#24292e!important">${email}</strong>.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}'>Verify Your Email Address</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
  <br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}</p>
  <br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">If it's not you registering with us then follow this link: https://getmypgonline.herokuapp.com/api/users/delete/${_id}/${email}</p>
  <br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You’re receiving this email because you recently created a new Get-My-PG-Online account or added a new email address. If this wasn’t you, please ignore this email.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
  let mailOptions = {
    from: `GET MY PG ONLINE <${process.env.email}>`,
    to: email,
    subject: "Please Verify your E-mail Address",
    html: message,
    attachments: [
      {
        filename: "GetMyPG-Online.JPG",
        path: __dirname + "/GetMyPG-Online.JPG",
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
};

module.exports.email2 = async (_id, name, email, token) => {
  const message = `<center style="min-width:580px;width:100%">
      <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Lost Your Password, <strong style="color:#24292e!important">${name}</strong>! To change your <strong>Get-My-PG-Online</strong> profile password, we just need to verify that it's you: <strong style="color:#24292e!important">${email}</strong>.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/forgetpasssword/${email}/${token}'>Reset Your Password</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can change your password and start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
      <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/forgetpasssword/${email}/${token}</p>
      <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">If it's not you changing your password then follow this link: https://getmypgonline.herokuapp.com/api/users/delete/${_id}/${email}</p>
      <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You’re receiving this email because you forget your Get-My-PG-Online account's password. If this wasn’t you, please ignore this email.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
  let mailOptions = {
    from: `GET MY PG ONLINE <${process.env.email}>`,
    to: email,
    subject: "Reset Your Password",
    html: message,
    attachments: [
      {
        filename: "GetMyPG-Online.JPG",
        path: __dirname + "/GetMyPG-Online.JPG",
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
};

module.exports.email3 = async (name, email) => {
  const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">You are Banned <strong style="color:#24292e!important">${name}</strong>! To talk to our admin at <strong>Get-My-PG-Online</strong> and to request them to remove the ban from your email address: <strong style="color:#24292e!important">${email}</strong> then click the button below.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/requestremoveban/${email}'>Contact Us</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You are banned from using all of Get-My-PG-Online's features. This may be due to someone creating fake ID using your Email or you don't want to continue using our services!</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/requestremoveban/${email}. You’re receiving this email because your email ID was registered with us and you have been banned.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
  let mailOptions = {
    from: `GET MY PG ONLINE <${process.env.email}>`,
    to: email,
    subject: "You are Banned from our Services!",
    html: message,
    attachments: [
      {
        filename: "GetMyPG-Online.JPG",
        path: __dirname + "/GetMyPG-Online.JPG",
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
};

module.exports.email4 = async (name, email, token) => {
  const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Hey <strong style="color:#24292e!important">${name}</strong>! Your Ban is removed <strong>Get-My-PG-Online</strong> and we are sending this email to verify your email address: <strong style="color:#24292e!important">${email}</strong>. Click the button below to verify yourself.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}'>Verify Your Email Address</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}. You’re receiving this email because you requested us to remove your ban and we have processed your request.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
  let mailOptions = {
    from: `GET MY PG ONLINE <${process.env.email}>`,
    to: email,
    subject: "Your Request has been processed & Your Ban is Removed!",
    html: message,
    attachments: [
      {
        filename: "GetMyPG-Online.JPG",
        path: __dirname + "/GetMyPG-Online.JPG",
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
};

module.exports.email5 = async (name, email) => {
  const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Hey <strong style="color:#24292e!important">${name}</strong>! Your Ban is removed <strong>Get-My-PG-Online</strong> and we are sending this email to verify your email address: <strong style="color:#24292e!important">${email}</strong>. Click the button below to verify yourself.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}'>Verify Your Email Address</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}. You’re receiving this email because we have removed your ban and you can use our services.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
  let mailOptions = {
    from: `GET MY PG ONLINE <${process.env.email}>`,
    to: email,
    subject: "Your Ban is Removed!",
    html: message,
    attachments: [
      {
        filename: "GetMyPG-Online.JPG",
        path: __dirname + "/GetMyPG-Online.JPG",
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
};

module.exports.email6 = async (name, email) => {
  const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Hey <strong style="color:#24292e!important">${name}</strong>! Your Ban is removed <strong>Get-My-PG-Online</strong> and you can continue to use your email address: <strong style="color:#24292e!important">${email}</strong> to use our services. Click the button below to open our platform.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com'>GetMyPG Online</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com. You’re receiving this email because you requested us to remove your ban and we have processed your request.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
  let mailOptions = {
    from: `GET MY PG ONLINE <${process.env.email}>`,
    to: email,
    subject: "Your Request has been processed & Your Ban is Removed!",
    html: message,
    attachments: [
      {
        filename: "GetMyPG-Online.JPG",
        path: __dirname + "/GetMyPG-Online.JPG",
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
};

module.exports.email7 = async (name, email) => {
  const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Hey <strong style="color:#24292e!important">${name}</strong>! Your Ban is removed <strong>Get-My-PG-Online</strong> and you can continue to use your email address: <strong style="color:#24292e!important">${email}</strong> to use our services. Click the button below to open our platform.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com'>GetMyPG Online</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com. You’re receiving this email because we have removed your ban and you can use our services.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
  let mailOptions = {
    from: `GET MY PG ONLINE <${process.env.email}>`,
    to: email,
    subject: "Your Ban is Removed!",
    html: message,
    attachments: [
      {
        filename: "GetMyPG-Online.JPG",
        path: __dirname + "/GetMyPG-Online.JPG",
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
};

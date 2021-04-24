const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer')
var Notification = require('../models/notifications');
var User = require('../models/user')

let smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'Najehok.2020@gmail.com', // generated ethereal user
        pass: 'Najehok1234' // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

router.post('/add/:userId', async(req, res) => {
    let user = req.params.userId
    Notification.addNotif({
        notif: {
            title: req.body.title,
            message: req.body.message,
            icon: req.body.icon
        },
        user: user
    }, async(err, notif) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: 'Failed to add notif'
            });
        } else if (!notif)
            res.json({
                success: false,
                msg: 'Failed to add notif'
            });
        else {
            console.log('notif added')
            await User.find({
                _id: user
            }).exec(async function(err, result) {
                let email = await result[0].email
                if (req.body.addMember) {
                    // If user successfully saved to database, create e-mail object
                    var mailOptions = {
                        from: 'Localhost Staff, staff@localhost.com',
                        to: email,
                        subject: 'Joining Group',
                        text: 'Check your account or click here :' + req.body.message,
                        html: '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="utf-8"> <!-- utf-8 works for most cases --> <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn\'t be necessary --> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine --> <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely --> <title></title> <!-- The title tag shows in email notifications, like Android 4.4. --> <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet"> <!-- CSS Reset : BEGIN --> <style> /* What it does: Remove spaces around the email design added by some email clients. */ /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */ html,body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; background: #f1f1f1;}/* What it does: Stops email clients resizing small text. */* { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}/* What it does: Centers email on Android 4.4 */div[style*="margin: 16px 0"] { margin: 0 !important;}/* What it does: Stops Outlook from adding extra spacing to tables. */table,td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important;}/* What it does: Fixes webkit padding issue. */table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important;}/* What it does: Uses a better rendering method when resizing images in IE. */img { -ms-interpolation-mode:bicubic;}/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */a { text-decoration: none;}/* What it does: A work-around for email clients meddling in triggered links. */*[x-apple-data-detectors], /* iOS */.unstyle-auto-detected-links *,.aBn { border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important;}/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */.a6S { display: none !important; opacity: 0.01 !important;}/* What it does: Prevents Gmail from changing the text color in conversation threads. */.im { color: inherit !important;}/* If the above doesn\'t work, add a .g-img class to any image in question. */img.g-img + div { display: none !important;}/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89 *//* Create one of these media queries for each additional viewport size you\'d like to fix *//* iPhone 4, 4S, 5, 5S, 5C, and 5SE */@media only screen and (min-device-width: 320px) and (max-device-width: 374px) { u ~ div .email-container { min-width: 320px !important; }}/* iPhone 6, 6S, 7, 8, and X */@media only screen and (min-device-width: 375px) and (max-device-width: 413px) { u ~ div .email-container { min-width: 375px !important; }}/* iPhone 6+, 7+, and 8+ */@media only screen and (min-device-width: 414px) { u ~ div .email-container { min-width: 414px !important; }} </style> <!-- CSS Reset : END --> <!-- Progressive Enhancements : BEGIN --> <style> .primary{background: #17bebb;}.bg_white{background: #ffffff;}.bg_light{background: #f7fafa;}.bg_black{background: #000000;}.bg_dark{background: rgba(0,0,0,.8);}.email-section{padding:2.5em;}/*BUTTON*/.btn{padding: 10px 15px;display: inline-block;}.btn.btn-primary{border-radius: 5px;background: #17bebb;color: #ffffff;}.btn.btn-white{border-radius: 5px;background: #ffffff;color: #000000;}.btn.btn-white-outline{border-radius: 5px;background: transparent;border: 1px solid #fff;color: #fff;}.btn.btn-black-outline{border-radius: 0px;background: transparent;border: 2px solid #000;color: #000;font-weight: 700;}.btn-custom{color: rgba(0,0,0,.3);text-decoration: underline;}h1,h2,h3,h4,h5,h6{font-family: \'Poppins\', sans-serif;color: #000000;margin-top: 0;font-weight: 400;}body{font-family: \'Poppins\', sans-serif;font-weight: 400;font-size: 15px;line-height: 1.8;color: rgba(0,0,0,.4);}a{color: #17bebb;}table{}/*LOGO*/.logo h1{margin: 0;}.logo h1 a{color: #17bebb;font-size: 24px;font-weight: 700;font-family: \'Poppins\', sans-serif;}/*HERO*/.hero{position: relative;z-index: 0;}.hero .text{color: rgba(0,0,0,.3);}.hero .text h2{color: #000;font-size: 34px;margin-bottom: 0;font-weight: 200;line-height: 1.4;}.hero .text h3{font-size: 24px;font-weight: 300;}.hero .text h2 span{font-weight: 600;color: #000;}.text-author{bordeR: 1px solid rgba(0,0,0,.05);max-width: 50%;margin: 0 auto;padding: 2em;}.text-author img{border-radius: 50%;padding-bottom: 20px;}.text-author h3{margin-bottom: 0;}ul.social{padding: 0;}ul.social li{display: inline-block;margin-right: 10px;}/*FOOTER*/.footer{border-top: 1px solid rgba(0,0,0,.05);color: rgba(0,0,0,.5);}.footer .heading{color: #000;font-size: 20px;}.footer ul{margin: 0;padding: 0;}.footer ul li{list-style: none;margin-bottom: 10px;}.footer ul li a{color: rgba(0,0,0,1);}@media screen and (max-width: 500px) {} </style></head><body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;"><center style="width: 100%; background-color: #f1f1f1;"> <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;"> &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp; </div> <div style="max-width: 600px; margin: 0 auto;" class="email-container"> <!-- BEGIN BODY --> <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;"> <tr> <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td class="logo" style="text-align: center;"> <h1><a href="#">Joining</a></h1> </td> </tr> </table> </td> </tr><!-- end tr --><tr> <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td style="padding: 0 2.5em; text-align: center; padding-bottom: 3em;"> <div class="text"> <h2>' + req.body.sender + ' would like to join this group</h2> </div> </td> </tr> <tr> <td style="text-align: center;"> <div class="text-author"> <img src="' + await req.body.group_photo + '" alt="" style="width: 100px; max-width: 600px; height: auto; margin: auto; display: block;"> <h3 class="name"><a href="http://localhost:4200/group/' + req.body.groupId + '">' + req.body.group_name + '</a></h3> <span class="position">' + req.body.group_type + '</span> <p><a href="http://localhost:4200/addgroupmember/' + req.body.groupId + '/' + req.params.userId + '" class="btn btn-primary">Accept Request</a></p> <!-- p><a href="#" class="btn-custom">Ignore Request</a></p--> </div> </td> </tr> </table> </td> </tr><!-- end tr --></table></div> </center></body></html>'
                    };
                }
                if (req.body.addPost) {
                    var mailOptions = {
                        from: 'Localhost Staff, staff@localhost.com',
                        to: email,
                        subject: 'New Post in ' + req.body.group_name,
                        text: 'Check your account',
                        html: '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="utf-8"> <!-- utf-8 works for most cases --> <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn\'t be necessary --> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine --> <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely --> <title></title> <!-- The title tag shows in email notifications, like Android 4.4. --> <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet"> <!-- CSS Reset : BEGIN --> <style> /* What it does: Remove spaces around the email design added by some email clients. */ /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */ html,body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; background: #f1f1f1;}/* What it does: Stops email clients resizing small text. */* { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}/* What it does: Centers email on Android 4.4 */div[style*="margin: 16px 0"] { margin: 0 !important;}/* What it does: Stops Outlook from adding extra spacing to tables. */table,td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important;}/* What it does: Fixes webkit padding issue. */table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important;}/* What it does: Uses a better rendering method when resizing images in IE. */img { -ms-interpolation-mode:bicubic;}/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */a { text-decoration: none;}/* What it does: A work-around for email clients meddling in triggered links. */*[x-apple-data-detectors], /* iOS */.unstyle-auto-detected-links *,.aBn { border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important;}/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */.a6S { display: none !important; opacity: 0.01 !important;}/* What it does: Prevents Gmail from changing the text color in conversation threads. */.im { color: inherit !important;}/* If the above doesn\'t work, add a .g-img class to any image in question. */img.g-img + div { display: none !important;}/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89 *//* Create one of these media queries for each additional viewport size you\'d like to fix *//* iPhone 4, 4S, 5, 5S, 5C, and 5SE */@media only screen and (min-device-width: 320px) and (max-device-width: 374px) { u ~ div .email-container { min-width: 320px !important; }}/* iPhone 6, 6S, 7, 8, and X */@media only screen and (min-device-width: 375px) and (max-device-width: 413px) { u ~ div .email-container { min-width: 375px !important; }}/* iPhone 6+, 7+, and 8+ */@media only screen and (min-device-width: 414px) { u ~ div .email-container { min-width: 414px !important; }} </style> <!-- CSS Reset : END --> <!-- Progressive Enhancements : BEGIN --> <style> .primary{background: #17bebb;}.bg_white{background: #ffffff;}.bg_light{background: #f7fafa;}.bg_black{background: #000000;}.bg_dark{background: rgba(0,0,0,.8);}.email-section{padding:2.5em;}/*BUTTON*/.btn{padding: 10px 15px;display: inline-block;}.btn.btn-primary{border-radius: 5px;background: #17bebb;color: #ffffff;}.btn.btn-white{border-radius: 5px;background: #ffffff;color: #000000;}.btn.btn-white-outline{border-radius: 5px;background: transparent;border: 1px solid #fff;color: #fff;}.btn.btn-black-outline{border-radius: 0px;background: transparent;border: 2px solid #000;color: #000;font-weight: 700;}.btn-custom{color: rgba(0,0,0,.3);text-decoration: underline;}h1,h2,h3,h4,h5,h6{font-family: \'Poppins\', sans-serif;color: #000000;margin-top: 0;font-weight: 400;}body{font-family: \'Poppins\', sans-serif;font-weight: 400;font-size: 15px;line-height: 1.8;color: rgba(0,0,0,.4);}a{color: #17bebb;}table{}/*LOGO*/.logo h1{margin: 0;}.logo h1 a{color: #17bebb;font-size: 24px;font-weight: 700;font-family: \'Poppins\', sans-serif;}/*HERO*/.hero{position: relative;z-index: 0;}.hero .text{color: rgba(0,0,0,.3);}.hero .text h2{color: #000;font-size: 34px;margin-bottom: 0;font-weight: 200;line-height: 1.4;}.hero .text h3{font-size: 24px;font-weight: 300;}.hero .text h2 span{font-weight: 600;color: #000;}.text-author{bordeR: 1px solid rgba(0,0,0,.05);max-width: 50%;margin: 0 auto;padding: 2em;}.text-author img{border-radius: 50%;padding-bottom: 20px;}.text-author h3{margin-bottom: 0;}ul.social{padding: 0;}ul.social li{display: inline-block;margin-right: 10px;}/*FOOTER*/.footer{border-top: 1px solid rgba(0,0,0,.05);color: rgba(0,0,0,.5);}.footer .heading{color: #000;font-size: 20px;}.footer ul{margin: 0;padding: 0;}.footer ul li{list-style: none;margin-bottom: 10px;}.footer ul li a{color: rgba(0,0,0,1);}@media screen and (max-width: 500px) {} </style></head><body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;"><center style="width: 100%; background-color: #f1f1f1;"> <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;"> &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp; </div> <div style="max-width: 600px; margin: 0 auto;" class="email-container"> <!-- BEGIN BODY --> <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;"> <tr> <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td class="logo" style="text-align: center;"> <h1><a href="#">New Post</a></h1> </td> </tr> </table> </td> </tr><!-- end tr --><tr> <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td style="padding: 0 2.5em; text-align: center; padding-bottom: 3em;"> <div class="text"> <h2>' + req.body.sender + ' add new Post in ' + req.body.group_name + '</h2> </div> </td> </tr> <tr> <td style="text-align: center;"> <div class="text-author"><h3 class="name">' + req.body.titlePost + '</h3> <span class="position"></span> <p><a href="http://localhost:4200/group/' + req.body.groupId + '/post/' + req.body.postId + '" class="btn btn-primary">See Post</a></p> <!-- p><a href="#" class="btn-custom">Ignore Request</a></p--> </div> </td> </tr> </table> </td> </tr><!-- end tr --></table></div> </center></body></html>'
                    };
                }

                // Function to send e-mail to user
                smtpTransport.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        console.log(err)
                    } // If error in sending e-mail, log to console/terminal
                    else
                        res.json({
                            success: true
                        }); // Return success message to controller
                });
            })

        }
    });
});

router.put('/demandjoin', function(req, res) {
    let group_name = req.body.group_name
    let group_creator = req.body.group_creator
    let userId = req.body.userId
    let userName = req.body.userName
    let groupId = req.body.groupId
    Notification.addNotif({
        notif: {
            title: 'Demand Join to group ' + group_name,
            message: '<p>To join ' + userName + ' to your group ' + group_name + ', click here <a class="btn btn-success btn-sm" onclick="window.open(\'http://localhost:4200/groups/' + groupId + '/newmember/' + userId + '\',\'Join Group ' + group_name + '\',\'width=600,height=400\')" href="javascript:function() { return false; }" href="http://localhost:3000/groups/' + groupId + '/newmember/' + userId + '">Add it</a></p>',
            icon: '<i class="fas fa-sign-in-alt" style="color:var(--primary-color)"></i>'
        },
        user: group_creator._id
    }, async(err, notif) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: 'Failed to add notif'
            });
        } else if (!notif)
            res.json({
                success: false,
                msg: 'Failed to add notif'
            });
        else {
            console.log('notif added')
            await User.find({
                _id: group_creator._id
            }).exec(async function(err, result) {
                let email = await result[0].email
                var mailOptions = {
                    from: 'Localhost Staff, staff@localhost.com',
                    to: email,
                    subject: 'Demand Join to group ' + group_name,
                    text: 'Check your account',
                    html: '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="utf-8"> <!-- utf-8 works for most cases --> <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn\'t be necessary --> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine --> <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely --> <title></title> <!-- The title tag shows in email notifications, like Android 4.4. --> <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet"> <!-- CSS Reset : BEGIN --> <style> /* What it does: Remove spaces around the email design added by some email clients. */ /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */ html,body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; background: #f1f1f1;}/* What it does: Stops email clients resizing small text. */* { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}/* What it does: Centers email on Android 4.4 */div[style*="margin: 16px 0"] { margin: 0 !important;}/* What it does: Stops Outlook from adding extra spacing to tables. */table,td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important;}/* What it does: Fixes webkit padding issue. */table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important;}/* What it does: Uses a better rendering method when resizing images in IE. */img { -ms-interpolation-mode:bicubic;}/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */a { text-decoration: none;}/* What it does: A work-around for email clients meddling in triggered links. */*[x-apple-data-detectors], /* iOS */.unstyle-auto-detected-links *,.aBn { border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important;}/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */.a6S { display: none !important; opacity: 0.01 !important;}/* What it does: Prevents Gmail from changing the text color in conversation threads. */.im { color: inherit !important;}/* If the above doesn\'t work, add a .g-img class to any image in question. */img.g-img + div { display: none !important;}/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89 *//* Create one of these media queries for each additional viewport size you\'d like to fix *//* iPhone 4, 4S, 5, 5S, 5C, and 5SE */@media only screen and (min-device-width: 320px) and (max-device-width: 374px) { u ~ div .email-container { min-width: 320px !important; }}/* iPhone 6, 6S, 7, 8, and X */@media only screen and (min-device-width: 375px) and (max-device-width: 413px) { u ~ div .email-container { min-width: 375px !important; }}/* iPhone 6+, 7+, and 8+ */@media only screen and (min-device-width: 414px) { u ~ div .email-container { min-width: 414px !important; }} </style> <!-- CSS Reset : END --> <!-- Progressive Enhancements : BEGIN --> <style> .primary{background: #17bebb;}.bg_white{background: #ffffff;}.bg_light{background: #f7fafa;}.bg_black{background: #000000;}.bg_dark{background: rgba(0,0,0,.8);}.email-section{padding:2.5em;}/*BUTTON*/.btn{padding: 10px 15px;display: inline-block;}.btn.btn-primary{border-radius: 5px;background: #17bebb;color: #ffffff;}.btn.btn-white{border-radius: 5px;background: #ffffff;color: #000000;}.btn.btn-white-outline{border-radius: 5px;background: transparent;border: 1px solid #fff;color: #fff;}.btn.btn-black-outline{border-radius: 0px;background: transparent;border: 2px solid #000;color: #000;font-weight: 700;}.btn-custom{color: rgba(0,0,0,.3);text-decoration: underline;}h1,h2,h3,h4,h5,h6{font-family: \'Poppins\', sans-serif;color: #000000;margin-top: 0;font-weight: 400;}body{font-family: \'Poppins\', sans-serif;font-weight: 400;font-size: 15px;line-height: 1.8;color: rgba(0,0,0,.4);}a{color: #17bebb;}table{}/*LOGO*/.logo h1{margin: 0;}.logo h1 a{color: #17bebb;font-size: 24px;font-weight: 700;font-family: \'Poppins\', sans-serif;}/*HERO*/.hero{position: relative;z-index: 0;}.hero .text{color: rgba(0,0,0,.3);}.hero .text h2{color: #000;font-size: 34px;margin-bottom: 0;font-weight: 200;line-height: 1.4;}.hero .text h3{font-size: 24px;font-weight: 300;}.hero .text h2 span{font-weight: 600;color: #000;}.text-author{bordeR: 1px solid rgba(0,0,0,.05);max-width: 50%;margin: 0 auto;padding: 2em;}.text-author img{border-radius: 50%;padding-bottom: 20px;}.text-author h3{margin-bottom: 0;}ul.social{padding: 0;}ul.social li{display: inline-block;margin-right: 10px;}/*FOOTER*/.footer{border-top: 1px solid rgba(0,0,0,.05);color: rgba(0,0,0,.5);}.footer .heading{color: #000;font-size: 20px;}.footer ul{margin: 0;padding: 0;}.footer ul li{list-style: none;margin-bottom: 10px;}.footer ul li a{color: rgba(0,0,0,1);}@media screen and (max-width: 500px) {} </style></head><body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;"><center style="width: 100%; background-color: #f1f1f1;"> <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;"> &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp; </div> <div style="max-width: 600px; margin: 0 auto;" class="email-container"> <!-- BEGIN BODY --> <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;"> <tr> <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td class="logo" style="text-align: center;"> <h1><a href="#">New Post</a></h1> </td> </tr> </table> </td> </tr><!-- end tr --><tr> <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td style="padding: 0 2.5em; text-align: center; padding-bottom: 3em;"> <div class="text"> <h2>' + userName + ' want to join ' + group_name + '</h2> </div> </td> </tr> <tr> <td style="text-align: center;"> <div class="text-author"><h3 class="name">' + group_name + '</h3> <span class="position"></span> <p><a href="http://localhost:4200/joingroup/' + req.body.groupId + '/newMember" class="btn btn-primary">Join it</a></p> <!-- p><a href="#" class="btn-custom">Ignore Request</a></p--> </div> </td> </tr> </table> </td> </tr><!-- end tr --></table></div> </center></body></html>'
                };

                // Function to send e-mail to user
                smtpTransport.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        console.log(err)
                    } // If error in sending e-mail, log to console/terminal
                    else
                        res.json({
                            success: true
                        }); // Return success message to controller
                });
            })

        }
    });

})


router.put('/addlike', function(req, res) {
    let groupName = req.body.groupName
    let group_creator = req.body.group_creator
    let userId = req.body.userId
    let userName = req.body.userName
    let postName = req.body.postName
    let postId = req.body.postId
    let groupId = req.body.groupId
    Notification.addNotif({
        notif: {
            title: 'New like in ' + postName,
            message: '<p>new like from <a href="/profile/' + userId + '">' + userName + '</a> to your group <a href="/group/' + groupId + '">' + groupName + '</a>, click here to see post <a class="btn btn-success btn-sm" href="http://localhost:4200/groups/' + groupId + '/post/' + postId + '">See post</a> </p>',
            icon: '<i class="fas fa-thumbs-up" style="color:var(--primary-color)"></i>'
        },
        user: req.body.post_owner
    }, async(err, notif) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: 'Failed to add notif'
            });
        } else if (!notif)
            res.json({
                success: false,
                msg: 'Failed to add notif'
            });
        else {
            console.log('notif added')
            await User.find({
                _id: req.body.post_owner
            }).exec(async function(err, result) {
                let email = await result[0].email
                var mailOptions = {
                    from: 'Localhost Staff, staff@localhost.com',
                    to: email,
                    subject: 'New like in ' + groupName,
                    text: 'Check your account',
                    html: '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="utf-8"> <!-- utf-8 works for most cases --> <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn\'t be necessary --> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine --> <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely --> <title></title> <!-- The title tag shows in email notifications, like Android 4.4. --> <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet"> <!-- CSS Reset : BEGIN --> <style> /* What it does: Remove spaces around the email design added by some email clients. */ /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */ html,body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; background: #f1f1f1;}/* What it does: Stops email clients resizing small text. */* { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}/* What it does: Centers email on Android 4.4 */div[style*="margin: 16px 0"] { margin: 0 !important;}/* What it does: Stops Outlook from adding extra spacing to tables. */table,td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important;}/* What it does: Fixes webkit padding issue. */table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important;}/* What it does: Uses a better rendering method when resizing images in IE. */img { -ms-interpolation-mode:bicubic;}/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */a { text-decoration: none;}/* What it does: A work-around for email clients meddling in triggered links. */*[x-apple-data-detectors], /* iOS */.unstyle-auto-detected-links *,.aBn { border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important;}/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */.a6S { display: none !important; opacity: 0.01 !important;}/* What it does: Prevents Gmail from changing the text color in conversation threads. */.im { color: inherit !important;}/* If the above doesn\'t work, add a .g-img class to any image in question. */img.g-img + div { display: none !important;}/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89 *//* Create one of these media queries for each additional viewport size you\'d like to fix *//* iPhone 4, 4S, 5, 5S, 5C, and 5SE */@media only screen and (min-device-width: 320px) and (max-device-width: 374px) { u ~ div .email-container { min-width: 320px !important; }}/* iPhone 6, 6S, 7, 8, and X */@media only screen and (min-device-width: 375px) and (max-device-width: 413px) { u ~ div .email-container { min-width: 375px !important; }}/* iPhone 6+, 7+, and 8+ */@media only screen and (min-device-width: 414px) { u ~ div .email-container { min-width: 414px !important; }} </style> <!-- CSS Reset : END --> <!-- Progressive Enhancements : BEGIN --> <style> .primary{background: #17bebb;}.bg_white{background: #ffffff;}.bg_light{background: #f7fafa;}.bg_black{background: #000000;}.bg_dark{background: rgba(0,0,0,.8);}.email-section{padding:2.5em;}/*BUTTON*/.btn{padding: 10px 15px;display: inline-block;}.btn.btn-primary{border-radius: 5px;background: #17bebb;color: #ffffff;}.btn.btn-white{border-radius: 5px;background: #ffffff;color: #000000;}.btn.btn-white-outline{border-radius: 5px;background: transparent;border: 1px solid #fff;color: #fff;}.btn.btn-black-outline{border-radius: 0px;background: transparent;border: 2px solid #000;color: #000;font-weight: 700;}.btn-custom{color: rgba(0,0,0,.3);text-decoration: underline;}h1,h2,h3,h4,h5,h6{font-family: \'Poppins\', sans-serif;color: #000000;margin-top: 0;font-weight: 400;}body{font-family: \'Poppins\', sans-serif;font-weight: 400;font-size: 15px;line-height: 1.8;color: rgba(0,0,0,.4);}a{color: #17bebb;}table{}/*LOGO*/.logo h1{margin: 0;}.logo h1 a{color: #17bebb;font-size: 24px;font-weight: 700;font-family: \'Poppins\', sans-serif;}/*HERO*/.hero{position: relative;z-index: 0;}.hero .text{color: rgba(0,0,0,.3);}.hero .text h2{color: #000;font-size: 34px;margin-bottom: 0;font-weight: 200;line-height: 1.4;}.hero .text h3{font-size: 24px;font-weight: 300;}.hero .text h2 span{font-weight: 600;color: #000;}.text-author{bordeR: 1px solid rgba(0,0,0,.05);max-width: 50%;margin: 0 auto;padding: 2em;}.text-author img{border-radius: 50%;padding-bottom: 20px;}.text-author h3{margin-bottom: 0;}ul.social{padding: 0;}ul.social li{display: inline-block;margin-right: 10px;}/*FOOTER*/.footer{border-top: 1px solid rgba(0,0,0,.05);color: rgba(0,0,0,.5);}.footer .heading{color: #000;font-size: 20px;}.footer ul{margin: 0;padding: 0;}.footer ul li{list-style: none;margin-bottom: 10px;}.footer ul li a{color: rgba(0,0,0,1);}@media screen and (max-width: 500px) {} </style></head><body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;"><center style="width: 100%; background-color: #f1f1f1;"> <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;"> &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp; </div> <div style="max-width: 600px; margin: 0 auto;" class="email-container"> <!-- BEGIN BODY --> <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;"> <tr> <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td class="logo" style="text-align: center;"> <h1><a href="#">New like</a></h1> </td> </tr> </table> </td> </tr><!-- end tr --><tr> <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td style="padding: 0 2.5em; text-align: center; padding-bottom: 3em;"> <div class="text"> <h2>' + userName + ' has like your post ' + postName + '</h2> </div> </td> </tr> <tr> <td style="text-align: center;"> <div class="text-author"><h3 class="name">' + postName + '</h3> <span class="position"></span> <p><a href="http://localhost:4200/group/' + groupId + '/post/' + postId + '" class="btn btn-primary">Join it</a></p> <!-- p><a href="#" class="btn-custom">Ignore Request</a></p--> </div> </td> </tr> </table> </td> </tr><!-- end tr --></table></div> </center></body></html>'
                };

                // Function to send e-mail to user
                smtpTransport.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        console.log(err)
                    } // If error in sending e-mail, log to console/terminal
                    else
                        res.json({
                            success: true
                        }); // Return success message to controller
                });
            })
        }
    });

})

router.put('/addcomment/:userId', function(req, res) {
    let userNotif = req.params.userId
    let groupName = req.body.groupName
    let group_creator = req.body.group_creator
    let userId = req.body.userId
    let userName = req.body.userName
    let postName = req.body.postName
    let postId = req.body.postId
    let groupId = req.body.groupId
    Notification.addNotif({
        notif: {
            title: 'New comment in ' + postName,
            message: '<p>New comment from <a href="/profile/' + userId + '">' + userName + '</a> to group <a href="/group/' + groupId + '">' + groupName + '</a>, click here to see post <a class="btn btn-success btn-sm" href="http://localhost:4200/groups/' + groupId + '/post/' + postId + '">' + postName + '</a> </p>',
            icon: req.body.icon,
            date: Date.now()
        },
        user: userNotif
    }, async(err, notif) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: 'Failed to add notif'
            });
        } else if (!notif)
            res.json({
                success: false,
                msg: 'Failed to add notif'
            });
        else {
            console.log('notif added')
            await User.find({
                _id: userNotif
            }).exec(async function(err, result) {
                let email = await result[0].email
                var mailOptions = {
                    from: 'Localhost Staff, staff@localhost.com',
                    to: email,
                    subject: 'New comment in post ' + postName,
                    text: 'Check your account',
                    html: '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="utf-8"> <!-- utf-8 works for most cases --> <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn\'t be necessary --> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine --> <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely --> <title></title> <!-- The title tag shows in email notifications, like Android 4.4. --> <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet"> <!-- CSS Reset : BEGIN --> <style> /* What it does: Remove spaces around the email design added by some email clients. */ /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */ html,body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; background: #f1f1f1;}/* What it does: Stops email clients resizing small text. */* { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}/* What it does: Centers email on Android 4.4 */div[style*="margin: 16px 0"] { margin: 0 !important;}/* What it does: Stops Outlook from adding extra spacing to tables. */table,td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important;}/* What it does: Fixes webkit padding issue. */table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important;}/* What it does: Uses a better rendering method when resizing images in IE. */img { -ms-interpolation-mode:bicubic;}/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */a { text-decoration: none;}/* What it does: A work-around for email clients meddling in triggered links. */*[x-apple-data-detectors], /* iOS */.unstyle-auto-detected-links *,.aBn { border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important;}/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */.a6S { display: none !important; opacity: 0.01 !important;}/* What it does: Prevents Gmail from changing the text color in conversation threads. */.im { color: inherit !important;}/* If the above doesn\'t work, add a .g-img class to any image in question. */img.g-img + div { display: none !important;}/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89 *//* Create one of these media queries for each additional viewport size you\'d like to fix *//* iPhone 4, 4S, 5, 5S, 5C, and 5SE */@media only screen and (min-device-width: 320px) and (max-device-width: 374px) { u ~ div .email-container { min-width: 320px !important; }}/* iPhone 6, 6S, 7, 8, and X */@media only screen and (min-device-width: 375px) and (max-device-width: 413px) { u ~ div .email-container { min-width: 375px !important; }}/* iPhone 6+, 7+, and 8+ */@media only screen and (min-device-width: 414px) { u ~ div .email-container { min-width: 414px !important; }} </style> <!-- CSS Reset : END --> <!-- Progressive Enhancements : BEGIN --> <style> .primary{background: #17bebb;}.bg_white{background: #ffffff;}.bg_light{background: #f7fafa;}.bg_black{background: #000000;}.bg_dark{background: rgba(0,0,0,.8);}.email-section{padding:2.5em;}/*BUTTON*/.btn{padding: 10px 15px;display: inline-block;}.btn.btn-primary{border-radius: 5px;background: #17bebb;color: #ffffff;}.btn.btn-white{border-radius: 5px;background: #ffffff;color: #000000;}.btn.btn-white-outline{border-radius: 5px;background: transparent;border: 1px solid #fff;color: #fff;}.btn.btn-black-outline{border-radius: 0px;background: transparent;border: 2px solid #000;color: #000;font-weight: 700;}.btn-custom{color: rgba(0,0,0,.3);text-decoration: underline;}h1,h2,h3,h4,h5,h6{font-family: \'Poppins\', sans-serif;color: #000000;margin-top: 0;font-weight: 400;}body{font-family: \'Poppins\', sans-serif;font-weight: 400;font-size: 15px;line-height: 1.8;color: rgba(0,0,0,.4);}a{color: #17bebb;}table{}/*LOGO*/.logo h1{margin: 0;}.logo h1 a{color: #17bebb;font-size: 24px;font-weight: 700;font-family: \'Poppins\', sans-serif;}/*HERO*/.hero{position: relative;z-index: 0;}.hero .text{color: rgba(0,0,0,.3);}.hero .text h2{color: #000;font-size: 34px;margin-bottom: 0;font-weight: 200;line-height: 1.4;}.hero .text h3{font-size: 24px;font-weight: 300;}.hero .text h2 span{font-weight: 600;color: #000;}.text-author{bordeR: 1px solid rgba(0,0,0,.05);max-width: 50%;margin: 0 auto;padding: 2em;}.text-author img{border-radius: 50%;padding-bottom: 20px;}.text-author h3{margin-bottom: 0;}ul.social{padding: 0;}ul.social li{display: inline-block;margin-right: 10px;}/*FOOTER*/.footer{border-top: 1px solid rgba(0,0,0,.05);color: rgba(0,0,0,.5);}.footer .heading{color: #000;font-size: 20px;}.footer ul{margin: 0;padding: 0;}.footer ul li{list-style: none;margin-bottom: 10px;}.footer ul li a{color: rgba(0,0,0,1);}@media screen and (max-width: 500px) {} </style></head><body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;"><center style="width: 100%; background-color: #f1f1f1;"> <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;"> &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp; </div> <div style="max-width: 600px; margin: 0 auto;" class="email-container"> <!-- BEGIN BODY --> <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;"> <tr> <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td class="logo" style="text-align: center;"> <h1><a href="#">New comment</a></h1> </td> </tr> </table> </td> </tr><!-- end tr --><tr> <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td style="padding: 0 2.5em; text-align: center; padding-bottom: 3em;"> <div class="text"> <h2>' + userName + ' has comment in post ' + postName + '</h2> </div> </td> </tr> <tr> <td style="text-align: center;"> <div class="text-author"><h3 class="name">' + postName + '</h3> <span class="position"></span> <p><a href="http://localhost:4200/group/' + groupId + '/post/' + postId + '" class="btn btn-primary">Join it</a></p> <!-- p><a href="#" class="btn-custom">Ignore Request</a></p--> </div> </td> </tr> </table> </td> </tr><!-- end tr --></table></div> </center></body></html>'
                };

                // Function to send e-mail to user
                smtpTransport.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        console.log(err)
                    } // If error in sending e-mail, log to console/terminal
                    else
                        res.json({
                            success: true
                        }); // Return success message to controller
                });
            })
        }
    });

})

router.get('/get/notice', function(req, res) {
    Notice.find({}, function(err, notices) {
        res.send(notices);
    });
});

router.get('/getnotificationbyuser/:id', function(req, res) {
    let id = req.params.id
    Notification.find({
        notification_receiver: id
    }).sort({ 'notification_list.date': -1 }).exec(function(err, notification) {
        (err) ? res.send({
            success: false
        }): res.send({
            success: true,
            notification: notification
        })
    });
});

router.post('/getnoticeuser', function(req, res) {
    Notice.find({
        _id: {
            $in: req.body
        }
    }, function(err, notices) {
        res.send(notices);
    });
});

router.put('/update', function(req, res) {
    let updateNotice = new Notice(req.body)
    Notification.findOneAndUpdate({
        _id: updateNotice._id
    }, {
        $set: {
            notice_title: updateNotice.notice_title,
            notice_content: updateNotice.notice_content,
            notice_links: updateNotice.notice_links
        }
    }, (err, result) => {
        if (err) {
            console.log(err)
            res.json({
                success: false
            })
        } else
            res.json({
                success: true
            })
    })
})

router.delete('/delete/:id', (req, res) => {
    let id = req.params.id
    Notification.findByIdAndDelete(id, function(err) {
        if (err) return next(err);
        res.send({
            success: true
        });
    });
});

module.exports = router;
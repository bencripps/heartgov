/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-24 15:04:10
*/

/*jslint node: true */

module.exports = function(nodemailer, AdminSchema, appMessages) {
    'use strict';
    
    var mailer = {
        smtpTransport: nodemailer.createTransport('SMTP', {
            service: 'Gmail',
            auth: {
                user: 'heartgov@gmail.com',
                pass: process.env.mailPassword
            }
        }),
        getSuperUsers: function() {
            return AdminSchema.find({superUser: true}).exec();
        },
        getEmail: function(address, type) {
            var mailOptions = {
                from: appMessages.emailAddress,
                to: address,
                subject: appMessages[type].subject,
                text: appMessages[type].body
            };
            
            return mailOptions;
        },
        sendMailtoSuperUsers: function(type) {
            this.getSuperUsers().then(function(users, err) {
                var emailAddresses = users.map(function(user) { return user.emailAddress; });
                mailer.sendMail(emailAddresses, type);
            });
        },
        sendMail: function(emailAddress, type) {
            this.smtpTransport.sendMail(this.getEmail(emailAddress, type), function(error, response) {
                // console.log(error, response);
            });
            
        }
    };

    return mailer;
};

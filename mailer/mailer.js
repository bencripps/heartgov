/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-23 23:15:14
*/

module.exports = function(jade, nodemailer, AdminSchema, appMessages) {
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
            getEmail: function(address, type, options) {
                var template = jade.compileFile(appMessages[type].templatePath),
                    mailOptions = {
                        contentType: 'text/html',
                        from: appMessages.emailAddress,
                        to: address,
                        subject: appMessages[type].subject,
                        html: template(options)
                    };
                
                return mailOptions;
            },
            sendMailtoSuperUsers: function(type, options) {
                this.getSuperUsers().then(function(users, err) {
                    var emailAddresses = users.map(function(user) { return user.emailAddress; });
                    mailer.sendMail(emailAddresses, type, options);
                });
            },
            sendMail: function(emailAddress, type, options) {
                this.smtpTransport.sendMail(this.getEmail(emailAddress, type, options), function(error, response) {
                    // console.log(error, response);
                });
                
            }
        };

    return mailer;
};

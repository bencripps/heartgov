/*
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2016-07-01 14:57:17
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
            getEmailUsers: function(incomingNumber) {
                var location = this.getLocationByNumber(incomingNumber);
                return AdminSchema.find({receiveEmails: true, assignedCities: location}).exec();
            },
            getLocationByNumber: function(number) {
                var sanitizedNumber = number.replace(/\+/g, ''),
                    city;

                switch (sanitizedNumber) {
                    case '17185146113':
                        city = 'brooklyn';
                        break;
                    case '15126435627':
                        city = 'austin';
                        break;
                    case '16466933147':
                        city = 'rh1';
                        break;
                    case '16468464332':
                        city = 'councilmatic';
                        break;
                    case '15128424750':
                        city = 'austinNew';
                        break;
                    case '19782282116':
                        city = 'havernhill';
                    case '12345':
                        city = 'austinShort';
                        break;
                    default:
                        throw Error('Number is undefined. Check to make sure new city has been added to Mailer');
                }

                return city;
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
            sendMailtoAssociatedUsers: function(type, options) {
                this.getEmailUsers(options.textDetails.to).then(function(users, err) {
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

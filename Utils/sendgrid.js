var nodemailer = require('nodemailer');
const Nexmo = require('nexmo');
const sgMail = require('@sendgrid/mail');


var transporter = nodemailer.createTransport({
 transport: "SMTP",
   host: "smtp.gmail.com",
   secureConnection: false,
 
   requiresAuth: true,
   domains: ["gmail.com", "googlemail.com"],
   auth: {
   user: 'tharwa.ebank@gmail.com',
   pass: 'orca@2018'
 }
});
const sendEmail = function (destinataire , object, corp){
  
sgMail.setApiKey('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');
const msg = {
  to: destinataire,
  from: 'tharwa.ebank@gmail.com',
  subject: object,
  html: '<b> '+corp+'</b>',
};
sgMail.send(msg, function(err, json){
  if(err) { return console.error(err); }
  else console.log('Email envoye avec succès');
});
/*
var mailOptions = {
  from: 'tharwa.ebank@gmail.com',
  to: to,
  subject: object,
  html: '<b> '+corp+'</b>'
};

transporter.sendMail(mailOptions, function(error, info){
 if (error) {
   console.log(error);
 } else {
   console.log('Email sent: ' + info.response);
 }
});
*/
};
const sendsms=function(num,code){
 const nexmo = new Nexmo({
   apiKey: '19745c21',
   apiSecret: 'UDiTcLMcHtR1L3P2'
  });
 
  nexmo.message.sendSms(
   'Tharwa Bank', num, 'Your code confiramtion is : '+code,
     (err, responseData) => {
       if (err) {
         console.log(err);
       } else {
         console.dir(responseData);
       }
     }
  );
};
module.exports =
{
 
 sendEmail,
 sendsms
};
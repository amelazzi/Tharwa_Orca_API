

var nodemailer = require('nodemailer');
const Nexmo = require('nexmo');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'em_meguellati@esi.dz',
    pass: '$meguellati$'
  }
});
const sendEmail = function (to , object, corp){
var mailOptions = {
  from: 'em_meguellati@esi.dz',
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

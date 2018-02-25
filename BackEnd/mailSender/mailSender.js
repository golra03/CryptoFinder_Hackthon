var mailSender = require("nodemailer");
var transporter = mailSender.createTransport({
	service: 'gmail',
	auth: {
		user: 'arturovidalviera@gmail.com',
		pass: 'raremile'
	}
});

exports.sendMail = function(mailOptions){
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};
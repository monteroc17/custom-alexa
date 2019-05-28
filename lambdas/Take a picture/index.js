const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const moment = require('moment');
const nodemailer = require('nodemailer');
const Webcam = require('node-webcam');

app.use(bodyParser.urlencoded({extended: false}));

const opts = {
  width: 1280,
  height: 720,
  quality: 100,
  saveShots: true,
  output: 'jpeg',
  device: false,
  callbackReturn: 'location',
  verbose: false	
}
	
	
const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {user: 'daniel.montero.carvajal06@gmail.com', pass: 'Daniel.montero1995'}
}, "SMTP");

app.get('/', (req, res, next) => {
	res.send('Hola, usa /snap para tomar una foto')
});

app.get('/snap', (req, res, next) => {
	Webcam.capture('snap', opts, (err, data) => {
		if(err) {
			throw new Error(err);
		}
		console.log(data);
		console.log('Picture taken! Sending it via email...');
		fs.readFile('./snap.jpg', (error, data) => {
			if(error) {
				throw new Error(error)
			}
			console.log('file read!');
			const mailOptions = {
				from: '"Alexa" <daniel.montero.carvajal06@gmail.com>',
				to: 'daniel.montero.carvajal06@gmail.com', // rojo@tec.ac.cr
				subject: 'Picture taken with your Raspberry!',
				text: `Taken on: ${moment().format('LLLL')}`,
				attachments: [{'filename': 'snap.jpg', 'content': data}]	
			}
			console.log('sending email...');
			transporter.sendMail(mailOptions, (e, success) => {
				if(e) {
					throw new Error(e);
				}
				console.log(`Message ${success.messageId} sent: ${success.response}`);
				res.redirect('/');
			});
		})
			
	})
	
	
	
});




app.listen(3000);

console.log('Listening on port 3000');

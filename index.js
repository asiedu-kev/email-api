const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require("path");
const cors = require("cors");

const app = express();
// Parse incoming request bodies as JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*'); // update to match the domain you will make the request from
    res.header(

        'Access-Control-Allow-Headers',

        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'

    ),
        res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
        next();
});

app.use('/static', express.static(__dirname + '/public'));


app.get('/',function(req,res, next){
    res.sendFile(path.join(__dirname+'/email-template.html'));
    //__dirname : It will resolve to your project folder.
});

// POST endpoint to send an email
app.post('/send-email', (req, res, next) => {
    // Read the email template file
    const emailTemplate = fs.readFileSync('email-template.html', 'utf8');

    // Replace placeholders in the email template with data from the request body
    const emailHtml = emailTemplate.replace(/{{name}}/g, req.body.name);

    // Create a transporter object to send the email
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'asiedukevin050@gmail.com',
    //         pass: 'Godbless2019'
    //     }
    // });

    const mailOptions = {
        host: process.env.SMTP_HOST || "smtp.mailtrap.io",
        port: parseInt(process.env.SMTP_PORT || "2525"),
        secure: false,
        auth: {
            user: process.env.SMTP_USER || "e7a68055d630f3",
            pass: process.env.SMTP_PASSWORD || "74f0aeb20695c9",
        },
    }

    // Create a transporter object to send the email
    const transporter = nodemailer.createTransport({
        ...mailOptions,
    })

    // Define the email data
    const data = {
        from: 'reply@gmail.com',
        to: req.body.email,
        subject: 'Test Email',
        html: emailHtml
    };

    // Send the email
    transporter.sendMail(data, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});

// Start the server
app.listen(4000, () => {
    console.log('Server listening on port 3000');
});

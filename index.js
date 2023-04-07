const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require("path");
const mjml2html = require('mjml');
const Mustache = require('mustache');
let htmlToText = require(`nodemailer-html-to-text`).htmlToText

const app = express();
// Parse incoming request bodies as JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true)

    res.setHeader('Access-Control-Allow-Origin', '*')

    // another common pattern

    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')

    res.setHeader(

        'Access-Control-Allow-Headers',

        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'

    )
        next();
});

app.use('/static', express.static(__dirname + '/public'));


app.get('/',function(req,res, next){
    res.sendFile(path.join(__dirname+'/email-template.html'));
    //__dirname : It will resolve to your project folder.
});

// POST endpoint to send an email
app.post('/send-email' ,async (req, res, next) => {
    console.log("i")

    // console.log(req.body);
    // // Read the email template file
    // const emailTemplate = fs.readFileSync('email-template.html', 'utf8');
    //
    // // Replace placeholders in the email template with data from the request body
    // const emailHtml = emailTemplate.replace(/{{name}}/g, req.body.name);
    //
    // // Create a transporter object to send the email
    // // const transporter = nodemailer.createTransport({
    // //     service: 'gmail',
    // //     auth: {
    // //         user: 'asiedukevin050@gmail.com',
    // //         pass: 'Godbless2019'
    // //     }
    // // });
    //
    // // const mailOptions = {
    // //     host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    // //     port: parseInt(process.env.SMTP_PORT || "2525"),
    // //     secure: false,
    // //     auth: {
    // //         user: process.env.SMTP_USER || "e7a68055d630f3",
    // //         pass: process.env.SMTP_PASSWORD || "74f0aeb20695c9",
    // //     },
    // // }
    const mailOptions = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: 'asiedukevin050@gmail.com',
            pass: 'fsoaflmydvqcmccd'
        }
    }

    // Create a transporter object to send the email
    const transporter = nodemailer.createTransport({
        ...mailOptions,
    })

    const mjmlTemplate = fs.readFileSync('./templates/template.mjml', 'utf-8');

// compile the MJML template to HTML
    const { html } = mjml2html(mjmlTemplate);

// define your Mustache data object
    const dat = {
        name: 'John Doe',
        message: 'This is a test email'
    };

// compile the HTML with Mustache data
    const compiledHtml = Mustache.render(html, dat);

    // Define the email data
    const data = {
        from: 'hello@masewa.co',
        to: req.body.email,
        subject: 'Bienvenue',
        html: compiledHtml
    };

    // // Send the email
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

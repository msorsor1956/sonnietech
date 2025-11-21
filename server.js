const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    host: "smtp.zeptomail.com",
    port: 587,
    auth: {
        user: "emailapikey",
        pass: process.env.ZEPTO_PASSWORD 
    }
});

app.post('/api/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;
    const mailOptions = {
        from: '"Sonnies Tech Team" <noreply@sonnietech.com>',
        to: 'techsolutions@sonnietech.com',
        replyTo: email, 
        subject: "New Website Inquiry: " + subject,
        text: "Name: " + name + "
Email: " + email + "
Message:
" + message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});

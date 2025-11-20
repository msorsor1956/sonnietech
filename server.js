const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static HTML website
app.use(express.static(path.join(__dirname, 'public')));

// SMTP Configuration for Zoho Mail
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        // These will be loaded from Environment Variables for security
        user: process.env.ZOHO_EMAIL, 
        pass: process.env.ZOHO_PASSWORD 
    }
});

// Handle Contact Form Submission
app.post('/api/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
        from: process.env.ZOHO_EMAIL, // Sender address (must be your Zoho email)
        to: 'techsolutions@sonnietech.com', // Your receiving address
        replyTo: email, // Allows you to reply directly to the customer
        subject: `New Website Inquiry: ${subject}`,
        text: `You have received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

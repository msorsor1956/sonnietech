const express = require('express');
var { SendMailClient } = require("zeptomail");
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const url = "https://api.zeptomail.com/v1.1/email";
const token = process.env.ZEPTO_TOKEN; 

let client = new SendMailClient({url, token});

app.post('/api/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    const emailData = {
        "from": { 
            "address": "noreply@sonnietech.com", 
            "name": "Sonnies Tech Team" 
        },
        "to": [
            { 
                "email_address": { 
                    "address": "techsolutions@sonnietech.com", 
                    "name": "SONNIE TECHNOLOGY LLC" 
                } 
            }
        ],
        "reply_to": [
            { 
                "address": email, 
                "name": name 
            }
        ],
        "subject": "New Website Inquiry: " + subject,
        "htmlbody": "<div><h3>New Message</h3><p><strong>Name:</strong> " + name + "</p><p><strong>Email:</strong> " + email + "</p><p><strong>Message:</strong><br>" + message + "</p></div>"
    };

    try {
        await client.sendMail(emailData);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
// ZeptoMail Update: 11/20/2025 21:50:11

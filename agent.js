const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();

app.use(express.json());

// FORMSPREE EMAIL ALERT FUNCTION (No Passwords Required!)
async function sendEmailAlert(leadData) {
    try {
        await axios.post('https://formspree.io/f/xjywvelj', {
            subject: '🚨 New Lead Alert from Chatbot',
            userMessage: leadData.userMessage,
            botReply: leadData.botReply,
            timestamp: leadData.timestamp
        });
        console.log('✅ Instant Email Notification Sent via Formspree!');
    } catch (err) {
        console.error('❌ Email Alert Error:', err.message);
    }
}

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    let reply = "";

    if (!message) {
        return res.status(400).json({ error: "Message content cannot be empty." });
    }

    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('rate')) {
        reply = "Our automation packages start at $100. Would you like to schedule a quick demo?";
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        reply = "Hello! I am your AI Lead Generation Agent. How can I assist your business today?";
    } else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone')) {
        reply = "You can drop your details here, and our team will get back to you within 1 hour!";
    } else {
        reply = "Thanks for reaching out! Please share your contact info so we can discuss further.";
    }

    const newLog = {
        id: Date.now(),
        userMessage: message,
        botReply: reply,
        timestamp: new Date().toISOString()
    };

    // 1. Save locally to database.json
    fs.readFile('database.json', 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            try { logs = JSON.parse(data); } catch (e) { logs = []; }
        }
        logs.push(newLog);
        fs.writeFile('database.json', JSON.stringify(logs, null, 2), (err) => {
            if (err) console.error("Error logging to file:", err);
        });
    });

    // 2. Trigger Email Alert
    await sendEmailAlert(newLog);

    res.json({ success: true, reply: reply });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Advanced Lead Bot active on http://localhost:${PORT}`));

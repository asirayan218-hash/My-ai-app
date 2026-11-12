const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();

app.use(express.json());

// ENHANCED FORMSPREE ALERT WITH LEAD SCORING & CONTACT INFO
async function sendEmailAlert(leadData) {
    try {
        await axios.post('https://formspree.io/f/xjywvelj', {
            subject: `${leadData.priority} - New Lead from Chatbot!`,
            clientMessage: leadData.userMessage,
            extractedName: leadData.name,
            extractedPhone: leadData.phone,
            botReply: leadData.botReply,
            priorityScore: leadData.priority,
            timestamp: leadData.timestamp
        });
        console.log('✅ Advanced Lead Alert Sent via Formspree!');
    } catch (err) {
        console.error('❌ Email Alert Error:', err.message);
    }
}

// Chat Endpoint with Smart Extraction
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    let reply = "";

    if (!message) {
        return res.status(400).json({ error: "Message content cannot be empty." });
    }

    const lowerMsg = message.toLowerCase();
    let priority = "❄️ Cold Lead";
    let leadName = "Not provided";
    let leadPhone = "Not provided";

    // Basic Regex to detect phone numbers or contact intent
    const phoneMatch = message.match(/(\+?\d{10,13})/);
    if (phoneMatch) {
        leadPhone = phoneMatch[0];
    }

    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('rate') || lowerMsg.includes('demo')) {
        priority = "🔥 HOT LEAD (High Intent)";
        reply = "Our automation packages start at $100. Would you like to schedule a quick demo?";
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        priority = "⚡ Warm Lead";
        reply = "Hello! I am your AI Lead Generation Agent. How can I assist your business today?";
    } else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone')) {
        priority = "🔥 HOT LEAD (Contact Shared)";
        reply = "Got your details! Our team will get back to you within 1 hour.";
    } else {
        reply = "Thanks for reaching out! Please share your contact info so we can discuss further.";
    }

    const newLog = {
        id: Date.now(),
        userMessage: message,
        botReply: reply,
        name: leadName,
        phone: leadPhone,
        priority: priority,
        timestamp: new Date().toISOString()
    };

    // Save to Database
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

    // Trigger Enhanced Email Alert
    await sendEmailAlert(newLog);

    res.json({ success: true, reply: reply, priority: priority });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Pro Lead Bot active on http://localhost:${PORT}`));

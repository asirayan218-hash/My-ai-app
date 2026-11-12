const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// Load or initialize leads database file
const DB_FILE = 'database.json';
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

function runAIAgent(userQuery) {
  if (!userQuery) return "Please provide a valid message.";
  const query = userQuery.toLowerCase();

  if (query.includes('price') || query.includes('rate') || query.includes('paise')) {
    return "Humare AI Automation packages $100 se start hote hain. Aapko kis type ki bot chahiye?";
  } 
  else if (query.includes('timing') || query.includes('time') || query.includes('open')) {
    return "Hum 24/7 available hain! Aap kisi bhi waqt message kar sakte hain.";
  } 
  else if (query.includes('location') || query.includes('address') || query.includes('kahan')) {
    return "Hum remote services provide karte hain worldwide!";
  } 
  else if (query.includes('hello') || query.includes('hi') || query.includes('salam')) {
    return "Walaikumasalam! Main aapka AI Assistant hoon. Main aapki kya madad kar sakta hoon?";
  } 
  else {
    return "Main aapka sawal samajh gaya hoon. Humare agent jald hi aap se contact karenge!";
  }
}

app.post('/api/chat', (req, res) => {
  try {
    const userMessage = req.body.message || "";
    const botReply = runAIAgent(userMessage);

    // Save structured lead into database.json
    const fileData = fs.readFileSync(DB_FILE, 'utf8');
    const leads = JSON.parse(fileData);
    
    leads.push({
      timestamp: new Date().toISOString(),
      message: userMessage,
      reply: botReply
    });

    fs.writeFileSync(DB_FILE, JSON.stringify(leads, null, 2));

    res.json({ status: "success", reply: botReply });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Pro AI Agent running on http://localhost:${PORT}`);
});

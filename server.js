const express = require('express');
const EmailService = require('./emailService');

const app = express();
const emailService = new EmailService();

app.use(express.json());

app.post('/send-email', async (req, res) => {
  const email = req.body;

  if (!email.id || !email.to || !email.subject || !email.body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const success = await emailService.send(email);
    res.status(success ? 200 : 500).json({ status: success ? "Email sent" : "Failed to send email" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while sending email" });
  }
});

app.get('/email-status/:id', (req, res) => {
  const emailId = req.params.id;
  const status = emailService.getStatus(emailId);
  res.json({ emailId, status });
});

app.get('/emails',(req,res)=>{
  var mails=emailService.getMails();
  var arr=Array.from(mails, ([to,body]) => ({ to,body:Array.from(body) }));
  res.json({Mails:arr});
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

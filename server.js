const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password"
  }
});

app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  try {
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Reminder from Trust AI Moderator",
      text: message
    });

    res.send("Email sent successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email.");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
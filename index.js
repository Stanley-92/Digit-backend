const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(express.json())

let verificationCodes = {}

app.post('/send-code', async (req, res) => {
  const { email } = req.body
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  verificationCodes[email] = code

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your@gmail.com',
        pass: 'your-app-password'
      }
    })

    await transporter.sendMail({
      from: '"iFeed Verification" <your@gmail.com>',
      to: email,
      subject: 'Your iFeed Verification Code',
      text: `Your iFeed verification code is: ${code}`
    })

    console.log(`Sent code ${code} to ${email}`)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ success: false, error: 'Failed to send email' })
  }
})

app.post('/verify-code', (req, res) => {
  const { email, code } = req.body

  if (verificationCodes[email] && verificationCodes[email] === code) {
    delete verificationCodes[email] // Remove after verification
    res.json({ success: true })
  } else {
    res.json({ success: false, message: 'Invalid code' })
  }
})

// ⚠️ IMPORTANT: Use process.env.PORT for Render deployment
const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`)
})

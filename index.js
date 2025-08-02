const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(express.json())

let verificationCodes = {} // Temporary store

app.post('/send-code', async (req, res) => {
  const { email } = req.body
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  verificationCodes[email] = code

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your@gmail.com',          // ✅ Your Gmail
        pass: 'your-app-password'        // ✅ Gmail App Password
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

app.listen(3001, () => {
  console.log('✅ Email backend running at http://localhost:3001')
})



// Verify Code Endpoint
app.post('/verify-code', (req, res) => {
  const { email, code } = req.body

  console.log(`Verifying code for ${email}: Entered=${code}, Expected=${verificationCodes[email]}`)

  if (verificationCodes[email] === code) {
    // ✅ Code Matched
    delete verificationCodes[email]  // Optional: Clear code after verification
    return res.status(200).json({ success: true })
  }

  // ❌ Code did not match
  return res.status(400).json({ success: false, message: 'Invalid code' })
})

const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//   to:'weston@ohiogray.org',
//   from: 'weston@ohiogray.org',
//   subject: 'This is my first creation',
//   text: 'I hope this actually gets to you.'
// }).then(()=>{
//   console.log('Email sent')
// }).catch((error)=>{
//   console.log(error)
// })

const sendWelcomeEmail = (email, name)=>{
  sgMail.send({
    to:email,
    from: 'weston@ohiogray.org',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}.  Let me know how you get along with the app.`,
  })
}

const sendCancelationEmail = (email, name)=>{
  sgMail.send({
    to: email,
    from: 'weston@ohiogray.org',
    subject: 'Cancelation request',
    text: `Goodbye ${name}, I hope to see you back sometime soon.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}
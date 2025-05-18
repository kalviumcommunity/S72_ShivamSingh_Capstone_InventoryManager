const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const AppError = require('./appError');
const path = require('path');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Inventory Manager <${process.env.SMTP_USER}>`;
    console.log('Email constructor initialized with:', {
      to: this.to,
      firstName: this.firstName,
      from: this.from
    });
  }

  newTransport() {
    console.log('Creating email transport with config:', {
      user: process.env.SMTP_USER,
      pass: 'APP_PASSWORD_EXISTS: ' + !!process.env.SMTP_PASS
    });

    // Create a transporter for development using Gmail
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      debug: true,
      logger: true
    });
  }

  // Send the actual email
  async send(template, subject) {
    try {
      console.log('Starting email send process for template:', template);
      
      // 1) Render HTML based on a pug template
      const templatePath = path.join(__dirname, '..', 'views', 'email', `${template}.pug`);
      console.log('Template path:', templatePath);
      
      if (!require('fs').existsSync(templatePath)) {
        console.error('Template not found at path:', templatePath);
        throw new Error(`Email template not found at: ${templatePath}`);
      }

      const html = pug.renderFile(templatePath, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });
      console.log('HTML template rendered successfully');

      // 2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html, {
          wordwrap: 130
        })
      };
      console.log('Mail options prepared:', {
        from: this.from,
        to: this.to,
        subject
      });

      // 3) Create a transport and send email
      const transport = this.newTransport();
      console.log('Transport created, attempting to send email');
      
      const info = await transport.sendMail(mailOptions);
      console.log('Email sent successfully. Message ID:', info.messageId);
      
      return info;
    } catch (error) {
      console.error('Detailed error in send method:', {
        error: error.message,
        stack: error.stack,
        code: error.code,
        command: error.command
      });
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Inventory Manager Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
}; 
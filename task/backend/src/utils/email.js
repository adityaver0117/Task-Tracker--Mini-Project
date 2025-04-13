const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' ? true : false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


const sendTaskReminder = async (options) => {
  try {
    const mailOptions = {
      from: `"Task Manager" <${process.env.EMAIL_USER || 'noreply@taskmanager.com'}>`,
      to: options.to,
      subject: options.subject || 'Task Deadline Reminder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Task Reminder</h2>
          <p>Hello,</p>
          <p>This is a reminder that your task <strong>${options.task.title}</strong> is approaching its deadline.</p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px;">
            <h3 style="margin-top: 0; color: #3c74d0;">${options.task.title}</h3>
            <p><strong>Description:</strong> ${options.task.description || 'No description provided'}</p>
            <p><strong>Status:</strong> ${options.task.status}</p>
            <p><strong>Priority:</strong> ${options.task.priority}</p>
            <p><strong>Deadline:</strong> ${new Date(options.task.deadline).toLocaleString()}</p>
            <p><strong>Current Progress:</strong> ${options.task.progress}%</p>
          </div>

          <p style="margin-top: 20px;">Please make sure to complete this task before the deadline.</p>
          <p>Thank you,<br>Task Manager Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendTaskReminder
};
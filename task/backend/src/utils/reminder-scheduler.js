const Task = require('../models/task.model');
const User = require('../models/user.model');
const { sendTaskReminder } = require('./email');

const checkTaskDeadlines = async () => {
  try {
    const now = new Date();
    const tasks = await Task.find({
      deadline: {
        $gt: now,
        $lt: new Date(now.getTime() + 24 * 60 * 60 * 1000)
      },
      reminderSent: false,
      status: { $ne: 'Completed' }
    }).populate('owner');

    console.log(`Found ${tasks.length} tasks with upcoming deadlines`);

    for (const task of tasks) {
      try {
        await sendTaskReminder({
          to: task.owner.email,
          subject: `Reminder: Task "${task.title}" deadline approaching`,
          task: task
        });

        task.reminderSent = true;
        await task.save();

        console.log(`Reminder sent for task: ${task._id}`);
      } catch (error) {
        console.error(`Failed to send reminder for task ${task._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in checkTaskDeadlines:', error);
  }
};


const initReminderScheduler = (intervalMinutes = 60) => {
  console.log(`Initializing reminder scheduler to run every ${intervalMinutes} minutes`);

  checkTaskDeadlines();

  setInterval(checkTaskDeadlines, intervalMinutes * 60 * 1000);
};

module.exports = {
  initReminderScheduler,
  checkTaskDeadlines
};
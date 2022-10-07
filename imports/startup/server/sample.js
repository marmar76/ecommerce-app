
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../../api/tasks/tasks.js';
// import '/imports/api/tasksMethods';
// import '/imports/api/tasksPublications';

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'takina';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    const userId = Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    Meteor.users.update({
      _id: userId
    }, {
      $set: {isAdmin: true}
    })
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(taskText => insertTask(taskText, user));
  }
});

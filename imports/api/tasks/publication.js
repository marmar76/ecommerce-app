import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../tasks/tasks';

Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find({ userId: this.userId });
});

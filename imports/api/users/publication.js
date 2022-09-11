import { Meteor } from 'meteor/meteor'

Meteor.publish('users.all', function () {  
    return Meteor.users.find({}, {
        createdAt: 1, username: 1, emails: 1, name: 1, status: 1, services: 0,
        gender: 0
    })
})
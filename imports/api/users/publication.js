import { Meteor } from 'meteor/meteor'

Meteor.publish('users.all', function () {  
    return Meteor.users.find({}, {
       
    })
})

Meteor.publish('my.user', function () {  
    return Meteor.users.find({_id: Meteor.userId()}, {
       
    })
})
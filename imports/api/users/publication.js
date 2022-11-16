import { Meteor } from 'meteor/meteor'

Meteor.publish('users.all', function () {  
    return Meteor.users.find({}, {
       
    })
})

Meteor.publish('my.user', function () {  
    return Meteor.users.findOne({_id: Meteor.userId()}, {
       
    })
})

Meteor.publish('user.chat', function () {  
    return Meteor.users.find({_id: Meteor.userId()}, {
        fields: {chats: 1, readStatus: 1, username: 1, name: 1}
    })
})
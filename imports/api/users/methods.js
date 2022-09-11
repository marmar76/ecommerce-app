import {
    Meteor
} from 'meteor/meteor';
import {
    check
} from 'meteor/check';

Meteor.methods({
    'registerUser'(username, email, password) {
        check(username, String)
        check(email, String)
        check(password, String)
        return Accounts.createUser({
            username,
            email,
            password
        })
    },
    async 'registerAdmin'(data, profile) {
        check(data, Object)
        check(data.username, String)
        check(data.email, String)
        check(data.password, String)
        
        check(profile, Object)
        check(profile.name, String)
        check(profile.gender, String)
        check(profile.dob, Date)
        check(profile.address, String)
        
        profile.status = true
        profile.createdAt = new Date()
        profile.createtBy = Meteor.userId()
        // Pa$$w0rd!
        const userId = Accounts.createUser(data)
        if(userId){
            return Meteor.users.update({
                "_id": userId
            }, {
                $set: profile
            });
        }
    }
})
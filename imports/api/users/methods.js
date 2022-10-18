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
        const userId = Accounts.createUser({
            username,
            email,
            password
        })
        if(userId){
            return Meteor.users.update({
                "_id": userId
            }, {
                $set: {isAdmin: false}
            });
        }
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
        profile.isAdmin = true
        // Pa$$w0rd!
        const userId = Accounts.createUser(data)
        if(userId){
            return Meteor.users.update({
                "_id": userId
            }, {
                $set: profile
            });
        }
    },
    'getOneUser'(id){
        check(id,String);
        return Meteor.users.findOne({_id: id});
    },
    async 'getMyself'(){
        // check(id,String);
        const user = Meteor.users.findOne({_id: Meteor.userId()});
        if(user.profilePicture && false){
            const profilePictureLink = await getFireImage('user/picture', user.profilePicture)
            user.profilePicture = profilePictureLink
        }
        
        return user
    },
    'updateMyself'(data){
        return Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $set: data
        })
    },
    'bannedUser'(id){
        check(id,String);
        return Meteor.users.update({_id: id},{$set: {
            status: false
        }})
    }
})
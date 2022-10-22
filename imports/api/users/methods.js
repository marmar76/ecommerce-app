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
        if(user && user.profilePicture){
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
    'updateUserAddress'(data, pos, userId){
        const user = Meteor.users.findOne({_id: userId ? userId : Meteor.userId()})
        // if(!user.address){
        //     user.address = [data]
        // }
        // else{
        //     user.address.push(data)
        // }
        if(data.isDefault){
            user.address = user.address.map(function (x) {  
                x.isDefault = false
                return x
            })
        }
        user.address[pos] = data
        return Meteor.users.update({
            _id: userId ? userId : Meteor.userId()
        }, {$set: user})
    },
    'addUserAddress'(data, userId){
        const user = Meteor.users.findOne({_id: userId ? userId : Meteor.userId()})
        if(!user.address){
            data.isDefault = true
            user.address = [data]
        }
        else{
            if(data.isDefault){
                user.address = user.address.map(function (x) {  
                    x.isDefault = false
                    return x
                })
            }
            user.address.push(data)
        }
        return Meteor.users.update({
            _id: userId ? userId : Meteor.userId()
        }, {$set: user})
    },
    'deleteUserAddress'(pos, userId){
        const user = Meteor.users.findOne({_id: userId ? userId : Meteor.userId()})
        user.address.splice(pos, 1)
        return Meteor.users.update({
            _id: userId ? userId : Meteor.userId()
        }, {$set: user})
    },
    'bannedUser'(id){
        check(id,String);
        return Meteor.users.update({_id: id},{$set: {
            status: false
        }})
    }
})
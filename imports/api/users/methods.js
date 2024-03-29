import {
    Meteor
} from 'meteor/meteor';
import {
    check
} from 'meteor/check';

Meteor.methods({
    'registerUser'(username, email, password, data) {
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
                $set: {
                    isAdmin: false,
                    isBanned: false, 
                    status: true,
                    name: data.name,
                    dob: data.dob,
                    gender: data.gender,
                    phone: data.phone,
                }
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
        
        // profile.createdAt = new Date()
        // profile.createtBy = Meteor.userId()
        // profile.isAdmin = true
        // Pa$$w0rd!
        const userId = Accounts.createUser(data)
        if(userId){
            return Meteor.users.update({
                "_id": userId
            }, {
                $set: 
                {
                    name: profile.name, 
                    gender: profile.gender,
                    dob: profile.dob,
                    phone: profile.phone,
                    createdAt: new Date(),
                    createdBy:Meteor.userId(),
                    isAdmin: true,
                    isBanned: false,
                    status: true
                }
            });
        }
    },
    'getOneUser'(id){
        check(id,String);
        return Meteor.users.findOne({_id: id});
    },
    'validateUserChat'(){
        const user = Meteor.users.findOne({_id: Meteor.userId()});
        if(user && !user.chats){
            user.chats = []
            user.readStatus = {
                admin: {
                    lastRead: null,
                    lastIndex: null
                },
                user: {
                    lastRead: null,
                    lastIndex: null    
                }
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: user})
        }
        else{
            user.readStatus.user = {
                lastRead: new Date(),
                lastIndex: user.chats.length
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: user})

        }
    },
    'sendUserMessage'(msg){
        const user = Meteor.users.findOne({_id: Meteor.userId()});
        // console.log(msg);
        if(user){
            user.chats.push({
                createdAt: new Date(),
                message: msg,
                admin: false
            })
            user.readStatus.user = {
                lastRead: new Date(),
                lastIndex: user.chats.length
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: user})
        }
        
    },
    'sendAdminMessage'(userId, msg){
        const me = Meteor.users.findOne({_id: Meteor.userId()})
        const user = Meteor.users.findOne({_id: userId});
        // console.log(msg);
        if(user){
            user.chats.push({
                createdAt: new Date(),
                message: msg,
                admin: {
                    username: me.username,
                    name: me.name,
                    userId: Meteor.userId()
                }
            })
            user.readStatus.admin = {
                lastRead: new Date(),
                lastIndex: user.chats.length
            }
            Meteor.users.update({_id: userId}, {$set: user})
        }

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
    'updateUser'(id, data){
        return Meteor.users.update({
            _id: id
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
        // console.log(user);
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
            isBanned: true
        }})
    },
    'unbannedUser'(id){
        check(id,String);
        return Meteor.users.update({_id: id},{$set: {
            isBanned: false
        }})
    },
    'deleteUser'(id){
        check(id,String);
        return Meteor.users.update({_id: id},{$set: {
            status: false
        }})
    },
    'setPasswordAsAdmin'(userid, password){
        Accounts.setPassword(userid, password, {logout: false})
    }
})
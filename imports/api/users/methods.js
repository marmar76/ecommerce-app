import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    'registerUser'(username, email, password){
        check(username, String)
        check(email, String)
        check(password, String)
        return Accounts.createUser({
            username, email, password
        })
    },
    'registerAdmin'(data){
        check (data.username,String)
        check (data.email,String)
        check (data.password,String)
        check (data.profile,Object)
        check (data.profile.name,String)
        check (data.profile.gender,Boolean)
        check (data.profile.dob,Date)
        check (data.profile.address,String)
        return Accounts.createUser(data)
    }
})
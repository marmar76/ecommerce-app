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
    }
})
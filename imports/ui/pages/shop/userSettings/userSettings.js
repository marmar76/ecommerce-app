import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment';
import './userSettings.html';

Template.userSettings.helpers({
    thisUser(){
        console.log(Meteor.user());
        return Meteor.user()
    },
})
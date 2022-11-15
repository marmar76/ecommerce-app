import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import {
    FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './support.html';

let TomJerry = null
Template.support.onCreated(function () {
    const self = this;
    self.user = new ReactiveVar()
    Meteor.call('getMyself', async function (err,res) {  
        if(err){
            console.log(err);
        }else{
            self.user.set(res)
        }
    })
    // Meteor.call('getOneJenis', paramId, paramId + "-0", function (err, res) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         self.jenisItem.set(res)
    //     }
    // })

})
Template.support.onRendered(function () {
    const self = this
    
})
Template.support.helpers({
    conversation(){
        // return Template.instance().comparison.get()
    },
    user(){
        const user = Template.instance().user.get()
        if(user){
            return user
        }
    },
    equals(a, b){
        return a == b
    }
})

Template.support.events({
    
})
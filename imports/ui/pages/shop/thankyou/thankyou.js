import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './thankyou.html'; 
// import { Snap } from 'midtrans-client';

Template.thankyou.onCreated(function () {
    ga('send','pageview')
    const self = this
    self.seconds = new ReactiveVar(5)
    const thisInterval = setInterval(() => {
        let thisSeconds = self.seconds.get()
        if(thisSeconds == 0){
            clearInterval(thisInterval)
            FlowRouter.go('homepage')
        }
        else{
            self.seconds.set(--thisSeconds)
        }
        // console.log(thisSeconds);
    }, 1000);
    // const paramId = FlowRouter.current().params._id
    
})
  
Template.thankyou.helpers({
    seconds(){
        return Template.instance().seconds.get()
    }
})
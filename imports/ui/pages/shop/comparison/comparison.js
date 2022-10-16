import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './comparison.html'; 


Template.comparison.onCreated(function () {
    const self = this;
    self.filtering = new ReactiveVar({
        filter: '',
        sort: 1,
    })
    this.item = new ReactiveVar();
    const paramId = FlowRouter.current().params._id
    Meteor.call('getAllItem', self.filtering.get(), function (err, res) {
        self.item.set(res.filter(function (x) {  
            return x.subcategory == paramId
        }));
    }) 
})
  
Template.comparison.helpers({
    items() {
        const items = Template.instance().item.get();
        if (items) {
            console.log(items);
          return items;
        }
    },
})

Template.comparison.events({
    

})
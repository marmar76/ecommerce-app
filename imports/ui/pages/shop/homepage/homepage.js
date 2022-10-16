import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment';
import './homepage.html'; 


Template.homepage.onCreated(function () {
    const self = this;
    self.filtering = new ReactiveVar({
        filter: '',
        sort: 1,
    })
    this.item = new ReactiveVar();
    this.category = new ReactiveVar();
    this.subcategory = new ReactiveVar();
    this.now = new ReactiveVar(-1);
    Meteor.call('getAllCategory', function (err, res) {
        self.category.set(res.filter(function (x) {
        return x.subcategory.length != 0
        }));
    });
    Meteor.call('getAllSubCategory', function (err, res) {
        self.subcategory.set(res);
    });
    Meteor.call('getAllItem', self.filtering.get(), function (err, res) {
        self.item.set(res);
    })
    
})
  
Template.homepage.helpers({
    items() {
        const items = Template.instance().item.get();
        if (items) {
          return items;
        }
    },
    lowerPrice(id){
        const items = Template.instance().item.get();
        if (items) {
            let models 
            let price = +999999999
            for (const i of items) {
                if(i._id == id){
                    models = i.models
                }
            }
            if(models){
                for (const i of models) {
                    if(+price > +i.price) {
                        price = i.price
                    }
                }
            }
            return price;
        }
    }
})

Template.homepage.events({
    

})
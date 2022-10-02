import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter, Router, RouterHelpers } from 'meteor/ostrio:flow-router-extra';

import './items.html'; 

Template.itemsClientDetailPage.onCreated(function () {  
    const self=this;
    this.item = new ReactiveVar();
})

Template.itemCreatePage.helpers({


})

Template.itemCreatePage.events({  
    'click #submit'(e,t){
        const name = $(itemsName).val();
        const price = +$(itemsPrice).val();
        const description = $(itemsDescription).val();
        const status = true;
        const data = { name, price,description,status}; 
        if(name.length === 0){
          failAlert("Nama tidak boleh kosong!")
        }
        else if(price < 1 || price.length === 0){
          failAlert("Price tidak boleh kosong!")
        }
        else{
          Meteor.call('createItem', data, function (error, res) {  
            console.log(error);
            console.log(res);
            if(error){
              failAlert(error);
            }
            else{
              successAlertBack();
            }
          }) 
        }

    }
})
Template.itemsClientDetailPage.onCreated(function () {  
    const self = this;
    const paramId = FlowRouter.getParam('_id'); 
    this.item = new ReactiveVar(); 
    Meteor.call('getOneItem', paramId, function (err,res) { 
      self.item.set(res);  
    })
})

Template.itemsClientDetailPage.helpers({
  item(){
    return Template.instance().item.get()
  }
})

Template.itemsClientDetailPage.events({  
     
})

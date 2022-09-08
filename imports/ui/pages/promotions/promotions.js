import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter, Router, RouterHelpers } from 'meteor/ostrio:flow-router-extra';

import './promotions.html'; 

Template.promotionCreatePage.onCreated(function () {  
    const self=this;
    this.promotion = new ReactiveVar();
})

Template.promotionCreatePage.helpers({


})

Template.promotionCreatePage.events({  
    'click #submit'(e,t){
        const name = $(promotionsName).val(); 
        const description = $(promotionsDescription).val();
        const status = true;
        const startDate = new Date($("#start").val());
        const expiredDate = new Date($("#end").val());
        const data = { name, startDate, expiredDate, description, status}; 
        if(name.length === 0){
          failAlert("Nama tidak boleh kosong!")
        }
        else if (!(startDate < expiredDate)) {
            failAlert("Tanggal Start harus kurang dari tanggal Expired")
        }
        else if(description.length == 0){
            failAlert("Description tidak boleh kosong")
        }
        else{
          Meteor.call('createPromotion', data, function (error, res) {  
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

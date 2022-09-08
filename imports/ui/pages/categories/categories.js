import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './categories.html';

Template.categoryCreatePage.onCreated(function () {  
    const self=this;
    this.category = new ReactiveVar();
})

Template.categoryCreatePage.helpers({

})

Template.categoryCreatePage.events({  
    'click #submit'(e,t){
        const name = $(categoryName).val();  
        const status = true;
        const data = { name, status}; 
        if(name.length === 0){
          failAlert("Nama tidak boleh kosong!")
        } 
        else{
          Meteor.call('createCategory', data, function (error, res) {  
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
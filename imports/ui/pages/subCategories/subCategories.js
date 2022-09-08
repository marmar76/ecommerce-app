import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './subCategories.html'
import { Categories } from '../../../api/categories/categories';

Template.subcategoryCreatePage.onCreated(function () {  
    const self=this;
    this.subCategory = new ReactiveVar();
    Meteor.call('getAllCategory', function (err,res) {
        self.subCategory.set(res);
    });
})

Template.subcategoryCreatePage.helpers({
    categories(){
        return Template.instance().subCategory.get();
    }

})

Template.subcategoryCreatePage.events({  
    'click #submit'(e,t){
        const getCategory = t.subCategory.get();
        const name = $(subCategoryName).val();  
        const categoryId = $(categories).val();
        const status = true;
        const category = getCategory.find((x)=>{
            return x._id == categoryId
        });
        const categoryName = category.name;
        const data = { name, status, categoryId, categoryName}; 
        if(name.length === 0){
          failAlert("Nama tidak boleh kosong!")
        } 
        else{
          Meteor.call('createSubCategory', data, function (error, res) {  
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
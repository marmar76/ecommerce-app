import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Categories,SubCategories } from './categories';

Meteor.methods({
    'createCategory'(param){
        check(param.name, String)  
        check(param.status, Boolean)
        return Categories.insert(param)
    },

    'createSubCategory'(param){
        check(param.name, String)
        check(param.status, Boolean)
        return SubCategories.insert(param)
    },

    'getAllCategory'(){
        const category = Categories.find().fetch();
        return category.map(function (x) {
            x.subcategory = SubCategories.find({
                categoryId:x._id
            }).fetch();    
            return x;
        })
        
    },
    // 'getAllSubCategory'(id){
    //     const subcategory = SubCategories.find(function (x) {x.categoryId == id  }).fetch();
    //     return subcategory;
    // }

})
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Categories,SubCategories } from './categories';

Meteor.methods({
    'createCategory'(param){
        check(param.name, String)  
        check(param.status, Boolean)
        return Categories.insert(param)
    },

    'createSubCategory'(param, specs){
        check(param.name, String)
        check(param.categoryId, String)
        check(param.categoryName, String)
        check(param.status, Boolean) 
        const id = SubCategories.insert(param)
        SubCategories.update({_id: id}, {$set: {
            specification: specs
        }}) 
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
    'getOneCategory'(id){
        check(id,String);
        return category.findOne({_id: id});
    },
    'getAllSubCategory'(){
        const subcategory = SubCategories.find().fetch();
        return subcategory;
    },
    'getOneSubCategory'(id){
        check(id,String);
        return SubCategories.findOne({_id: id});
    },
    'updateSubCategory'(id, param){
        check(param.name, String)
        check(param.categoryId, String)
        check(param.categoryName, String)
        check(param.status, Boolean) 
        return SubCategories.update({_id: id},{
            $set:param
        });
    }
    // 'getDetailSubCategory'(id){

    // }

})
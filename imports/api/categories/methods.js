import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Categories,SubCategories } from './categories';
import { Items } from '../items/items';

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

    'getAllCategory'(filtering){
        const thisFilter = {}
        const sort = {} 
        if (filtering) { 
            thisFilter.status = true  
        }
        const category = Categories.find(thisFilter,{
            sort:sort
        }).fetch(); 
        return category.map(function (x) {
            x.subcategory = SubCategories.find({
                categoryId:x._id
            }).fetch();    
            return x;
        })
        
    },
    'getOneCategory'(id){
        check(id,String);
        return Categories.findOne({_id: id});
    },
    'getAllSubCategory'(filtering){
        const thisFilter = {}
        const sort = {} 
        if (filtering) { 
            thisFilter.status = true  
        }
        const subcategory = SubCategories.find(thisFilter,{
            sort:sort
        }).fetch();
        return subcategory;
    },
    'getOneSubCategory'(id){
        check(id,String);
        return SubCategories.findOne({_id: id});
    },
    'getItemOnSubCategory'(id){
        const items = Items.find({subcategory: id}).fetch()
        const totalItems = []
        for (const i of items) {
            for (const j of i.models) {
                j.id = totalItems.length
                totalItems.push(j)
            }
        }
        return totalItems

    },
    'updateSubCategory'(id, param){
        check(param.name, String)
        check(param.categoryId, String)
        check(param.categoryName, String)
        check(param.status, Boolean) 
        return SubCategories.update({_id: id},{
            $set:param
        });
    },
    'deleteCategory'(id){
        check(id, String)
        return Categories.update({_id: id},{
            $set:{
                status:false
            }
        })
    },
    'updateCategory'(id,name){
        check(id, String)
        return Categories.update({_id: id},{
            $set:{
                name:name
            }
        })
    },
    'deleteSubCategory'(id){
        check(id, String)
        return SubCategories.update({_id: id},{
            $set:{
                status:false
            }
        })
    },
    'updateSubCategory'(id,param){
        check(param.name, String)
        check(param.categoryId, String)
        check(param.categoryName, String)
        check(param.status, Boolean) 
        check(id, String)
        SubCategories.update({_id: id}, {
            $set: param
        }) 
    },
    // 'getDetailSubCategory'(id){

    // }

})
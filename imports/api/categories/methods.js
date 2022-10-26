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
        console.log(filtering);
        thisFilter.status = true  
        const category = Categories.find(thisFilter,{
            sort:sort
        }).fetch(); 
        if(filtering){
            console.log(filtering.filter);
            return category.filter(function (x) {
                return x.name.toLowerCase().includes(filtering.filter.toLowerCase());
            }).map(function (x) {
                x.subcategory = SubCategories.find({
                    categoryId:x._id,
                    status: true
                }).fetch();    
                return x;
            })
        }
        return category
    },
    'getOneCategory'(id){
        check(id,String);
        return Categories.findOne({_id: id});
    },
    'getAllSubCategory'(filtering){
        const thisFilter = {}
        const sort = {} 
        thisFilter.status = true  
        console.log(thisFilter);
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
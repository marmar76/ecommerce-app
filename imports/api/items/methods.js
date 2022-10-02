import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Items } from './items';

Meteor.methods({
    'createItem'(item){
        check(item.name, String)
        check(item.price, Number)
        check(item.description, String)
        check(item.weight, Number)
        check(item.stock, Number)
        check(item.condition, String)
        check(item.subcategoryId, String)
        check(item.categoryId, String)
        check(item.categoryName, String)
        check(item.status, Boolean)
        item.createdAt = new Date()
        return Items.insert(item)
    },
    'getAllItem'(filtering){
        const thisFilter = {}
        const sort = {}
        if (filtering) {
        if ((+filtering.sort) === 1) {
            sort.price = 1
        } else if ((+filtering.sort) === 2) {
            sort.price = -1
        } 
        if(filtering.hargaAwal || filtering.hargaAkhir)
        {
            thisFilter.price = {}
        }
        if(filtering.hargaAwal){
            thisFilter.price.$gte = filtering.hargaAwal
        }
        if(filtering.hargaAkhir){
            thisFilter.price.$lte = filtering.hargaAkhir
        } 
        // if(filtering.dateFrom){
        //     thisFilter.createdAt = {$gte: filtering.dateFrom}
        // } 
            thisFilter.status = true
            if((filtering.filtercategory) && (+filtering.filtercategory) != -1){
                thisFilter.categoryId = filtering.filtercategory.toString();
                if((filtering.filtersubcategory)  && (+filtering.filtersubcategory) != -1){
                    thisFilter.subcategoryId = filtering.filtersubcategory.toString();
                }
            }
            
        }
        console.log(thisFilter);
        const item = Items.find(thisFilter, {
        sort: sort
        }).fetch();
        // console.log(item);
        if (filtering) {
            return item.filter(function (x) {
                return x.name.toLowerCase().includes(filtering.filter.toLowerCase());
            })
        }
        return item;
    },
    'getOneItem'(id){
        check(id,String);
        return Items.findOne({_id: id});
    }, 
    'deleteItem'(id){
        check(id,String)
        return Items.update({_id: id}, {$set: {
            status: false
        }})
    }
})
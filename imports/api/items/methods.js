import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Items } from './items';
import { Categories, SubCategories } from '../categories/categories';

Meteor.methods({
    'createItem'(item, models){
        // check(item.name, String)
        // check(item.price, Number)
        // check(item.description, String)
        // check(item.weight, Number)
        // check(item.stock, Number)
        // check(item.condition, String)
        // check(item.subcategoryId, String)
        // check(item.categoryId, String)
        // check(item.categoryName, String)
        // check(item.status, Boolean)
        item.createdAt = new Date()
        item.createdBy = Meteor.userId()
        item.status = true
        const id = Items.insert(item)
        Items.update({_id: id}, {$set: {
            models: models.map(function (x, i) {  
                x.itemId = id + "-" + i
                return x
            })
        }})
    },
    'getAllItem'(filtering){
        const thisFilter = {}
        const sort = {}
        if (filtering) {
        // if ((+filtering.sort) === 1) {
        //     sort.price = 1
        // } else if ((+filtering.sort) === 2) {
        //     sort.price = -1
        // } 
        // if(filtering.hargaAwal || filtering.hargaAkhir)
        // {
        //     thisFilter.price = {}
        // }
        // if(filtering.hargaAwal){
        //     thisFilter.price.$gte = filtering.hargaAwal
        // }
        // if(filtering.hargaAkhir){
        //     thisFilter.price.$lte = filtering.hargaAkhir
        // } 
        // if(filtering.dateFrom){
        //     thisFilter.createdAt = {$gte: filtering.dateFrom}
        // } 
            thisFilter.status = true
            if((filtering.filtercategory) && (+filtering.filtercategory) != -1){
                thisFilter.category = filtering.filtercategory.toString();
                if((filtering.filtersubcategory)  && (+filtering.filtersubcategory) != -1){
                    thisFilter.subcategory = filtering.filtersubcategory.toString();
                }
            }
            
        }
        console.log(thisFilter);
        const item = Items.find(thisFilter, {
            sort: sort
        }).fetch();
        const categories = Categories.find().fetch()
        const subcategories = SubCategories.find().fetch()
        // console.log(item);
        if (filtering) {
            return item.filter(function (x) {
                return x.name.toLowerCase().includes(filtering.filter.toLowerCase());
            }).map(function (y) {  
                const thisCategory = categories.find((x) => y.category == x._id)
                const thisSubcategory = subcategories.find((x) => y.subcategory == x._id)
                y.categoryName = thisCategory.name
                y.subcategoryName = thisSubcategory.name
                const lowestPrice = y.models.sort(function (a, b) {  
                    return a.price - b.price
                })
                y.price = lowestPrice[0].price
                return y
            })
        }
        return item;
    },
    'getOneItem'(id){
        check(id,String);
        const thisItem = Items.findOne({_id: id});
        const thisCategory = Categories.findOne({_id: thisItem.category})
        const thisSubcategory = SubCategories.findOne({_id: thisItem.subcategory})
        thisItem.categoryName = thisCategory.name
        thisItem.subcategoryName = thisSubcategory.name
        return thisItem
    }, 
    'getSpecificItems'(id){
        check(id,String);
        const thisItem = Items.find({subcategory: id}); 
        return thisItem
    }, 
    'getOneJenis'(id, idJenis){
        check(id,String);
        check(idJenis,String);
        const thisItem = Items.findOne({_id: id});
        const thisModel = thisItem.models
        let oneModel 
        for (const i of thisModel) {
            if(i.itemId == idJenis) {
                oneModel = i  
                // console.log(oneModel);
            }
        } 
        return oneModel
    }, 
    'deleteItem'(id){
        check(id,String)
        return Items.update({_id: id}, {$set: {
            status: false
        }})
    }
})
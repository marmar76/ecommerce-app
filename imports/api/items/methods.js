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
        return Items.insert(item)
    },
    'getAllItem'(filtering){
        const thisFilter = {}
        const sort = {}
        if (filtering) {
        // if ((+filtering.sort) === 1) {
        //     sort.name = 1
        // } else if ((+filtering.sort) === 2) {
        //     sort.name = -1
        // } else if ((+filtering.sort) === 3) {
        //     sort.typeName = 1
        // } else if ((+filtering.sort) === 4) {
        //     sort.typeName = -1
        // }
            thisFilter.status = true
            if(+(filtering.filtercategory) != -1){
                thisFilter.categoryId = filtering.filtercategory.toString();
            }
            if(+(filtering.filtersubcategory) != -1){
                thisFilter.subcategoryId = filtering.filtersubcategory.toString();
            }
        }
        const item = Items.find(thisFilter, {
        sort: sort
        }).fetch();
        if (filtering) {
            return item.filter(function (x) {
                return x.name.toLowerCase().includes(filtering.filter.toLowerCase());
            })
        }
        return item;
    }
})
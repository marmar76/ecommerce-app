import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Items } from './items';

Meteor.methods({
    'createItem'(item){
        check(item.name, String)
        check(item.price, Number)
        check(item.description, String)
        check(item.status, Boolean)
        return Items.insert(item)
    }
})
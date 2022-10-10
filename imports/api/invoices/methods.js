import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { Invoices } from './invoices';

Meteor.methods({
    'createInvoice'(data){
        check(data.userId, String)
        check(data.userUsername, String)
        check(data.items, Array)
        check(data.totalPurchase, Number)
        check(data.discount, Number)
        check(data.promotionId, String)
        check(data.promotionCode, String)
        check(data.createdBy, String)
        return Invoices.insert(data)
    },  

})
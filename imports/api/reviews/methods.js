import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Reviews } from './reviews';
import { Items } from '../items/items';
import {Invoices} from '../invoices/invoices';

Meteor.methods({
    'createReview'(data){ 
        const invoice = Invoices.findOne({_id:data.invoiceId})
        const model = invoice.items[data.modelIndex]
        model.isReviewed = true 
        invoice.items[data.modelIndex] = model
        Invoices.update({_id: data.invoiceId}, {$set: invoice})
        return Reviews.insert(data)
    },

})
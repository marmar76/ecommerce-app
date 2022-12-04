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
    'getItemReview'(item_id){
        let review = Reviews.find({itemId:item_id}).fetch()
        const item = Items.findOne({_id:item_id})
        review = review.map(function (x) {  
            for (const val of item.models) {
                if(val.itemId == x.modelId){
                    x.modelName = item.name+ ' - ' + val.name 
                }
            }
            return x
        })
        console.log(review);
        return review
    }
})
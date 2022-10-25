import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { Carts } from './carts';

Meteor.methods({
    'createCart'(data){
        check(data.username, String)  
        check(data.userId, String)  
        check(data.items, Array)
        check(data.grandtotal, Number)
        // check(data.name, String)  
        // check(data.itemId, String)  
        // check(data.weight, Number)  
        // check(data.price, Number)  
        // check(data.quantity, Number)  
        check(data.status, Boolean)
        return Carts.insert(data)
    }, 
    'getOneCart'(id){
        check(id,String);
        return Carts.findOne({userId: id});
    },
    'getMyCart'(){
        return Carts.findOne({userId: Meteor.userId()})
    },
    'updateCart'(id,data){ 
        check(id,String); 
        check(data.items, Array)   
        console.log(data);
        return Carts.update({
            userId:id 
        },{
            $set: {
                items:data.items,
                grandtotal: data.grandtotal
            }
        })
    },
    'deleteOneItemCart'(id,itemId){
        check(id,String)
        check(itemId,String) 
        const cart = Carts.findOne({userId: id})
        const items = cart.items
        const arrItems = []
        let index=-1
        let grandtotal = 0
        for (let i = 0; i < items.length; i++) {
            if(items[i].itemId != itemId) {
                arrItems.push(items[i])
                grandtotal += items[i].subtotal
            }
        }  
        return Carts.update({
            userId:id 
        },{
            $set: {
                items:arrItems,
                grandtotal
            }
        })
    },
    // 'getDetailSubCategory'(id){

    // }

})
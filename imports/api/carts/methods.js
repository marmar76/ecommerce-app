import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { Carts } from './carts';

Meteor.methods({
    'insertCart'(data){
        const thisUser = Meteor.users.findOne({_id: Meteor.userId()})
        if(!thisUser.cart){
            thisUser.cart = [data]
        }
        else{
            const existingItem = thisUser.cart.find((x) => x.itemId == data.itemId)
            if(existingItem){
                existingItem.qty += +data.qty
            }
            else{
                thisUser.cart.push(data)
            }
        }
        return Meteor.users.update({_id: Meteor.userId()}, {$set: thisUser})
    },
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
    async 'getMyCart'(){
        const thisUser = Meteor.users.findOne({_id: Meteor.userId()})
        if(thisUser){
            if(thisUser.cart){
                const cart = thisUser.cart.map(async function (x) {
                    const itemId = x.itemId.split('-')
                    const item = Items.findOne({_id: itemId[0]})
                    const thisModel = item.models[itemId[1]]
                    if(item.picture){
                        try {
                            const profilePictureLink = await getFireImage('items/picture', item.picture)
                            item.link = profilePictureLink
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    return {
                        name: item.name + " - " + thisModel.name,
                        price: thisModel.price,
                        stock: thisModel.stock,
                        qty: x.qty,
                        weight: item.weight,
                        link: item.link
                    }
                })
                return await Promise.all(cart)
            }
            else{
                return []
            }
        }
        // return Carts.findOne({userId: Meteor.userId()})
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
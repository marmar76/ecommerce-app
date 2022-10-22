import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './cart.html'; 

Template.cart.onCreated(function () {
    const self = this
    // const paramId = FlowRouter.current().params._id   
    this.cart = new ReactiveVar()
    Meteor.call('getMyCart',function (err, res) {  
        if(err){
            console.log(err);
        }else{
            self.cart.set(res)
        }
    })
    console.log(this.cart);
})
  
Template.cart.helpers({
    carts(){
        const cart = Template.instance().cart.get()
        if(cart)
        {
            console.log(cart);
            return cart
        }
    }, 
    totalItem(){
        const cart = Template.instance().cart.get()
        if(cart){
            let qty = 0 
            for (const i of cart.items) {
                qty += +i.quantity
            }
            return qty
        }
    },
})

Template.cart.events({
    'change .itemQty'(e, t){
        const item = $(e.target)
        const qty = $(e.target).val();
        const id = FlowRouter.current().params._id   
        const cart = Template.instance().cart.get()
        const itemId = item.attr('own')
        console.log(itemId);
        const items =[]
        for (const i of cart.items) {
            if(i.itemId == itemId){
                i.quantity = +qty
                i.subtotal= +i.quantity * +i.price 
            }
            items.push(i)
        } 
        console.log(items);
        let grandtotal = 0
        for (const i of items) {
            console.log(i.subtotal);
            grandtotal += +i.subtotal
        }
        const data = {
            items,
            grandtotal:+grandtotal
        }
        console.log(+grandtotal);
        Meteor.call('updateCart', id, data, function (err, res) {  
            if(err){
                console.log(err);
            }else{ 
                console.log("berhasil update");
                Meteor.call('getOneCart', id, function (err, res) {  
                    if(err){
                        console.log(err);
                    }else{
                        t.cart.set(res)
                    }
                })
            }
        })
    },
    'click .btnDelete'(e, t){
        const item = $(e.target)
        const itemId = $(e.target).val();
        const id = FlowRouter.current().params._id 
        Meteor.call('deleteOneItemCart', id, itemId, function (err, res) {
            if(err){
                console.log(err);
            }else{
                Meteor.call('getOneCart', id, function (err, res) {  
                    if(err){
                        console.log(err);
                    }else{
                        t.cart.set(res)
                    }
                })
            }
        })
    },

})
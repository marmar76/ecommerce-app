import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './cart.html'; 

Template.cart.onCreated(function () {
    const self = this
    // const paramId = FlowRouter.current().params._id   
    this.cart = new ReactiveVar()
    this.allowUpdate = new ReactiveVar(false)
    Meteor.call('getMyCart',function (err, res) {  
        if(err){
            console.log(err);
        }else{
            self.cart.set(res)
            setTimeout(() => {
                self.allowUpdate.set(true)
            }, 2000);
        }
    })
    // console.log(this.cart);
})
  
Template.cart.helpers({
    carts(){
        const cart = Template.instance().cart.get()
        if(cart)
        {
            // console.log(cart);
            return cart
        }
    }, 
    totalItem(){
        const cart = Template.instance().cart.get()
        if(cart){
            let qty = 0 
            let total = 0
            for (const i of cart.filter((x) => x.status)) {
                qty += +i.qty
                total += +i.qty * +i.price
            }
            $("#grand-total").html(formatRp(total));
            return qty
        }
    },
    multiply(a, b){
        return formatRp(parseInt(a) * parseInt(b))
    },
})

Template.cart.events({
    'click .btn-plus'(e, t){
        const cart = t.cart.get()
        const thisItemId = $(e.target).val()
        const thisItem = cart.find((x) => x.itemId == thisItemId)
        const quantity = $("#quantity-"+thisItemId).val();;
        if(quantity){
            $("#quantity-"+thisItemId).val((+quantity) + 1);
            // thisItem.qty = ((+quantity) + 1);
        }
        else $("#quantity-"+thisItemId).val(1);
        $("#quantity-"+thisItemId).trigger('input')
        // t.cart.set(cart)
    },
    'click .item-change'(e, t){
        // const cart = t.cart.get()
        const thisItemId = $(e.target).attr('own')
        $("#quantity-"+thisItemId).trigger('input')
        // const thisItem = cart.find((x) => x.itemId == thisItemId)
        // thisItem.status = $(e.target).is(':checked')
        
        // t.cart.set(cart)
        
    },
    'click .btn-min'(e, t){
        const cart = t.cart.get()
        const thisItemId = $(e.target).val()
        const thisItem = cart.find((x) => x.itemId == thisItemId)
        const quantity = $("#quantity-"+thisItemId).val();
        // const quantity = thisItem.qty;
        // const quantity = $("#quantity").val();
        if(quantity){
            let res = (+quantity) - 1
            if(res == 0){
                $("#quantity-"+thisItemId).val(1);
                // thisItem.qty = 1;
            }
            else $("#quantity-"+thisItemId).val(res);
        }
        else $("#quantity-"+thisItemId).val(1);
        $("#quantity-"+thisItemId).trigger('input')
        // t.cart.set(cart)
        // else $("#quantity").val(1);
        
    },
    'input .input-qty'(e, t){
        const item = $(e.target)
        const qty = +$(e.target).val();   
        const cart = Template.instance().cart.get()
        const itemId = item.attr('own')
        const status = $("#item-check-"+itemId).is(":checked");
        const thisItem = cart.find(function (x) { return x.itemId == itemId })
        if(thisItem && qty != 0){
            thisItem.qty = +qty
            thisItem.status = status
            if(t.allowUpdate.get()){
                console.log(cart);
                Meteor.call('updateCartv2',cart.map(function (x) { return {itemId: x.itemId, qty: x.qty, status: x.status} }), function (err, res) {  
                    if(err){
                        console.log(err);
                    }else{ 
                        t.cart.set(cart)
                        t.allowUpdate.set(false)
                        setTimeout(() => {
                            t.allowUpdate.set(true)
                        }, 200);
                        // e.preventDefault()
                    }
                })
            }
        }
    },
    'click .btnDelete'(e, t){
        const itemId = $(e.target).val();
        Meteor.call('deleteOneItemCart', itemId, function (error, result) {
            if(error){
                console.log(error);
            }else{
                Meteor.call('getMyCart',function (err, res) {  
                    t.cart.set(res)
                })
            }
        })
    },

})
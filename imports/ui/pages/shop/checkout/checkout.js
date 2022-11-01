import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './checkout.html'; 
import { Snap } from 'midtrans-client';

Template.checkout.onCreated(function () {
    const self = this
    // const paramId = FlowRouter.current().params._id
    this.cart = new ReactiveVar()
    this.discount = new ReactiveVar(0)
    this.ongkir = new ReactiveVar(0)
    this.promotion = new ReactiveVar();
    this.user = new ReactiveVar()
    const currentDt = moment().startOf('day').toDate() 
    Meteor.call('getTodayPromotion', currentDt, function (err, res) {
        console.log(res);
        self.promotion.set(res);
    });
    Meteor.call('getMyCart', function (err, res) {  
        if(err){
            console.log(err);
        }else{
            console.log(res);
            self.cart.set(res)
        }
    })
    Meteor.call('getMyself', async function (err,res) {  
        if(err){
            console.log(err);
        }else{
            self.user.set(res)
        }
    })
    this.clientKey = new ReactiveVar()
    Meteor.call('clientKey', function (err, res) {  
        if(err){
            console.log(err);
        }
        else{
            self.clientKey.set(res)      
        }
    })
    
})
  
Template.checkout.helpers({
    carts(){
        const cart = Template.instance().cart.get()
        if(cart)
        { 
            return cart
        }
    }, 
    totalItem(){
        const cart = Template.instance().cart.get()
        if(cart){
            let qty = 0 
            for (const i of cart.filter((x) => x.status)) {
                qty += +i.qty
            }
            return qty
        }
    },
    discount(){
        const discount = Template.instance().discount.get()
        if(discount){
            return discount
        }
    },
    ongkir(){
        const ongkir = Template.instance().ongkir.get() 
        if(ongkir){
            return ongkir
        }
    },
    totalPurchase(){
        const cart = Template.instance().cart.get()
        const ongkir = Template.instance().ongkir.get()
        const discount = Template.instance().discount.get()
        if(cart){
            let grandtotal = cart.grandtotal
            let disc = discount * grandtotal / 100
            grandtotal += ongkir - disc
            return grandtotal
        } 
    },
    promotions(){
        const promotions = Template.instance().promotion.get()
        if(promotions){
            return promotions
        }
    },
    address(){
        const user = Template.instance().user.get()
        if(user)
        {
            //ini nanti indexnya bisa diganti kalau ganti alamat lain
            
            return user.address[0]
        }
    },
    clientKey(){
        const clientKey = Template.instance().clientKey.get()
        if(clientKey){
            return clientKey
        }
        return ''
    }
})

Template.checkout.events({
    'click #btnVoucher'(e, t){
        const code = $('#voucherCode').val(); 
        const promotions = Template.instance().promotion.get()
        let status = false
        let id
        for (const i of promotions) {
            if(i.code == code){
                status = true 
                id = i._id
                t.discount.set(i.discount) 
            }
        }
        const discount = Template.instance().discount.get()
        console.log(discount);
        if(status){
            console.log("voucher terpakai");
            $('.voucherDisabled').attr('disabled', 'disabled');
            Meteor.call('getOnePromotion', id, function (err, res) {
                if(err){
                    console.log(err);
                }else{
                    t.promotion.set(res)
                }
            })
        }else{
            console.log("voucher e gaono bos"); 
            t.discount.set(0)
        }
    },
    'click #btnCheckOut'(e, t){
        console.log('halo');
        const user = Template.instance().user.get()
        const cart = Template.instance().cart.get()
        const ongkir = Template.instance().ongkir.get()
        const discount = Template.instance().discount.get()
        const promotion = Template.instance().promotion.get()
        let grandtotal = cart.grandtotal
        let disc = discount * grandtotal / 100
        grandtotal += ongkir - disc

        console.log(user._id);
        console.log(user.username);
        console.log(cart.items);
        console.log(+grandtotal);
        console.log(+discount);
        console.log(promotion._id);
        console.log(promotion.code);
        console.log(user._id);

        const data = {
            userId: user._id,
            userUsername: user.username,
            items: cart.items,
            totalPurchase: +grandtotal,
            discount: +discount,
            // address:user.address[0],
            promotionId: promotion._id,
            promotionCode: promotion.code,
            // createdBy: user._id,
        }
        const items = cart.items.map(function (x) {  
            return {
                id: x.itemId,
                price: x.price,
                name: x.name,
                quantity: x.quantity
            }
        })
        console.log(items);
        Meteor.call('createInvoice', data, function (err, res) {  
            if(err){
                console.log(err);
            }else{
                snap.pay(res, {
                    onSuccess: function (result) {  
                        console.log("success", result);
                    },
                    onPending: function (result) {  
                        console.log("pending", result);
                    },
                    onError: function (result) {  
                        console.log("error", result);
                    }
                })
                // console.log(res);
            }
        })
    },

})
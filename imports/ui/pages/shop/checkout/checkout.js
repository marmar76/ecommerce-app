import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './checkout.html'; 

Template.checkout.onCreated(function () {
    const self = this
    const paramId = FlowRouter.current().params._id
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
    Meteor.call('getOneCart', paramId,function (err, res) {  
        if(err){
            console.log(err);
        }else{
            self.cart.set(res)
        }
    })
    Meteor.call('getOneUser', paramId, function (err,res) {  
        if(err){
            console.log(err);
        }else{
            self.user.set(res)
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
            for (const i of cart.items) {
                qty += +i.quantity
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
    }
})

Template.checkout.events({
    'click #btnVoucher'(e, t){
        const code = $('#voucherCode').val(); 
        const promotions = Template.instance().promotion.get()
        let status = false
        for (const i of promotions) {
            if(i.code == code){
                status = true 
                t.discount.set(i.discount)
            }
        }
        const discount = Template.instance().discount.get()
        console.log(discount);
        if(status){
            console.log("voucher terpakai");
            $('.voucherDisabled').attr('disabled', 'disabled');
        }else{
            console.log("voucher e gaono bos");
            t.discount.set(0)
        }
    },

})
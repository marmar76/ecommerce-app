import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './checkout.html'; 
// import { Snap } from 'midtrans-client';

Template.checkout.onCreated(function () {
    const self = this
    // const paramId = FlowRouter.current().params._id
    this.cart = new ReactiveVar()
    this.discount = new ReactiveVar(0)
    this.ongkir = new ReactiveVar(0)
    this.promotion = new ReactiveVar();
    this.user = new ReactiveVar()
    this.courier = new ReactiveVar([])
    this.promotion = new ReactiveVar([])
    this.selectedCourier = new ReactiveVar(null)
    const currentDt = moment().startOf('day').toDate() 
    Meteor.call('getTodayPromotion', currentDt, function (err, res) {
        console.log(res);
        self.promotion.set(res);
    });
    Meteor.call('getPromotion', function (err, res) {  
        console.log(res);
    })
    Meteor.call('getMyCart', function (err, res) {  
        if(err){
            console.log(err);
        }else{
            console.log(res);
            self.cart.set(res.filter((x) => x.status))
            $("#triger-change-alamat").trigger("click");

        }
    })
    Meteor.call('getMyself', async function (err,res) {  
        if(err){
            console.log(err);
        }else{
            self.user.set(res)
            // $("#triger-change-alamat").trigger("click");

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
            return ongkir.value
        }
    },
    totalPurchase(){
        const cart = Template.instance().cart.get()
        const ongkir = Template.instance().ongkir.get()
        const discount = Template.instance().discount.get()
        if(cart){
            let grandtotal = cart.reduce(function (prev, curr) {  
                if(curr.status){
                    return prev + +curr.qty * +curr.price
                }
                return prev
            }, 0)
            $("#total-purchase").html(formatRp(grandtotal));
            let disc = discount * grandtotal / 100
            grandtotal += (ongkir ? ongkir.value : 0) - disc
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
    },
    multiply(a, b){
        return formatRp(parseInt(a) * parseInt(b))
    },
    courier(){
        return Template.instance().courier.get()
    },
    selectedCourier(){
        return Template.instance().selectedCourier.get()
    }
})

Template.checkout.events({
    'change #select-duration'(e, t){
        const courier = t.courier.get()
        const value = e.target.value
        const thisCourier = courier.find((x) => x.label == value)
        if(thisCourier){
            t.selectedCourier.set(thisCourier.data.map(function (x, i) {  
                x.index = i + 1
                return x
            }))
            t.ongkir.set(null)
            $("#select-courier").val("0");
        }
        else{
            t.selectedCourier.set(null)
        }
    },
    'change #select-courier'(e, t){
        const value = e.target.value
        const selectedCourier = t.selectedCourier.get()
        if(selectedCourier){
            const thisCourier = selectedCourier.find((x) => x.index == value)
            if(thisCourier){
                t.ongkir.set(thisCourier)
                // console.log(selectedCourier);
            }
            else t.ongkir.set(null)
        }
    },
    'click #triger-change-alamat'(e, t){
        const address = JSON.parse($("#select-address").val());
        const cart = t.cart.get()
        if(address && cart){
            const weight = cart.reduce(function (prev, curr) {  
                return prev + (((+curr.qty) * (+curr.weight)) * 1000)
            },0)
            console.log(cart);
            console.log(address);
            Meteor.call('getOngkir', address.regency.city_id, weight, function (err, res) {  
                if(err){
                    failAlert(err.reason)
                }
                else{
                    t.courier.set(res)
                    console.log(res);
                }
            })
            
        }
        $("#select-courier").val("0");
        $("#select-duration").val("0");
        t.ongkir.set(null)
    },
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
        const address = JSON.parse($("#select-address").val());
        if(cart.length == 0){
            failAlert("Cart masih kosong !!")
        }
        else if(!address){
            failAlert('Mohon pilih alamat terlebih dahulu')
        }
        else if(!ongkir){
            failAlert('Mohon pilih kurir terlebih dahulu :)')
        }
        else{
            // const promotion = Template.instance().promotion.get()
            let grandtotal = cart.reduce(function (prev, curr) {  
                if(curr.status){
                    return prev + (+curr.qty * +curr.price)
                }
                return prev
            }, 0)
            let disc = discount * grandtotal / 100
            grandtotal += ongkir.value - disc
            const items = cart.map(function (x) {  
                return {
                    id: x.itemId,
                    price: +x.price,
                    name: x.name,
                    quantity: x.qty
                }
            })
            
            console.log(user._id);
            console.log(user.username);
            console.log(cart);
            console.log(+grandtotal);
            console.log(+discount);
            // console.log(promotion._id);
            // console.log(promotion.code);
            console.log(user._id);
    
            const data = {
                userId: user._id,
                userUsername: user.username,
                items,
                totalPurchase: +grandtotal,
                discount: +discount,
                ongkir,
                address,
                // promotionId: promotion._id,
                // promotionCode: promotion.code,
                // createdBy: user._id,
            }
            // const items = cart.filter((x) => x.status).map(function (x) {  
            //     return {
            //         id: x.itemId,
            //         price: x.price,
            //         name: x.name,
            //         quantity: x.quantity
            //     }
            // })
            console.log(data);
            Meteor.call('createInvoice', data, function (err, res) {  
                if(err){
                    console.log(err);
                }else{
                    snap.pay(res, {
                        onSuccess: function (result) {
                            Meteor.call('confirmPayment', res, result, function (err, res) {  
                                if(err){
                                    failAlert(err)
                                }
                                else{
                                    FlowRouter.go('thankyou')
                                    successAlert()
                                }
                            })
                            console.log("success", result);
                        },
                        onPending: function (result) {  
                            console.log("pending", result);
                        },
                        onError: function (result) {  
                            console.log("error", result);
                        },
                        onClose: function (result) {
                            // Meteor.call('deleteTransaction', res, function (err, res1) {  
                            //     if(err){
                            //         failAlert(err)
                            //     }
                            //     else{
                            //         failAlert('Transaction is canceled')
                            //     }
                            // })
                            console.log("close", result);
                        }
                        // a
                    })
                    // console.log(res);
                }
            })
        }
    },

})
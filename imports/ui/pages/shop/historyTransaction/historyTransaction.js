import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import {
    FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import './historyTransaction.html';
import { StatusTransaction } from '../../../../api/invoices/invoices';
let TomJerry = null
Template.historyTrans.onCreated(function () {
    const self = this;
    this.user = new ReactiveVar()
    this.historyTrans = new ReactiveVar()
    this.selectedInvoice = new ReactiveVar()
    Meteor.call('getMyself', async function (err,res) {  
        if(err){
            console.log(err);
        }else{
            self.user.set(res)
            console.log(res);
            Meteor.call('getUserInvoice', res._id, function (error, result) {
                if(error){
                    console.log(error);
                }else{
                    console.log(result);
                    self.historyTrans.set(result.map(function (x) {
                        x.firstItem = x.items[0]
                        x.productLainnya = +x.items.length - 1
                
                        console.log(x.status);
                        if(+x.status == 269)
                        {
                            x.statusTrans = 'Order Finished'
                            x.statusType = 1
                        }else if(+x.status == 400){
                            x.statusTrans = 'Order Canceled'
                            x.statusType = -1
                        }else{
                            if(+x.status == 1)x.statusTrans = 'Pending Payment'
                            if(+x.status == 200)x.statusTrans = 'Payment Success'
                            if(+x.status == 201)x.statusTrans = 'Order Confirmed'
                            if(+x.status == 202)x.statusTrans = 'Package Sent'
                            if(+x.status == 203)x.statusTrans = 'Package Received'
                            x.statusType = 0
                        }

                        return x
                    }))
                }
            })
        }
    })
    // Meteor.call('getOneJenis', paramId, paramId + "-0", function (err, res) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         self.jenisItem.set(res)
    //     }
    // })
})
Template.historyTrans.onRendered(function () {
    const self = this
    
})
Template.historyTrans.helpers({
    user(){
        const user = Template.instance().user.get()
        if(user){
            return user
        }
    },
    equals(a, b){
        return a == b
    },
    
    historyTrans(){
        const historyTrans = Template.instance().historyTrans.get()
        if(historyTrans)
        {
            console.log(historyTrans);
            return historyTrans
        }
    },
    multiply(a, b){
        return formatRp(parseInt(a) * parseInt(b))
    },

    // getItemPosition(elem, pos){
    //     return elem[pos]
    //     // const historyTrans = Template.instance().historyTrans.get().findOne({_id:_id})
    //     // // const history = historyTrans.
    //     // console.log(historyTrans.items[0]);
    // }
})

Template.historyTrans.events({
    'click .changeStatus'(e, t){
        const invoiceId = $(e.target).val();
        const historyTrans = t.historyTrans.get() 
        let selectedInvoice 
        for (const i of historyTrans) {
            if(i._id == invoiceId) selectedInvoice = i
        }
        const nextStatus = changeInvoiceStatus(selectedInvoice.status)
        Meteor.call('updateInvoiceStatus', invoiceId, nextStatus, function (err, res) {
            if(err){
                failAlert(err)
            }else{
                console.log(res );
            }
        })
        console.log(selectedInvoice);
        console.log(nextStatus);
    }
})


Template.historyTransDetail.onCreated(function () {
    const self = this;
    const paramId = FlowRouter.current().params._id
    this.invoice = new ReactiveVar();
    Meteor.call('getOneInvoice', paramId, function (err, res) { 
        res[0].firstItem = res[0].items[0]
        res[0].totalItem = +res[0].items.length
        if(+res[0].status == 269)
        {
            res[0].statusTrans = 'Order Finished'
            res[0].statusType = 1
        } else if(+res[0].status == 400){
            res[0].statusTrans = 'Order Canceled'
            res[0].statusType = -1
        } else{
            if(+res[0].status == 1)res[0].statusTrans = 'Pending Payment'
            if(+res[0].status == 200)res[0].statusTrans = 'Payment Success'
            if(+res[0].status == 201)res[0].statusTrans = 'Order Confirmed'
            if(+res[0].status == 202)res[0].statusTrans = 'Package Sent'
            if(+res[0].status == 203)res[0].statusTrans = 'Package Received'
            res[0].statusType = 0
        }
        res[0].log = res[0].log.map(function (y) {  
            return {
                timestamp: y.timestamp,
                detail: StatusTransaction.find((z) => z.id == y.id)
            }
        })
        self.invoice.set(res[0])
        console.log(res[0]);
    });
  })
  
Template.historyTransDetail.helpers({
    invoices() {
        return Template.instance().invoice.get();
    },
    equals(a, b){
        return a == b
    },
    formatHTML(context) {
        return moment(context).format("YYYY-MM-DD");
    },
    notEquals(a, b){
        return a != b
    },
    multiply(a, b){
        return formatRp(parseInt(a) * parseInt(b))
    },
})

Template.historyTransDetail.events({
     
})
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';
import moment from 'moment'; 
import { StatusTransaction } from '../../../../api/invoices/invoices';

Template.invoiceHome.onCreated(function () {
    const self = this;
    const dateFrom = moment().startOf('month').toDate()
    const dateTo = moment().endOf('month').toDate()
    self.filtering = new ReactiveVar({
      filter: '',
      sort: 1,
    })
    this.invoice = new ReactiveVar();
    Meteor.call('getAllInvoice', self.filtering.get(), function (err, res) {
        console.log(res);
        // self.invoice.set(res);
        self.invoice.set(res.map(function (x) {
            x.firstItem = x.items[0]
            x.totalItem = +x.items.length
    
            if(+x.status == 269)
            {
                x.statusTrans = 'Order Finished'
                x.statusType = 1
            }else if(+x.status == 400){
                x.statusTrans = 'Order Canceled'
                x.statusType = -1
            }
            else{
                if(+x.status == 1)x.statusTrans = 'Pending Payment'
                if(+x.status == 200)x.statusTrans = 'Payment Success'
                if(+x.status == 201)x.statusTrans = 'Order Confirmed'
                if(+x.status == 202)x.statusTrans = 'Package Sent'
                if(+x.status == 203)x.statusTrans = 'Package Received'
                x.statusType = 0
            }
            return x
        }))
    });
  })
  
Template.invoiceHome.helpers({
    invoices() {
        console.log(Template.instance().invoice.get());
        return Template.instance().invoice.get();
    },
    equals(a, b){
        return a == b
    },
    monthStart (){
        return moment().startOf('month').toDate()
    },
    monthEnd (){
        return moment().endOf('month').toDate()
    },
    formatHTML(context) {
        return moment(context).format("YYYY-MM-DD");
    },

})

Template.invoiceHome.events({
    'click .accept'(e,t){
        const invoiceId = $(e.target).val();
        const historyTrans = t.invoice.get() 
        let selectedInvoice 
        for (const i of historyTrans) {
            if(i._id == invoiceId) selectedInvoice = i
        }
        const nextStatus = changeInvoiceStatus(selectedInvoice.status)
        Meteor.call('updateInvoiceStatus', invoiceId, nextStatus, function (err, res) {
            if(err){
                failAlert(err)
            }else{
                console.log(res);
            }
        })
    },
    'click .reject'(e,t){
        const invoiceId = $(e.target).val();
        const historyTrans = t.invoice.get() 
        let selectedInvoice 
        for (const i of historyTrans) {
            if(i._id == invoiceId) selectedInvoice = i
        }
        const nextStatus = changeInvoiceStatus(selectedInvoice.status)
        Meteor.call('updateInvoiceStatus', invoiceId, 400, function (err, res) {
            if(err){
                failAlert(err)
            }else{
                console.log(res);
            }
        })
    },
    'change .filtering'(e, t){
        const sort = $('#sort').val();
        const filterStartDate = new Date($('#startDate').val());
        const filterEndDate = new Date($('#endDate').val());
        const status = $('#statusTrans').val();
        t.filtering.set({
            sort,
            dateFrom: isValidDate(filterStartDate) ? filterStartDate : false,
            dateTo: isValidDate(filterEndDate) ? filterEndDate : false,
            status,
        })
        Meteor.call('getAllInvoice', {
            sort,
            dateFrom: isValidDate(filterStartDate) ? filterStartDate : false,
            dateTo: isValidDate(filterEndDate) ? filterEndDate : false,
            status,
        }, function (err, res) {
            // t.invoice.set(res);
            t.invoice.set(res.map(function (x) {
                x.firstItem = x.items[0]
                x.totalItem = +x.items.length
        
                if(+x.status == 269)
                {
                    x.statusTrans = 'Order Finished'
                    x.statusType = 1
                }else if(+x.status == 400){
                    x.statusTrans = 'Order Canceled'
                    x.statusType = -1
                }
                else{
                    if(+x.status == 1)x.statusTrans = 'Pending Payment'
                    if(+x.status == 200)x.statusTrans = 'Payment Success'
                    if(+x.status == 201)x.statusTrans = 'Order Confirmed'
                    if(+x.status == 202)x.statusTrans = 'Package Sent'
                    if(+x.status == 203)x.statusTrans = 'Package Received'
                    x.statusType = 0
                }
                return x
            }))
        })
    },
})

Template.invoiceDetail.onCreated(function () {
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
  
Template.invoiceDetail.helpers({
    invoices() {
        console.log(Template.instance().invoice.get());
        return Template.instance().invoice.get();
    },
    equals(a, b){
        return a == b
    },
    formatHTML(context) {
        return moment(context).format("YYYY-MM-DD");
    },

})

Template.invoiceDetail.events({
     
})
  
  
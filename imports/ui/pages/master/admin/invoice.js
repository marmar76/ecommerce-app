import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';
import moment from 'moment'; 
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
})
  
  
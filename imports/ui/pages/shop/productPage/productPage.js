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
import './productPage.html';

Template.productPage.onCreated(function () {
    const self = this;
    this.item = new ReactiveVar();
    this.jenisItem = new ReactiveVar();
    this.cart = new ReactiveVar();
    this.subtotal = new ReactiveVar(0)
    const paramId = FlowRouter.current().params._id
    Meteor.call('getOneItem', paramId, function (err, res) {
        if (err) {
            console.log(err);
            // failalert(err)
        } else {
            self.item.set(res);
        }
    })
    Meteor.call('getOneJenis', paramId, paramId + "-0", function (err, res) {
        if (err) {
            console.log(err);
        } else {
            self.jenisItem.set(res)
        }
    })

})
Template.productPage.helpers({
    item() {
        const items = Template.instance().item.get();
        if (items) {
            return items;
        }
    },
    jenis() {
        const jenis = Template.instance().jenisItem.get();
        if (jenis) {
            return jenis;
        }
    },
    subtotal() {
        const qty = $('#quantity').val();
        const jenis = Template.instance().jenisItem.get();
        if (jenis) {
            let total = qty * jenis.price
            Template.instance().subtotal.set(total)
            return Template.instance().subtotal.get()
        }
    },
})

Template.productPage.events({
    'click #compare-specification'(e, t) {
        
    },
    'click .btnJenis'(e, t) {
        const itemId = $(e.target).val();
        const paramId = FlowRouter.current().params._id
        Meteor.call('getOneJenis', paramId, itemId, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                t.jenisItem.set(res)
            }
        })
        e.target.selected
    },
    'click #buy'(e, t) {
        const qty = $('#quantity').val();
        if (qty == null) console.log("hmmmm");
        console.log(Template.instance().cart.get());
    },
    'click #cart'(e, t) {

        const user = Meteor.user()
        const qty = $('#quantity').val();
        const itemId = $('#cart').val();
        const item = Template.instance().item.get()
        const jenisItem = Template.instance().jenisItem.get()
        let name = item.name + " - " + jenisItem.name
        if (user) {
            Meteor.call('getOneCart', user._id, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    if (res) {
                        const items = []
                        let status = true
                        for (const i of res.items) {
                            if (i.itemId == itemId) {
                                i.quantity += +qty
                                i.subtotal = +i.quantity * +i.price
                                status = false
                            }
                            items.push(i)
                        }
                        if (status) {
                            const dataitem = {
                                name,
                                itemId,
                                weight: +item.weight,
                                quantity: +qty,
                                price: +jenisItem.price,
                                subtotal: +qty * +jenisItem.price
                            }
                            items.push(dataitem)
                        }
                        console.log(items);
                        let grandtotal = 0
                        for (const i of items) {
                            console.log(i.subtotal);
                            grandtotal += +i.subtotal
                        }
                        const data = {
                            items,
                            grandtotal: +grandtotal
                        }
                        console.log(+grandtotal);
                        Meteor.call('updateCart', user._id, data, function (err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("success Update Cart");
                            }
                        })
                    } else {

                        const items = [{
                            name,
                            itemId,
                            weight: +item.weight,
                            quantity: +qty,
                            price: +jenisItem.price,
                            subtotal: +qty * +jenisItem.price
                        }]
                        const data = {
                            username: user.username,
                            userId: user._id,
                            items,
                            grandtotal: items[0].subtotal,
                            status: true
                        }
                        Meteor.call('createCart', data, function (err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("success");
                            }
                        })
                    }
                    t.cart.set(res)
                }
            })
        }

    },
    'change #quantity'(e, t) {
        const qty = $('#quantity').val();
        const jenis = Template.instance().jenisItem.get();
        let total = qty * jenis.price
        console.log(total);
        Template.instance().subtotal.set(total)
    }

})
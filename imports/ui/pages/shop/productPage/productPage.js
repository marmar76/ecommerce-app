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

let TomJerry = null
Template.productPage.onCreated(function () {
    const self = this;
    this.item = new ReactiveVar();
    this.jenisItem = new ReactiveVar();
    this.cart = new ReactiveVar();
    this.subtotal = new ReactiveVar(0)
    this.subcategory = new ReactiveVar(null)
    this.subcategoryItem = new ReactiveVar(null)
    this.quantity = new ReactiveVar(1)
    this.user = new ReactiveVar()
    this.recommendation = new ReactiveVar()
    this.comparison = new ReactiveVar([
        {
            id: 1,
            product: null
        },
        {
            id: 2,
            product: null
        },
        {
            id: 3,
            product: null
        },

    ])
    this.review = new ReactiveVar()
    const paramId = FlowRouter.current().params._id
    Meteor.call('getItemRecomendation', paramId, function(err, res){
        if(err){
            console.log(err)
        }
        else{
            self.recommendation.set(res)
        }
    })
    Meteor.call('getOneItem', paramId, function (err, res) {
        if (err) {
            console.log(err);
            // failalert(err)
        } else {
            console.log(res);
            self.item.set(res);
            self.jenisItem.set(res.models[0])
            Meteor.call('getItemReview', res._id, function (err, res) {  
                console.log(res);
                self.review.set(res)
            })
            Meteor.call('getOneSubCategory', res.subcategory, function (err, res) {  
                self.subcategory.set(res)
                setTimeout(() => {
                    // window.scrollTo({top: 0, behavior: "auto"})
                    $("html, body").animate({ scrollTop: 0 }, "fast");
                    
                }, 1000);
                setTimeout(() => {
                    let splide = new Splide( '.splide'
                    , {
                        type   : 'loop',
                        perPage: 5,
                        perMove: 1,
                      } );
                      
                    splide.mount();
                }, 2000);
            })
            Meteor.call('getItemOnSubCategory', res.subcategory, function (err, res) {  
                self.subcategoryItem.set(res)
                console.log(res);
                setTimeout(() => {
                    for (const i of self.comparison.get()) {
                        const thisSelect = new TomSelect('#compare-'+i.id,{
                            valueField: 'itemId',
                            labelField: 'name',
                            searchField: ['name'],
                            plugins: ['change_listener'],
                            // fetch remote data
                            options: res,
                            // custom rendering function for options
                            render: {
                                option: function(item, escape) {
                                    return `<div class="py-2 d-flex">
                                                <div class="mb-1">
                                                    <span class="h5">
                                                        ${ escape(item.name) }
                                                    </span>
                                                </div>
                                            </div>`;
                                }
                            },
                        });
                        if(!TomJerry){
                            TomJerry = thisSelect
                        }  
                        // TomJerry.push(thisSelect)
                    }
                    
                }, 500);
            })
        }
    })
    Meteor.call('getMyself', async function (err,res) {  
        if(err){
            console.log(err);
        }else{
            self.user.set(res)
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
Template.productPage.onRendered(function () {
    const self = this
    
})
Template.productPage.helpers({
    recommendation(){
        return Template.instance().recommendation.get()
    },
    review(){
        return Template.instance().review.get()
    },
    comparison(){
        return Template.instance().comparison.get()
    },
    item() {
        const items = Template.instance().item.get();
        if (items) {
            console.log(items);
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
        const qty = Template.instance().quantity.get()
        const jenis = Template.instance().jenisItem.get();
        if (jenis) {
            let total = qty * jenis.price
            Template.instance().subtotal.set(total)
            return Template.instance().subtotal.get()
        }
    },
    subcategory(){
        const subcategory = Template.instance().subcategory.get()
        if(subcategory){
            return subcategory.specification
        }
    },
    getSpec(item, slug){
        if(item){
            return item.find((x) => x.slug == slug).value
        }
    },
    user(){
        const user = Template.instance().user.get()
        if(user){
            return user
        }
    },
    equals(a, b){
        return a == b
    },
    isYellow(val, thisStar){
        // const star = Template.instance().star.get()
        return +thisStar >= val
    }
})

Template.productPage.events({
    'click .recommend'(e, t){
        const itemId = $(e.target).attr('value');
        FlowRouter.go('productPage', {_id: itemId})
        window.location.reload()
    },
    'click .btn-plus'(e, t){
        const quantity = $("#quantity").val();
        if(quantity){
            $("#quantity").val((+quantity) + 1);
        }else $("#quantity").val(1);
    },
    'click .btn-min'(e, t){
        const quantity = $("#quantity").val();
        if(quantity){
            let res = (+quantity) - 1
            if(res == 0){
                $("#quantity").val(1);
            }
            else $("#quantity").val(res);
        }else $("#quantity").val(1);

    },
    'input #quantity'(e, t){
        const quantity = $("#quantity").val();
        t.quantity.set(quantity)
    },
    'click .btn-quantity'(e, t){
        const quantity = $("#quantity").val();
        t.quantity.set(quantity)
    },
    'click #compare-specification'(e, t) {
        
    },
    'change .compare-item'(e, t){
        const thisDiv = $(e.target);
        const position = thisDiv.attr('compare')
        const comparison = t.comparison.get()
        // console.log(position);
        const value = thisDiv.val()
        // console.log(value);
        const thisProduct = t.subcategoryItem.get().find((x) => x.itemId == value)
        const thisComparison = comparison.find((x) => x.id == position)
        thisComparison.product = thisProduct
        t.comparison.set(comparison)
        console.log(comparison);
    },
    'click .btnJenis'(e, t) {
        const itemId = $(e.target).val();
        const item = t.item.get()
        t.jenisItem.set(item.models.find((x) => itemId == x.itemId))
        console.log(TomJerry);
        setTimeout(() => {
            // const TomSelect = t.TomSelect.get()
            console.log(itemId);
            TomJerry.setValue(itemId)
            // setTimeout(() => {
            //   console.log($('#user-kecamatan').val());
            //   t.updateAlamat.set(click)
      
      
            // }, 2000);
          }, 200);

        // const paramId = FlowRouter.current().params._id
        // Meteor.call('getOneJenis', paramId, itemId, function (err, res) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         t.jenisItem.set(res)
        //     }
        // })
        // e.target.selected
    },
    'click #buy'(e, t) {
        const qty = $('#quantity').val();
        if (qty == null) console.log("hmmmm");
        console.log(Template.instance().cart.get());
    },
    'click #cart'(e, t) {
        const user = Meteor.user()
        const qty = +$('#quantity').val();
        const itemId = $('#cart').val();
        const item = Template.instance().item.get()
        const jenisItem = Template.instance().jenisItem.get()
        console.log(itemId, qty);
        if(qty <= 0){
            failAlert('jumlah tidak boleh dibawah sama dengan 0')
        }else{
            if(qty > jenisItem.stock){
                failAlert('jumlah tidak boleh melebihi stock')
            }else {
                Meteor.call('insertCart', {itemId, qty}, function (err, res) {  
                    if(err){
                        console.log(err);
                    }
                    else{
                        successAlert('Barang berhasil ditambahkan')
                    }
                })
            }
        }
        // let name = item.name + " - " + jenisItem.name
        
        // if (user) { <- dis is sucks so much
        //     Meteor.call('getOneCart', user._id, function (err, res) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             if (res) {
        //                 const items = []
        //                 let status = true
        //                 for (const i of res.items) {
        //                     if (i.itemId == itemId) {
        //                         i.quantity += +qty
        //                         i.subtotal = +i.quantity * +i.price
        //                         status = false
        //                     }
        //                     items.push(i)
        //                 }
        //                 if (status) {
        //                     const dataitem = {
        //                         name,
        //                         itemId,
        //                         weight: +item.weight,
        //                         quantity: +qty,
        //                         price: +jenisItem.price,
        //                         subtotal: +qty * +jenisItem.price
        //                     }
        //                     items.push(dataitem)
        //                 }
        //                 console.log(items);
        //                 let grandtotal = 0
        //                 for (const i of items) {
        //                     console.log(i.subtotal);
        //                     grandtotal += +i.subtotal
        //                 }
        //                 const data = {
        //                     items,
        //                     grandtotal: +grandtotal
        //                 }
        //                 console.log(+grandtotal);
        //                 Meteor.call('updateCart', user._id, data, function (err, res) {
        //                     if (err) {
        //                         console.log(err);
        //                     } else {
        //                         console.log("success Update Cart");
        //                     }
        //                 })
        //             } else {
        //                 const items = [{
        //                     name,
        //                     itemId,
        //                     weight: +item.weight,
        //                     quantity: +qty,
        //                     price: +jenisItem.price,
        //                     subtotal: +qty * +jenisItem.price
        //                 }]
        //                 const data = {
        //                     username: user.username,
        //                     userId: user._id,
        //                     items,
        //                     grandtotal: items[0].subtotal,
        //                     status: true
        //                 }
        //                 Meteor.call('createCart', data, function (err, res) {
        //                     if (err) {
        //                         console.log(err);
        //                     } else {
        //                         console.log("success");
        //                     }
        //                 })
        //             }
        //             t.cart.set(res)
        //         }
        //     })
        // }

    },
    'change #quantity'(e, t) {
        const qty = $('#quantity').val();
        const jenis = Template.instance().jenisItem.get();
        let total = qty * jenis.price
        console.log(total);
        Template.instance().subtotal.set(total)
    }

})
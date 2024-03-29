import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import moment from 'moment';
import './productList.html'; 

Template.productList.onCreated(function () {
    const self = this;
    const thisQuery = FlowRouter.getQueryParam('q')
    let thisData = FlowRouter.getQueryParam('data')
    if(thisData){
        thisData = JSON.parse(thisData)
    }else{
        thisData = {filter: thisQuery ? thisQuery : "", sort: thisData ? (thisData.sort ? thisData.sort : 1) : 1}
    }
    // console.log(thisQuery);
    self.filtering = new ReactiveVar(thisData)
    this.item = new ReactiveVar();
    this.category = new ReactiveVar();
    this.subcategory = new ReactiveVar();
    this.index = new ReactiveVar(1);
    this.now = new ReactiveVar(-1);
    Meteor.call('getAllCategory', self.filtering.get() ,function (err, res) {
        self.category.set(res.filter(function (x) {
        return x.subcategory.length != 0
        }));
    });
    Meteor.call('getAllSubCategory', self.filtering.get(), function (err, res) {
        self.subcategory.set(res);
    });
    Meteor.call('getAllItem', self.filtering.get(), function (err, res) {
        self.item.set(res);
        console.log(res);
        // self.item.set(res.map(async function (x) {
        //     let stars = 0   
        //     await Meteor.call('getItemReview', x._id, function (err, res1) {   
        //         let ctr = 0
        //         res1.map(function (y) {
        //             stars += +y.star
        //             ctr++;
        //         })
        //         console.log(stars);
        //     }) 
        //     x.stars = stars/+ctr
        //     return x 
            
        // }));
        // console.log(res);
    })
    
})
  
Template.productList.helpers({
    items() {
        const items = Template.instance().item.get();
        if (items) {
          return items;
        }
    },
    // lowerPrice(id){
    //     const items = Template.instance().item.get();
    //     if (items) {
    //         let models 
    //         let price = +999999999
    //         for (const i of items) {
    //             if(i._id == id){
    //                 models = i.models
    //             }
    //         }
    //         if(models){
    //             for (const i of models) {
    //                 if(+price > +i.price) {
    //                     price = i.price
    //                 }
    //             }
    //         }
    //         return price;
    //     }
    // },
    categories(){
        console.log(Template.instance().category.get());
        return Template.instance().category.get()
    },
    subcategory(id){
        const subcategory = Template.instance().subcategory.get()
        if(subcategory){
            console.log(subcategory.filter(function (x) {
                return x.categoryId == id
            }));
            return subcategory.filter(function (x) {
                return x.categoryId == id
            })   
        }
    },
    equals(a, b){
        return a == b
    },
    minus(a){ 
        return a-1
    }
})

Template.productList.events({
    'click .btn-search'(e, t){
        const filter = $('#search').val()
        // console.log(filter);
        const sort = $('#sort').val()
        const hargaAwal = +$('#hargaAwal').val();
        const hargaAkhir = +$('#hargaAkhir').val();
        const active = true
        const filtering = t.filtering.get()
        filtering.filter = filter 
        filtering.sort = sort 
        filtering.hargaAwal = hargaAwal 
        filtering.hargaAkhir = hargaAkhir 
        t.filtering.set(filtering)
        FlowRouter.go('/search?q='+filter+'&data='+JSON.stringify(filtering))
        // console.log(sort);
        Meteor.call('getAllItem', filtering, function (err, res) {
        if(err){
            failAlert(err)
        }else{
            console.log(res);
            t.item.set(res)
        } 
        })
    },
    'click .btnCategory'(e, t){
        const thisCategory = $(e.target) 
        const category = thisCategory.val()
        const filter = $('#search').val()
        console.log(filter);
        console.log(e.target);
        console.log(category);
        const sort = $('#sort').val()
        const hargaAwal = +$('#hargaAwal').val();
        const hargaAkhir = +$('#hargaAkhir').val();
        const active = true 
        const filtering = t.filtering.get()
        filtering.filter = filter 
        filtering.sort = sort 
        filtering.category = category
        filtering.hargaAwal = hargaAwal 
        filtering.hargaAkhir = hargaAkhir
        delete filtering.subcategory
        t.filtering.set(filtering)
        FlowRouter.go('/search?q='+filter+'&data='+JSON.stringify(filtering))
        // console.log(sort);
        Meteor.call('getAllItem', filtering, function (err, res) {
        if(err){
            failAlert(err)
        }else{
            t.item.set(res)
        } 
        }) 
    },
    'click .btnSubCategory'(e,t){
        const thisSubCategory = $(e.target) 
        const subcategory = thisSubCategory.val()
        const filter = $('#search').val()
        console.log(filter);
        console.log(e.target);
        console.log(subcategory);
        const sort = $('#sort').val()
        const hargaAwal = +$('#hargaAwal').val();
        const hargaAkhir = +$('#hargaAkhir').val();
        const active = true 
        const filtering = t.filtering.get()
        filtering.filter = filter 
        filtering.sort = sort 
        filtering.subcategory = subcategory
        filtering.hargaAwal = hargaAwal 
        filtering.hargaAkhir = hargaAkhir
        delete filtering.category 
        t.filtering.set(filtering)
        FlowRouter.go('/search?q='+filter+'&data='+JSON.stringify(filtering))
        console.log(sort);
        Meteor.call('getAllItem', filtering, function (err, res) {
        if(err){
            failAlert(err)
        }else{
            t.item.set(res)
        } 
        }) 
    },
    'change .filtering'(e, t){
        const filter = $('#search').val()
        const sort = $('#sort').val()
        const hargaAwal = +$('#hargaAwal').val();
        const hargaAkhir = +$('#hargaAkhir').val();
        const active = true 
        const filtering = t.filtering.get()
        filtering.filter = filter 
        filtering.sort = sort 
        filtering.hargaAwal = hargaAwal 
        filtering.hargaAkhir = hargaAkhir 
        t.filtering.set(filtering)
        FlowRouter.go('/search?q='+filter+'&data='+JSON.stringify(filtering))
        console.log(sort);
        Meteor.call('getAllItem', filtering, function (err, res) {
        if(err){
            failAlert(err)
        }else{
            console.log(res);
            t.item.set(res)
        } 
        })
    },
    'click .btn-filter'(e, t){
        const filter = $('#search').val()
        const sort = $('#sort').val()
        const hargaAwal = +$('#hargaAwal').val();
        const hargaAkhir = +$('#hargaAkhir').val();
        const active = true 
        const filtering = t.filtering.get()
        filtering.filter = filter 
        filtering.sort = sort 
        filtering.hargaAwal = hargaAwal 
        filtering.hargaAkhir = hargaAkhir 
        t.filtering.set(filtering)
        FlowRouter.go('/search?q='+filter+'&data='+JSON.stringify(filtering))
        console.log(sort);
        Meteor.call('getAllItem', filtering, function (err, res) {
        if(err){
            failAlert(err)
        }else{
            console.log(res);
            t.item.set(res)
        } 
        })
    }
})
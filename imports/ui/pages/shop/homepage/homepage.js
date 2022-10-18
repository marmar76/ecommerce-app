import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment';
import './homepage.html'; 


Template.homepage.onCreated(function () {
    const self = this;
    self.filtering = new ReactiveVar({
        filter: '',
        sort: 1,
    })
    this.item = new ReactiveVar();
    this.category = new ReactiveVar();
    this.subcategory = new ReactiveVar();
    this.now = new ReactiveVar(-1);
    Meteor.call('getAllCategory', function (err, res) {
        self.category.set(res.filter(function (x) {
        return x.subcategory.length != 0
        }));
    });
    Meteor.call('getAllSubCategory', function (err, res) {
        self.subcategory.set(res);
    });
    Meteor.call('getAllItem', self.filtering.get(), function (err, res) {
        self.item.set(res);
    })
    
})
  
Template.homepage.helpers({
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
        return Template.instance().category.get()
    },
    subcategory(id){
        const subcategory = Template.instance().subcategory.get()
        if(subcategory){
            return subcategory.filter(function (x) {
                return x.categoryId == id
            })   
        }
    }
})

Template.homepage.events({
    'click .btn-search'(e, t){
        const filter = $('#search').val()
        const sort = $('#sort').val()
        const hargaAwal = +$('#hargaAwal').val();
        const hargaAkhir = +$('#hargaAkhir').val();
        const active = true 
        t.filtering.set({
        filter,
        sort,
          hargaAwal,
          hargaAkhir,
        })
        console.log(sort);
        Meteor.call('getAllItem', {
            filter, 
            sort, 
          hargaAwal,
          hargaAkhir, 
        }, function (err, res) {
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
        t.filtering.set({
            filter,
            sort,
            category,
            hargaAwal,
            hargaAkhir,
        })
        console.log(sort);
        Meteor.call('getAllItem', {
            filter, 
            sort, 
            category,
            hargaAwal,
            hargaAkhir, 
        }, function (err, res) {
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
        t.filtering.set({
            filter,
            sort,
            subcategory,
            hargaAwal,
            hargaAkhir,
        })
        console.log(sort);
        Meteor.call('getAllItem', {
            filter, 
            sort, 
            subcategory,
            hargaAwal,
            hargaAkhir, 
        }, function (err, res) {
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
        t.filtering.set({
        filter,
        sort,
          hargaAwal,
          hargaAkhir,
        })
        console.log(sort);
        Meteor.call('getAllItem', {
            filter, 
            sort, 
          hargaAwal,
          hargaAkhir, 
        }, function (err, res) {
        if(err){
            failAlert(err)
        }else{
            console.log(res);
            t.item.set(res)
        } 
        })
    }
})
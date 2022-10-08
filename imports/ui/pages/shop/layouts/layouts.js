import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment';
import Swal from 'sweetalert2';
import './layouts.html'; 
Template.layouts.onCreated(function () {  
//   const self=this;
//   self.filtering = new ReactiveVar({
//       filter: '',
//       sort: 1,
//   })
//   this.item = new ReactiveVar();
//   this.category = new ReactiveVar();
//   self.subcategory = new ReactiveVar([]);
//   this.now = new ReactiveVar(-1);
//   Meteor.call('getAllCategory', function (err,res) {
//     self.category.set(res.filter(function (x) {  
//       return x.subcategory.length != 0
//     })); 
//   }); 
//   Meteor.call('getAllItem', self.filtering.get(), function (err,res) { 
//     self.item.set(res);  
//   })
})
Template.layouts.helpers({
    isLogin(){
        return Meteor.userId()
    },
    thisUser(){
        console.log(Meteor.user());
        return Meteor.user()
    },
  categories(){
    const category = Template.instance().category.get();
    if(category){ 
      for (let i = 0; i < category.length; i++) {  
          if(category[i].subcategory.length < 1)
          {
            category.splice(i,1);
          } 
      }
      // console.log(category);
      return category;
    }
  },
  now(){
    return Template.instance().now.get();
  },
  subcategory(){  
    return Template.instance().subcategory.get();
  },
  items(){
    const items = Template.instance().item.get();
    if(items){
      console.log(items);
      return items;
    }
  },
  formatHTML(context) {
    return moment(context).format("YYYY-MM-DD");
  },
}) 

Template.layouts.events({
    'click #btn-logout'(e, t){
        Swal.fire({
            title: 'Do you want to logout now?',
            icon: 'warning',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              // Swal.fire('Saved!', '', 'success')
              Meteor.logout();
            //   setTimeout(() => {
            //     FlowRouter.go('/login')
            //   }, 200);
            } else if (result.isDenied) {
              // Swal.fire('Changes are not saved', '', 'info')
            }
          })
    },
  'click .category_filter'(e,t){
    const id = $(e.target).val(); 
    for (const key of t.category.curValue) { 
      if(key._id == id){  
        t.subcategory.set(key.subcategory);
      }
    }  
  },
  'click #btn-search'(e,t){
    // console.log($('#search').val());
    const filter = $('#search').val()
    const sort = $('#sort').val()
    const hargaAwal = +$('#hargaAwal').val();
    const hargaAkhir = +$('#hargaAkhir').val();
    const dateFrom = $('#dateFrom').val();
    const active = true 
    t.filtering.set({
      filter,
      sort,
      hargaAwal,
      hargaAkhir,
      dateFrom,
      active
    })
    Meteor.call('getAllItem', {filter,
      sort, 
      hargaAwal,
      hargaAkhir,
      dateFrom,
      active}, function (err, res) {
      if(err){
        // failAlert(err)
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
    const dateFrom = $('#dateFrom').val();
    const active = true 
    t.filtering.set({
      filter,
      sort,
      hargaAwal,
      hargaAkhir,
      dateFrom,
      active
    })
    Meteor.call('getAllItem', {
      filter, 
      sort, 
      hargaAwal,
      hargaAkhir,
      dateFrom, 
      active}, function (err, res) {
      if(err){
        // failAlert(err)
      }else{
        t.item.set(res)
      } 
    })
  }
});

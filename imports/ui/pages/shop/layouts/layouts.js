import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ImagePlaceholder } from '../../../../api/users/users';
import './layouts.html'; 
let INDEX = 0
Template.layouts.onCreated(function () {  
  const self=this;
  self.thisUser = new ReactiveVar()
  this.fotoProfile = new ReactiveVar(ImagePlaceholder)
  this.thisUser = new ReactiveVar()
  
  Meteor.call('getMyself', async function (err, res) {  
    if(err){
      console.log(err);
    }
    else if(res){
      self.thisUser.set(res)
      // self.fotoProfile.set(res.profilePicture ? res.profilePicture : ImagePlaceholder)
      if(res.profilePicture){
          self.fotoProfile.set(res.profilePicture)
      }
      else{
          // self.fotoProfile
      }
    }
  })
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
      return Template.instance().thisUser.get()
    },
    fotoProfile(){
      return Template.instance().fotoProfile.get()
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
  chats(){
    const user = Meteor.users.findOne()
    if(user){
      console.log(user.chats);
      setTimeout(() => {
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
      }, 200);
      return user.chats
    }
    // return user
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
  equals(a, b){
    return a == b
  }
}) 
function generate_message(msg, type) {
  INDEX++;
  var str="";
  str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
  str += "          <span class=\"msg-avatar\">";
  str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
  str += "          <\/span>";
  str += "          <div class=\"cm-msg-text\">";
  str += msg;
  str += "          <\/div>";
  str += "        <\/div>";
  $(".chat-logs").append(str);
  $("#cm-msg-"+INDEX).hide().fadeIn(300);
  if(type == 'self'){
   $("#chat-input").val(''); 
  }    
  $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
}

function generate_button_message(msg, buttons){    
  /* Buttons should be object array 
    [
      {
        name: 'Existing User',
        value: 'existing'
      },
      {
        name: 'New User',
        value: 'new'
      }
    ]
  */
  INDEX++;
  var btn_obj = buttons.map(function(button) {
     return  "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\""+button.value+"\">"+button.name+"<\/a><\/li>";
  }).join('');
  var str="";
  str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg user\">";
  str += "          <span class=\"msg-avatar\">";
  str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
  str += "          <\/span>";
  str += "          <div class=\"cm-msg-text\">";
  str += msg;
  str += "          <\/div>";
  str += "          <div class=\"cm-msg-button\">";
  str += "            <ul>";   
  str += btn_obj;
  str += "            <\/ul>";
  str += "          <\/div>";
  str += "        <\/div>";
  $(".chat-logs").append(str);
  $("#cm-msg-"+INDEX).hide().fadeIn(300);   
  $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
  $("#chat-input").attr("disabled", true);
}
Template.layouts.events({
  'click .chat-box-toggle'(e, t){
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  },
  'click #chat-circle'(e, t){
    Meteor.call('validateUserChat', function (err, res) {  
      Meteor.subscribe('user.chat', function () {  
        console.log("subscribe");
      })
    })
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  },
  'click .chat-btn'(e, t){
    var value = $(this).attr("chat-value");
    var name = $(this).html();
    $("#chat-input").attr("disabled", false);
    generate_message(name, 'self');
  },
  'submit #chat-submit'(e, t){
    e.preventDefault()
    const msg = $("#chat-input").val(); 
    if(msg.trim() == ''){
      return false;
    }
    Meteor.call('sendUserMessage', msg, function (err, res) {  
      if(err){
        failAlert(err)
      }
    })
    $('#chat-input').val('');
    // generate_message(msg, 'self');
    // let buttons = [
    //     {
    //       name: 'Existing User',
    //       value: 'existing'
    //     },
    //     {
    //       name: 'New User',
    //       value: 'new'
    //     }
    //   ];
    // setTimeout(function() {      
    //   generate_message(msg, 'user');  
    // }, 1000)
  },
  'click .trigger-button'(e, t){
    Meteor.call('getMyself', async function (err, res) {  
      t.thisUser.set(res)
      // self.fotoProfile.set(res.profilePicture ? res.profilePicture : ImagePlaceholder)
      if(res.profilePicture){
        t.fotoProfile.set(res.profilePicture)
      }
      else{
          // self.fotoProfile
      }
  })
  },
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
    // const id = $(e.target).val(); 
    // for (const key of t.category.get().curValue) { 
    //   if(key._id == id){  
    //     t.subcategory.set(key.subcategory);
    //   }
    // }  
  },
  'submit .search-form'(e,t){
    e.preventDefault();
    // FlowRouter.go('search', {halo: 'there'})
    $(".btn-search").trigger("click");
    // console.log($('#search').val());
    // const filter = $('#search').val()
    // const sort = $('#sort').val()
    // const hargaAwal = +$('#hargaAwal').val();
    // const hargaAkhir = +$('#hargaAkhir').val();
    // const dateFrom = $('#dateFrom').val();
    // const active = true 
    // t.filtering.set({
    //   filter,
    //   sort,
    //   hargaAwal,
    //   hargaAkhir,
    //   dateFrom,
    //   active
    // })
    // Meteor.call('getAllItem', {filter,
    //   sort, 
    //   hargaAwal,
    //   hargaAkhir,
    //   dateFrom,
    //   active}, function (err, res) {
    //   if(err){
    //     // failAlert(err)
    //   }else{
    //     t.item.set(res)
    //   } 
    // })
  },
  'change .filtering'(e, t){
    // const filter = $('#search').val()
    // const sort = $('#sort').val()
    // const hargaAwal = +$('#hargaAwal').val();
    // const hargaAkhir = +$('#hargaAkhir').val();
    // const dateFrom = $('#dateFrom').val();
    // const active = true 
    // t.filtering.set({
    //   filter,
    //   sort,
    //   hargaAwal,
    //   hargaAkhir,
    //   dateFrom,
    //   active
    // })
    // Meteor.call('getAllItem', {
    //   filter, 
    //   sort, 
    //   hargaAwal,
    //   hargaAkhir,
    //   dateFrom, 
    //   active}, function (err, res) {
    //   if(err){
    //     // failAlert(err)
    //   }else{
    //     t.item.set(res)
    //   } 
    // })
  }
});

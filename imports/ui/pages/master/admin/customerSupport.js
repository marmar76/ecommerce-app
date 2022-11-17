
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';
import { ImagePlaceholder } from '../../../../api/users/users';
Template.customerSupport.onCreated(function () {
    const self = this;
    self.chats = new ReactiveVar([])
    self.filtering = new ReactiveVar({
      filter: '',
      // sort: 1,
    })
    Meteor.subscribe('users.all', function () {
      console.log("Subscribe Users");
    })
    
    this.now = new ReactiveVar();
  });
  
  Template.customerSupport.onRendered(function () {

  });
  
  Template.customerSupport.helpers({
    async userPicture(elem){
      if(elem){
        return await getFireImage('user/picture', elem)
      }
      else{
        return ImagePlaceholder
      }
    },
    users(){
      const users = Meteor.users.find({chats: {$exists: true}}, {fields: {chats: 1, readStatus: 1, username: 1, name: 1, profilePicture: 1}}).fetch()
      console.log(users);
      // let now = Template.instance().now.get()
      if(users){
        Template.instance().chats.set(users)
        // if(now){
        //   now = users.find((x) => x._id == now._id)
        //   Template.instance().now.set(now)
        // }
        
        return users
      }
      return []
    },
    now() {
      const now = Template.instance().now.get();
      // console.log(now);
      return now
    },
    getChat(){
      const now = Template.instance().now.get()
      const chat = Template.instance().chats.get()
      if(chat && now){
        const thisChat = chat.find((x) => x._id == now._id)
        // console.log(chat.find((x) => x._id == now._id));
        setTimeout(() => {
          console.log(thisChat.chats.length-1);
          if($(".chat-logs")){
            // $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
            $('.chat-logs').animate({
              scrollTop: $('.li-pos-'+(thisChat.chats.length-1)).position().top + 3000
            }, 'slow');
          }
        }, 200);
        return thisChat

      }
    }
    
  })
  Template.customerSupport.events({
    'submit #send-chat'(e, t){
      e.preventDefault()
      const now = t.now.get()
      const msg = $("#message").val();
      if(msg.length != 0){
        Meteor.call('sendAdminMessage', now._id, msg, function (err, res) {  
          if(err)failAlert(err)
          else{
            $("#message").val('');
          }
        })
      }
      // console.log(msg);
    },
    'click .select-chat'(e, t){
      const thisUser = $(e.target).val()
      const chats = t.chats.get()
      t.now.set(chats.find((x) => x._id == thisUser))
      // console.log(thisUser);
    },
    'change .filtering'(e, t) {
      const filter = $('#filter').val();
      const category = Template.instance().category.get();
      // const sort = $('#sort').val();
      const categoryIndex = $('#filtercategory').val();
      console.log(categoryIndex);
      const filtersubcategory = $('#filtersubcategory').val();
      let filtercategory;
      for (let i = 0; i < category.length; i++) {
        if (i == categoryIndex) {
          filtercategory = category[i]._id;
        }
      }
      console.log(filtercategory);
      console.log(filtersubcategory);
      t.filtering.set({
        filter,
        filtercategory,
        filtersubcategory
      })
      Meteor.call('getAllItem', {
        filter,
        filtercategory,
        filtersubcategory
      }, function (err, res) {
        t.item.set(res);
      })
    },
    'input .filtering'(e, t) {
      const filter = $('#filter').val();
      // const sort = $('#sort').val();
      const filtercategory = $('#filtercategory').val();
      const filtersubcategory = $('#filtersubcategory').val();
      t.filtering.set({
        filter,
        filtercategory,
        filtersubcategory
      })
      Meteor.call('getAllItem', {
        filter,
        filtercategory,
        filtersubcategory
      }, function (err, res) {
        t.item.set(res);
      })
    },
  });
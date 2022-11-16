
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';
import { ImagePlaceholder } from '../../../../api/users/users';
Template.customerSupport.onCreated(function () {
    const self = this;
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
      if(users){
        return users
      }
      return []
    },
    now() {
      return Template.instance().now.get();
    },
    
  })
  Template.customerSupport.events({
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
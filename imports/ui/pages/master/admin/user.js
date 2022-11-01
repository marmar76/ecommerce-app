import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Swal from 'sweetalert2';
import moment from 'moment';
Template.usersHome.onCreated(function () {
    document.title = "Mastah User"
    Meteor.subscribe('users.all', function () {
      console.log("Subscribe Users");
    })
    this.filtering = new ReactiveVar({
      search: '',
      sort: '1',
      status: true
    })
  })
  
  Template.usersHome.onRendered(function () {
    // initNav("master-users-nav");
    // initPage()
  
  })
  Template.usersHome.helpers({
    users() {
      const filtering = Template.instance().filtering.get()
      const $or = [{
          name: {
            $regex: filtering.search.toLowerCase(),
            $options: 'i'
          }
        },
        {
          username: {
            $regex: filtering.search.toLowerCase(),
            $options: 'i'
          }
        },
        // {
        //   email: {$regex: filtering.search.toLowerCase(), $options: 'i'}
        // }
      ]
      const sort = function () {
        const thisSort = filtering.sort
        if (thisSort == 1) {
          return {
            name: 1
          }
        } else if (thisSort == 2) {
          return {
            name: -1
          }
        } else if (thisSort == 3) {
          return {
            createdAt: 1
          }
        } else if (thisSort == 4) {
          return {
            createdAt: -1
          }
        }
      }
      // console.log(sort);
      const users = Meteor.users.find({
        status: filtering.status,
        $or
      }, {
        sort: sort()
      }).fetch()
      console.log(users);
      return users.map(function (x) {
        if (x.emails && x.emails.length != 0) {
          x.emails = x.emails[0].address
        }
        return x
      })
    }
  
  })
  Template.usersHome.events({
    'change .filtering'(e, t) {
      const search = $('#search').val();
      const sort = $('#sort').val();
      const status = $('#is-active').is(':checked');
      // console.log({
      //   search,
      //   sort,
      //   status
      // });
      t.filtering.set({
        search,
        sort,
        status
      })
    },
    'input .filtering'(e, t) {
      const search = $('#search').val();
      const sort = $('#sort').val();
      const status = $('#is-active').is(':checked');
      // console.log({
      //   search,
      //   sort,
      //   status
      // });
      t.filtering.set({
        search,
        sort,
        status
      })
    },
  
  })
  
  
  Template.userCreatePage.onCreated(function () {
  
  })
  
  
  Template.userCreatePage.events({
    'click #submit'(e, t) {
      const user_username = $(username).val();
      const user_email = $(email).val();
      const user_password = $(password).val();
      const user_name = $(nameuser).val();
      console.log(user_name);
      const user_gender = $('input[name="gender"]:checked').val();
      const user_dob = new Date($(dob).val());
      const user_phone = $(phone).val();
      
      // console.log(user_gender);
      if (!user_username || !user_email || !user_password || !user_name || !user_gender || !isValidDate(user_dob) || !user_phone) {
        failAlert("Please fill the blank")
      } else {
        const profile = {
          name: user_name,
          gender: user_gender,
          dob: user_dob,
          phone: user_phone
        };
        const data = {
          username: user_username,
          email: user_email,
          password: user_password
        };
        // console.log(profile);
        // console.log(data);
        Meteor.call('registerAdmin', data, profile, function (err, res) {
          if (err) {
            failAlert(err);
          } else {
            successAlertGo('Success add new admin', '/master-users');
          }
        });
      }
    }
  });
  
  Template.userDetailPage.onCreated(function () {
    const self = this;
    this.user = new ReactiveVar();
    const paramId = FlowRouter.current().params._id
    Meteor.call('getOneUser', paramId, function (err, res) {
      self.user.set(res);
    })
  })
  
  Template.userDetailPage.helpers({
    user() {
      const user = Template.instance().user.get();
      if (user) {
        return user;
      }
    },
    equals(a, b) {
      return a == b;
    }
  })
  
  Template.userDetailPage.events({
    'click #banned'(e, t) {
      const param = FlowRouter.current().params._id;
      Meteor.call('bannedUser', param, function (err, res) {
        if (err) {
          failAlert(err);
        } else {
          successAlertGo('Success banned user', '/master-users')
        }
      });
    },
    'click #unbanned'(e, t) {
      const param = FlowRouter.current().params._id;
      Meteor.call('unbannedUser', param, function (err, res) {
        if (err) {
          failAlert(err);
        } else {
          successAlertGo('Success unbanned user', '/master-users')
        }
      });
    },
    'click #delete'(e, t) {
      const param = FlowRouter.current().params._id;
      Meteor.call('deleteUser', param, function (err, res) {
        if (err) {
          failAlert(err);
        } else {
          successAlertGo('Success delete user', '/master-users')
        }
      });
    }
  })
  
  Template.userEditPage.onCreated(function () {
    const self = this;
    this.user = new ReactiveVar();
    const paramId = FlowRouter.current().params._id
    Meteor.call('getOneUser', paramId, function (err, res) {
      res.emails = res.emails.map( (x) => x.address)
      self.user.set(res);
    })
  })
  
  Template.userEditPage.helpers({
    user() {
      const user = Template.instance().user.get();
      if (user) {
        return user;
      }
    },
    formatHTML(context) {
      return moment(context).format("YYYY-MM-DD");
    },
    equals(a, b) {
      return a == b;
    },
    false(){
      return false
    },
    male(){
      return 'male'
    },
    female(){
      return 'female'
    }

  })
  
  Template.userEditPage.events({
    'click #submit'(e, t) {
      const user_username = $(username).val();
      const user_email = $(email).val();
      const user_name = $(nameuser).val();
      const paramId = FlowRouter.current().params._id
      const user_gender = $('input[name="gender"]:checked').val();
      const user_dob = new Date($(dob).val());
      const user_phone = $(phone).val();
      
      // console.log(user_gender);
      if (!user_username || !user_email || !user_name || !user_gender || !isValidDate(user_dob) || !user_phone) {
        failAlert("Please fill the blank")
      } else {
        const profile = {
          name: user_name,
          gender: user_gender,
          dob: user_dob,
          phone: user_phone,
        };
        // console.log(profile);
        // console.log(data);
        Meteor.call('updateUser', paramId, profile, function (err, res) {
          if (err) {
            failAlert(err);
          } else {
            successAlertBack()
          }
        });
      }
    },
    'click #change-password'(e, t){
      const paramId = FlowRouter.current().params._id
      const user_password = $("#password").val();
      if(user_password.length == 0){
        failAlert("password cannnot be null")
      }
      else{
        Meteor.call('setPasswordAsAdmin', paramId, user_password, function (err, res) {  
          if(err){
            failAlert(err)
          }
          else{
            successAlert()
          }
        })
      }

    }
  })
  
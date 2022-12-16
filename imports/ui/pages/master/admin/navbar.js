import moment from 'moment'

import {
    FlowRouter
  } from 'meteor/ostrio:flow-router-extra';
import { navbar } from '../master';
import Swal from 'sweetalert2';

Template.navbarTop.onCreated(function () {
    const self = this;
    this.mySelf = new ReactiveVar()
    Meteor.call('getMyself', function(err, res){
      console.log(res);
      res.email = res.emails[0].address
      self.mySelf.set(res)
    })
    function greetings() {
      var currentHour = +moment().format("HH");
      // console.log(currentHour);
      // https://stackoverflow.com/questions/62079752/using-moment-js-to-determine-if-current-time-in-hour-is-between-certain-hours
      if (currentHour >= 3 && currentHour < 12) {
        return "Good Morning";
      } else if (currentHour >= 12 && currentHour < 15) {
        return "Good Afternoon";
      } else if (currentHour >= 15 && currentHour < 20) {
        return "Good Evening";
      } else if (currentHour >= 20 || currentHour < 3) {
        return "Good Night";
      } else {
        return "Hello"
      }
  
    }
    self.greetings = new ReactiveVar(greetings())
    self.timeNow = new ReactiveVar(moment().locale('en').format('MMMM Do YYYY, h:mm:ss A'))
    setInterval(() => {
      self.greetings.set(greetings())
    }, 3600000);
    setInterval(() => {
      if (screen.width < 990) {
        self.timeNow.set(moment().format("MMM Do YYYY"))
      } else {
        self.timeNow.set(moment().locale('en').format('MMMM Do YYYY, h:mm:ss A'))
      }
    }, 500);
  })
  Template.navbarTop.helpers({
    mySelf(){
      return Template.instance().mySelf.get()
    },
    greetings() {
      return Template.instance().greetings.get()
    },
    thisUser() {
      const thisUser = Meteor.user()
      // console.log(thisUser);
      return thisUser
    },
    timeNow() {
      return Template.instance().timeNow.get()
    }
  });
  
  Template.navbarTop.events({
    'click .sign-out'(e, t) {
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
          setTimeout(() => {
            FlowRouter.go('/login')
          }, 200);
        } else if (result.isDenied) {
          // Swal.fire('Changes are not saved', '', 'info')
        }
      })
    }
  });
  
  
  Template.navbarLeft.onCreated(function () {})
  Template.navbarLeft.onRendered(function () {
    const route = FlowRouter.current()
  });
  Template.navbarLeft.helpers({
    navbar() {
      const route = FlowRouter.current().path
      const thisNavbar = navbar.map(function (x) {
        if (x.type == 2) {
          let valid = false
          for (const i of x.child) {
            if (i.href == route) {
              i.active = true
              valid = true
            } else {
              i.active = false
            }
          }
          x.active = valid
        } else if (x.type == 1) {
          x.active = x.href == route
        }
        return x
      })
      // console.log(thisNavbar);
      return thisNavbar
    },
    equals(a, b) {
      return a == b
    }
  });
  
  Template.navbarLeft.events({});
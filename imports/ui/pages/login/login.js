import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './login.html';
import './style.css'

function autoText(e) {  
  var $field = $(e.currentTarget).closest('.form-group');
  if (e.currentTarget.value) {
    $field.addClass('field--not-empty');
  } else {
    $field.removeClass('field--not-empty');
  }
}
Template.login.onCreated(function () {  
  document.title = "Login"
})
Template.login.events({
  'submit .login-form'(event) {
    event.preventDefault();
    const { target } = event;


    const username = target.username.value;
    const password = target.password.value;

    Meteor.loginWithPassword(username, password, function (err, res) {  
      if(err){
        failAlert(err.reason)
      }
      else{
        if(Meteor.userId()){
          Meteor.call('getOneUser', Meteor.userId(), function (err, res) {  
            // console.log(res);
            const thisUser = res
            successAlert("Welcome "+ thisUser.username)
            if(thisUser.isAdmin){
              FlowRouter.go('masterContainer', {});
            }
            else{
              FlowRouter.go('homepage', {});
            }
          })
        }
      }
    });
  },
  'input .form-control'(e, t){
    autoText(e)
  }
});
Template.register.onCreated(function () {  
  document.title = "Sign Up"
})
Template.register.events({
  'submit .login-form'(event) {
    event.preventDefault();
    const { target } = event;


    const username = target.username.value;
    const email = target.email.value;
    const password = target.password.value;
    const confirm_password = target.confirm_password.value;
    
    if(username.length == 0 || password.length == 0 || confirm_password.length == 0 || email.length == 0){
      failAlert("Please, fill the blank")
    }
    else if(password != confirm_password){
      failAlert("Password and confirm password is not same")
    }
    else{
      Meteor.call('registerUser', username, email, password, function (err, res) {  
        if(err){
          failAlert(err.reason)
        }
        else{
          successAlertBack("Success Register")
        }
        // console.log(res);
      })
    }
    // Meteor.loginWithPassword(username, password, function (err, res) {  
    //   
    //   else{
    //     if(Meteor.userId()){
    //       successAlert("Welcome "+ Meteor.user().username)
    //     }
    //   }
    // });
  },
  'input .form-control'(e, t){
    autoText(e)
  }
});

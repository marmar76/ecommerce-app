import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../../ui/pages/login/login'
import '../../ui/pages/app/app'
import '../../ui/pages/forbidden/forbidden'

import '../../ui/pages/master/master'
// FlowRouter.route('*', {
//     action() {
//       // Show 404 error page
//       this.render('base', 'App_notFound');
//     }
// });
FlowRouter.route('*', {
    action() {
        this.render('forbidden')
    },
});
FlowRouter.route('/', {
    name: 'mainContainer',
    template: 'mainContainer',
    action() {
        if(Meteor.userId()){
            this.render('mainContainer');
        }
        else{
            FlowRouter.go('login', {});
        }
    },
});
FlowRouter.route('/login', {
    name: 'login',
    template: 'login',
    action(){
        if(Meteor.userId()){
            FlowRouter.go('mainContainer', {});
        }
        this.render('login')
    }
})

FlowRouter.route('/register', {
    name: 'register',
    template: 'register',
    action(){
        if(Meteor.userId()){
            FlowRouter.go('mainContainer', {});
        }
        this.render('register')
    }
})

FlowRouter.route('/master', {
    name: 'masterContainer',
    template: 'masterContainer',
    action(){
        if(!Meteor.userId()){
            FlowRouter.go('login', {});
        }
        this.render('masterContainer', 'contentExample')
    }
})

FlowRouter.route('/master/users', {
    name: 'usersHome',
    template: 'masterContainer',
    action(){
        if(!Meteor.userId()){
            FlowRouter.go('login', {});
        }
        this.render('masterContainer', 'usersHome')
        
    },
    
})

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../../ui/pages/login/login'
import '../../ui/pages/items/items'
import '../../ui/pages/categories/categories'
import '../../ui/pages/subCategories/subCategories'
import '../../ui/pages/promotions/promotions'
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

FlowRouter.route('/master-users', {
    name: 'usersHome',
    template: 'userHome',
    action(){
        if(!Meteor.userId()){
            FlowRouter.go('login', {});
        }
        this.render('masterContainer', 'usersHome')
        
    },
    
})
//=====================================================
//=====================================================
FlowRouter.route('/items/create', {
    name: 'itemCreatePage',
    template: 'itemCreatePage',
    action() {
      this.render('itemCreatePage');
    },
})
//=====================================================
//                  CATEGORY
//=====================================================
FlowRouter.route('/categories/create', {
    name: 'categoryCreatePage',
    template: 'categoryCreatePage',
    action() {
      this.render('categoryCreatePage');
    },
})

FlowRouter.route('/subcategories/create', {
    name: 'subcategoryCreatePage',
    template: 'subcategoryCreatePage',
    action() {
      this.render('subcategoryCreatePage');
    },
})

//=====================================================
//                  PROMOTION     
//=====================================================
FlowRouter.route('/promotions/create', {
    name: 'promotionCreatePage',
    template: 'promotionCreatePage',
    action() {
      this.render('promotionCreatePage');
    },
})

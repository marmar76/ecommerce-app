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
FlowRouter.route('/master-users-create', {
    name: 'userCreatePage',
    template: 'userCreatePage',
    action(){
        if(!Meteor.userId()){
            FlowRouter.go('login', {});
        }
        this.render('masterContainer', 'userCreatePage')
        
    },
    
})
FlowRouter.route('/master-users-:_id-details', {
    name: 'userDetailPage',
    template: 'userDetailPage',
    action(){
        if(!Meteor.userId()){
            FlowRouter.go('login', {});
        }
        this.render('masterContainer', 'userDetailPage')
        
    },
    
})

//=====================================================
//                  ITEM
//=====================================================
FlowRouter.route('/master-items', {
    name: 'itemsHome',
    template: 'itemsHome',
    action(){
        if(!Meteor.userId()){
            FlowRouter.go('login', {});
        }
        this.render('masterContainer', 'itemsHome')
        
    },
    
})
FlowRouter.route('/master-items-create', {
    name: 'itemsCreatePage',
    template: 'itemsCreatePage',
    action() {
      this.render('masterContainer','itemsCreatePage');
    },
})

FlowRouter.route('/master-items-:_id-details', {
    name: 'itemsDetailPage',
    template: 'itemsDetailPage',
    action() {
      this.render('masterContainer','itemsDetailPage');
    },
})

// FlowRouter.route('/master-items/:_id/edit', {
//     name: 'itemsEditPage',
//     template: 'itemsEditPage',
//     action() {
//       this.render('masterContainer','itemsEditPage');
//     },
// })
//=====================================================
//                  CATEGORY
//=====================================================
FlowRouter.route('/master-categories', {
    name: 'categoriesHome',
    template: 'categoriesHome',
    action() {
      this.render('masterContainer', 'categoriesHome');
    },
})

FlowRouter.route('/master-categories-create', {
    name: 'categoriesCreatePage',
    template: 'categoriesCreatePage',
    action() {
      this.render('masterContainer', 'categoriesCreatePage');
    },
})

FlowRouter.route('/master-subcategories-create', {
    name: 'subCategoriesCreatePage',
    template: 'subCategoriesCreatePage',
    action() {
      this.render('masterContainer', 'subCategoriesCreatePage');
    },
})

//=====================================================
//                  PROMOTION     
//=====================================================
FlowRouter.route('/master-promotions', {
    name: 'promotionsHome',
    template: 'promotionsHome',
    action() {
      this.render('masterContainer', 'promotionsHome');
    },
})

FlowRouter.route('/master-promotions-create', {
    name: 'promotionsCreatePage',
    template: 'promotionsCreatePage',
    action() {
      this.render('masterContainer', 'promotionsCreatePage');
    },
})

FlowRouter.route('/master-promotions-:_id-details', {
    name: 'promotionsDetailPage',
    template: 'promotionsDetailPage',
    action() {
      this.render('masterContainer', 'promotionsDetailPage');
    },
})

FlowRouter.route('/master-promotions-:_id-edit', {
    name: 'promotionEditPage',
    template: 'promotionEditPage',
    action() {
      this.render('masterContainer', 'promotionEditPage');
    },
})

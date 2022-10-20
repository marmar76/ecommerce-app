import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../../ui/pages/login/login'
import '../../ui/pages/items/items'
import '../../ui/pages/categories/categories'
import '../../ui/pages/subCategories/subCategories'
import '../../ui/pages/promotions/promotions'
import '../../ui/pages/app/app'
import '../../ui/pages/forbidden/forbidden'

import '../../ui/pages/master/master'
import '../../ui/pages/test/test' 
import '../../ui/pages/shop/layouts/layouts' 
import '../../ui/pages/shop/homepage/homepage' 
import '../../ui/pages/shop/productPage/productPage' 
import '../../ui/pages/shop/cart/cart' 
import '../../ui/pages/shop/comparison/comparison' 
import '../../ui/pages/shop/checkout/checkout' 
import '../../ui/pages/shop/userSettings/userSettings' 
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
    name: 'homepage',
    template: 'homepage',
    action() {
        this.render('layouts', 'homepage')
        // if(Meteor.userId()){
        //     this.render('mainContainer');
        // }
        // else{
        //     FlowRouter.go('login', {});
        // }
    },
});
FlowRouter.route('/user/settings', {
    name: 'userSettings',
    template: 'userSettings',
    action() {
        this.render('layouts', 'userSettings')
        // if(Meteor.userId()){
        //     this.render('mainContainer');
        // }
        // else{
        //     FlowRouter.go('login', {});
        // }
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
FlowRouter.route('/items-:_id', {
    name: 'itemsClientDetailPage',
    template: 'itemsClientDetailPage',
    action() {
      this.render('itemsClientDetailPage');
    },
})

FlowRouter.route('/master-banner', {
    name: 'bannersHomePage',
    template: 'bannersHomePage',
    action() {
      this.render('masterContainer','bannersHomePage');
    },
})

FlowRouter.route('/master-banner-create', {
    name: 'bannersCreatePage',
    template: 'bannersCreatePage',
    action() {
      this.render('masterContainer','bannersCreatePage');
    },
})

// FlowRouter.route('/master-banner-:_id-details', {
//     name: 'bannersDetailPage',
//     template: 'bannersDetailPage',
//     action() {
//       this.render('masterContainer','bannersDetailPage');
//     },
// })

FlowRouter.route('/master-banner-:_id-edit', {
    name: 'bannersEditPage',
    template: 'bannersEditPage',
    action() {
      this.render('masterContainer','bannersEditPage');
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

FlowRouter.route('/master-subcategory-:_id-edit', {
    name: 'subCategoriesEditPage',
    template: 'subCategoriesEditPage',
    action() {
      this.render('masterContainer', 'subCategoriesEditPage');
    },
})
FlowRouter.route('/test', {
    name: 'test',
    template: 'test',
    action() {
      this.render('test');
    },
})

//=====================================================
//                  Client side     
//=====================================================
FlowRouter.route('/productPage/:_id', {
    name: 'productPage',
    template: 'productPage',
    action() {
      this.render('layouts','productPage');
    },
})
//id dari cart adalah id user
FlowRouter.route('/cart/:_id', {
    name: 'cart',
    template: 'cart',
    action() {
      this.render('layouts','cart');
    },
})
FlowRouter.route('/checkout/:_id', {
    name: 'checkout',
    template: 'checkout',
    action() {
      this.render('layouts','checkout');
    },
})

FlowRouter.route('/comparison/:_id', {
    name: 'comparison',
    template: 'comparison',
    action() {
      this.render('layouts','comparison');
    },
})
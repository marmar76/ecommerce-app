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
import '../../ui/pages/shop/productList/productList' 

// FlowRouter.route('*', {
//     action() {
//       // Show 404 error page
//       this.render('base', 'App_notFound');
//     }
// });
FlowRouter.route('*', {
    name: 'forbidden',
    template: 'forbidden',
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
FlowRouter.route('/search', {
    name: 'search',
    template: 'search',
    action() {
        this.render('layouts', 'productList')
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

FlowRouter.route('/master-models-:_id-details', {
    name: 'modelDetailPage',
    template: 'modelDetailPage',
    action() {
      this.render('masterContainer','modelDetailPage');
    },
}) 

FlowRouter.route('/master-models-:_id-edit', {
    name: 'modelEditPage',
    template: 'modelEditPage',
    action() {
      this.render('masterContainer','modelEditPage');
    },
}) 


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

FlowRouter.route('/master-categories-:_id-details', {
    name: 'categoriesDetailPage',
    template: 'categoriesDetailPage',
    action() {
      this.render('masterContainer', 'categoriesDetailPage');
    },
})
FlowRouter.route('/master-categories-:_id-edit', {
    name: 'categoriesEditPage',
    template: 'categoriesEditPage',
    action() {
      this.render('masterContainer', 'categoriesEditPage');
    },
})
FlowRouter.route('/master-subcategories', {
    name: 'subCategoriesHome',
    template: 'subCategoriesHome',
    action() {
      this.render('masterContainer', 'subCategoriesHome');
    },
})


FlowRouter.route('/master-subcategories-create', {
    name: 'subCategoriesCreatePage',
    template: 'subCategoriesCreatePage',
    action() {
      this.render('masterContainer', 'subCategoriesCreatePage');
    },
})

FlowRouter.route('/master-subcategories-:_id-edit', {
    name: 'subCategoriesEditPage',
    template: 'subCategoriesEditPage',
    action() {
      this.render('masterContainer', 'subCategoriesEditPage');
    },
})
FlowRouter.route('/master-subcategories-:_id-details', {
    name: 'subCategoriesDetailPage',
    template: 'subCategoriesDetailPage',
    action() {
      this.render('masterContainer', 'subCategoriesDetailPage');
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
//                  Master Banner     
//=====================================================
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
FlowRouter.route('/cart', {
    name: 'cart',
    template: 'cart',
    action() {
      this.render('layouts','cart');
    },
})
FlowRouter.route('/checkout', {
    name: 'checkout',
    template: 'checkout',
    action() {
      this.render('checkout');
    },
})

// FlowRouter.route('/comparison/:_id', {
//     name: 'comparison',
//     template: 'comparison',
//     action() {
//       this.render('layouts','comparison');
//     },
// })
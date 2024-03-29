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
import '../../ui/pages/shop/thankyou/thankyou' 
import '../../ui/pages/shop/support/support' 
import '../../ui/pages/shop/reviews/reviews' 
import '../../ui/pages/shop/landingPage/landingPage' 
import '../../ui/pages/shop/historyTransaction/historyTransaction' 

// FlowRouter.route('*', {
//     action() {
//       // Show 404 error page
//       this.render('base', 'App_notFound');
//     }
// });

const checkAdmin = function (id) {
    if(!id) return false
    return new Promise(function (resolve, reject) {  
        Meteor.call('getOneUser', id, function (err, res) {  
            if(err){
                reject(err)
            }
            else{
                resolve(res.isAdmin)
            }
        })
    })  
        console.log(res);
    // console.log(thisUser);
    return true
}

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
    trackPageView: true,
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
    async action(){
        if(!Meteor.userId()){
            FlowRouter.go('login', {});
        }
        const isAdmin = await checkAdmin(Meteor.userId())
        if(isAdmin){
            this.render('masterContainer', 'contentExample')
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    }
})

FlowRouter.route('/master-users', {
    name: 'usersHome',
    template: 'userHome',
    async action(){
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'usersHome')
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
    
})
FlowRouter.route('/master-users-create', {
    name: 'userCreatePage',
    template: 'userCreatePage',
    async action(){
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'userCreatePage')
        }
        else{
            FlowRouter.go('forbidden', {})
        }
        
    },
    
})
FlowRouter.route('/master-users-:_id-details', {
    name: 'userDetailPage',
    template: 'userDetailPage',
    async action(){
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'userDetailPage')
        }
        else{
            FlowRouter.go('forbidden', {})
        }
        
    },
    
})
FlowRouter.route('/master-users-:_id-edit', {
    name: 'userEditPage',
    template: 'userEditPage',
    async action(){
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'userEditPage')
        }
        else{
            FlowRouter.go('forbidden', {})
        }
        
    },
    
})

//=====================================================
//                  ITEM
//=====================================================
FlowRouter.route('/master-items', {
    name: 'itemsHome',
    template: 'itemsHome',
    async action(){
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'itemsHome')
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
    
})
FlowRouter.route('/master-items-create', {
    name: 'itemsCreatePage',
    template: 'itemsCreatePage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','itemsCreatePage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-items-:_id-details', {
    name: 'itemsDetailPage',
    template: 'itemsDetailPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','itemsDetailPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-models-:_id-details', {
    name: 'modelDetailPage',
    template: 'modelDetailPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','modelDetailPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
}) 

FlowRouter.route('/master-models-:_id-edit', {
    name: 'modelEditPage',
    template: 'modelEditPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','modelEditPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
}) 


//=====================================================
//                  CATEGORY
//=====================================================
FlowRouter.route('/master-categories', {
    name: 'categoriesHome',
    template: 'categoriesHome',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'categoriesHome');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-categories-create', {
    name: 'categoriesCreatePage',
    template: 'categoriesCreatePage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'categoriesCreatePage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-categories-:_id-details', {
    name: 'categoriesDetailPage',
    template: 'categoriesDetailPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'categoriesDetailPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})
FlowRouter.route('/master-categories-:_id-edit', {
    name: 'categoriesEditPage',
    template: 'categoriesEditPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'categoriesEditPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})
FlowRouter.route('/master-subcategories', {
    name: 'subCategoriesHome',
    template: 'subCategoriesHome',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'subCategoriesHome');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})


FlowRouter.route('/master-subcategories-create', {
    name: 'subCategoriesCreatePage',
    template: 'subCategoriesCreatePage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'subCategoriesCreatePage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-subcategories-:_id-edit', {
    name: 'subCategoriesEditPage',
    template: 'subCategoriesEditPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'subCategoriesEditPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})
FlowRouter.route('/master-subcategories-:_id-details', {
    name: 'subCategoriesDetailPage',
    template: 'subCategoriesDetailPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'subCategoriesDetailPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})


//=====================================================
//                  PROMOTION     
//=====================================================
FlowRouter.route('/master-promotions', {
    name: 'promotionsHome',
    template: 'promotionsHome',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'promotionsHome');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-promotions-create', {
    name: 'promotionsCreatePage',
    template: 'promotionsCreatePage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'promotionsCreatePage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-promotions-:_id-details', {
    name: 'promotionsDetailPage',
    template: 'promotionsDetailPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'promotionsDetailPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-promotions-:_id-edit', {
    name: 'promotionEditPage',
    template: 'promotionEditPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'promotionEditPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-subcategory-:_id-edit', {
    name: 'subCategoriesEditPage',
    template: 'subCategoriesEditPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer', 'subCategoriesEditPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})
// FlowRouter.route('/test', {
//     name: 'test',
//     template: 'test',
//     action() {
//       this.render('test');
//     },
// })

//=====================================================
//                  Master Banner     
//=====================================================
FlowRouter.route('/master-banner', {
    name: 'bannersHomePage',
    template: 'bannersHomePage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','bannersHomePage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/master-banner-create', {
    name: 'bannersCreatePage',
    template: 'bannersCreatePage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','bannersCreatePage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
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
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','bannersEditPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})


//=====================================================
//                  Master invoice     
//=====================================================
FlowRouter.route('/master-invoice', {
    name: 'invoiceHome',
    template: 'invoiceHome',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','invoiceHome');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})
FlowRouter.route('/master-invoice-:_id-detail', {
    name: 'invoiceDetail',
    template: 'invoiceDetail',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','invoiceDetail');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})
//=====================================================
//                  Client side     
//=====================================================
FlowRouter.route('/customer-support', {
    name: 'customerSupport',
    template: 'customerSupport',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(isAdmin){
            this.render('masterContainer','customerSupport');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/productPage/:_id', {
    name: 'productPage',
    template: 'productPage',
    trackPageView: true,
    action() {
        this.render('layouts','productPage');
    },
})
//id dari cart adalah id user
FlowRouter.route('/cart', {
    name: 'cart',
    template: 'cart',
    trackPageView: true,
    async action() {
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!isAdmin){
            this.render('layouts','cart');
        }
        else{
            FlowRouter.go('forbidden', {})
       }
    },
})

FlowRouter.route('/checkout', {
    name: 'checkout',
    template: 'checkout',
    trackPageView: true,
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        console.log(Meteor.userId());
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(!isAdmin){
            this.render('checkout');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/checkout/pay/:token', {
    name: 'blankCheckout',
    template: 'blankCheckout',
    trackPageView: true,
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        console.log(Meteor.userId());
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(!isAdmin){
            this.render('blankCheckout');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/thank-you', {
    name: 'thankyou',
    template: 'thankyou',
    trackPageView: true,
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(!isAdmin){
            this.render('thankyou');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/historyTrans', {
    name: 'historyTrans',
    template: 'historyTrans',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.user()){
            FlowRouter.go('login', {})
        }
        else if(!isAdmin){
            this.render('layouts','historyTrans');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/historyTrans/:_id/detail', {
    name: 'historyTransDetail',
    template: 'historyTransDetail',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(!isAdmin){
            this.render('layouts','historyTransDetail');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/support', {
    name: 'support',
    template: 'support',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!Meteor.userId()){
            FlowRouter.go('login', {})
        }
        else if(!isAdmin){
            this.render('layouts', 'support');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

FlowRouter.route('/landingPage', {
    name: 'landingPage',
    template: 'landingPage',
    trackPageView: true,
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!isAdmin){
            this.render('layouts', 'landingPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})
FlowRouter.route('/reviews/:_id/:itemIndex', {
    name: 'reviewPage',
    template: 'reviewPage',
    async action() {
        const isAdmin = await checkAdmin(Meteor.userId())
        if(!isAdmin){
            this.render('layouts', 'reviewPage');
        }
        else{
            FlowRouter.go('forbidden', {})
        }
    },
})

// FlowRouter.route('/comparison/:_id', {
//     name: 'comparison',
//     template: 'comparison',
//     action() {
//       this.render('layouts','comparison');
//     },
// })
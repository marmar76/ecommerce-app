import {
  Meteor
} from 'meteor/meteor';
import {
  Template
} from 'meteor/templating';
import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

import './master.html';
import './users.html';    
import './items.html';    
import './promotions.html';    
import './subCategories.html';    
import './categories.html';    

// import '../../assets/master/vendors/feather/feather.css'
import '../../assets/master/vendors/mdi/css/materialdesignicons.min.css'
import '../../assets/master/vendors/ti-icons/css/themify-icons.css'
import '../../assets/master/vendors/typicons/typicons.css'
// import '../../assets/master/vendors/simple-line-icons/css/simple-line-icons.css'
import '../../assets/master/vendors/css/vendor.bundle.base.css'
import '../../assets/master/js/select.dataTables.min.css'
import '../../assets/master/css/vertical-layout-light/style.css' 

import '../../assets/master/vendors/js/vendor.bundle.base.js'
import '../../assets/master/vendors/chart.js/Chart.min.js'
import '../../assets/master/vendors/bootstrap-datepicker/bootstrap-datepicker.min.js'
import '../../assets/master/js/off-canvas.js'
import '../../assets/master/js/hoverable-collapse.js'
// import './js/settings.js'
import '../../assets/master/js/todolist.js'
import '../../assets/master/js/jquery.cookie.js'
import '../../assets/master/js/Chart.roundedBarCharts.js'
// import './js/template.js'
import '../../assets/master/js/dashboard.js' 
const navbar = [
  {
      type: 1,
      href: '/master',
      icon: 'mdi mdi-grid-large menu-icon',
      title: 'Dashboard',
  },
  {
      type: 0,
      title: 'User Management'
  },
  {
      type: 2,
      title: 'User',
      icon: 'menu-icon mdi mdi-account',
      href: 'master-users',
      child: [
          {
              href: '/master-users',
              title: 'List User'
          },
          {
              href: '/master-users-create',
              title: 'Create User'
          },
          // {
          //     href: 'pages/ui-features/typography.html',
          //     title: 'Berhasil'
          // },
      ]
  },
  {
      type: 3,
      title: 'Item',
      icon: 'menu-icon mdi mdi-account',
      href: 'master-items',
      child: [
          {
              href: '/master-items',
              title: 'List Item'
          },
          {
              href: '/master-items-create',
              title: 'Create Item'
          }
      ]
  },
  {
      type: 4,
      title: 'Category',
      icon: 'menu-icon mdi mdi-account',
      href: 'master-categories',
      child: [
          {
              href: '/master-categories',
              title: 'List categories'
          },
          {
              href: '/master-categories-create',
              title: 'Create categories'
          },
          {
              href: '/master-subcategories-create',
              title: 'Create sub-categories'
          },
      ]
  },
  
  {
      type: 5,
      title: 'Promotion',
      icon: 'menu-icon mdi mdi-account',
      href: 'master-promotions',
      child: [
          {
              href: '/master-promotions',
              title: 'List Promotion'
          },
          {
              href: '/master-promotions-create',
              title: 'Create Promotion'
          }
      ]
  },
]

function autoText(e) {
  var $field = $(e.currentTarget).closest('.form-group');
  if (e.currentTarget.value) {
    $field.addClass('field--not-empty');
  } else {
    $field.removeClass('field--not-empty');
  }
}

function toggleBanner(show) {  
  if(show){
    $('#proBanner').removeClass('d-none');
    $('#proBanner').addClass('d-flex');
    $('.navbar').addClass('pt-5');
    $('.navbar').removeClass('fixed-top');
    $('.page-body-wrapper').removeClass('proBanner-padding-top');
    $('.navbar').addClass('mt-3');
  }
  else{
    $('#proBanner').addClass('d-none');
    $('#proBanner').removeClass('d-flex');
    $('.navbar').removeClass('pt-5');
    $('.navbar').addClass('fixed-top');
    $('.page-body-wrapper').addClass('proBanner-padding-top');
    $('.navbar').removeClass('mt-3');
  }
}

function initNav(param) {  
  $(".nav-item").each(function () {  
    $(this).removeClass("active");
  })
  const elem = $("#"+param)
  elem.addClass("active");
  // console.log(elem.('.sub-menu').length);
  if (elem.children('.sub-menu').length) {
    elem.closest('.collapse').addClass('show');
    elem.addClass('active');
  }
}
function initPage() {  
  var body = $('body');
  var contentWrapper = $('.content-wrapper');
  var scroller = $('.container-scroller');
  var footer = $('.footer');
  var sidebar = $('.sidebar');

  //Add active class to nav-link based on url dynamically
  //Active class can be hard coded directly in html file also as required

  // function addActiveClass(element) {
  //   if (element) {
  //     //for root url
  //     if (element.attr('href').indexOf("index.html") !== -1) {
  //       element.parents('.nav-item').last().addClass('active');
  //       if (element.parents('.sub-menu').length) {
  //         element.closest('.collapse').addClass('show');
  //         element.addClass('active');
  //       }
  //     }
  //   } else {
  //     //for other url
  //     if (element.attr('href').indexOf(current) !== -1) {
  //       element.parents('.nav-item').last().addClass('active');
  //       if (element.parents('.sub-menu').length) {
  //         element.closest('.collapse').addClass('show');
  //         element.addClass('active');
  //       }
  //       if (element.parents('.submenu-item').length) {
  //         element.addClass('active');
  //       }
  //     }
  //   }
  // }
  function activate(elem) {  
    elem.parents('.nav-item').last().addClass('active');
    if (elem.parents('.sub-menu').length) {
      elem.closest('.collapse').addClass('show');
      elem.addClass('active');
    }
  }
  function disable(elem) {  
    elem.parents('.nav-item').last().removeClass('active');
    if (elem.parents('.sub-menu').length) {
      elem.closest('.collapse').removeClass('show');
      elem.removeClass('active');
    }
  }
  // const currentRoute = FlowRouter.current()
  var current = FlowRouter.current().path.split('/')//.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
  current.splice(0, 1)
  // console.log(current);
  // $('.nav li a', sidebar).each(function () {
  //   var $this = $(this);
  //   let $thisArray = []
  //   if($this[0].href.includes('#') || true){
  //     $thisArray = $this[0].href.split('#')[1]
  //     console.log($thisArray == current[0], 'his');
  //     if($thisArray == current[0]){
  //       activate($this)
  //     }
  //   } 
  //   else{
  //     $thisArray = $this[0].href.split('/')
  //     $thisArray.splice(0, 3)
  //     if(JSON.stringify($thisArray) == JSON.stringify(current)){
  //       activate($this)
  //     }
  //     else{
  //       disable($this)
  //     }

  //   }
    // console.log($this[0].href);
    // console.log($thisArray);
    // console.log($this[0].pathname, $this[0].pathname == current);
    // console.log($thisArray == current);
    // addActiveClass($this, $this[0].pathname == current);
  // })

  // $('.horizontal-menu .nav li a').each(function () {
  //   var $this = $(this);
  //   addActiveClass($this);
  // })

  //Close other submenu in sidebar on opening any

  sidebar.on('show.bs.collapse', '.collapse', function () {
    sidebar.find('.collapse.show').collapse('hide');
  });


  //Change sidebar and content-wrapper height
  applyStyles();

  function applyStyles() {
    //Applying perfect scrollbar
    if (!body.hasClass("rtl")) {
      if ($('.settings-panel .tab-content .tab-pane.scroll-wrapper').length) {
        const settingsPanelScroll = new PerfectScrollbar('.settings-panel .tab-content .tab-pane.scroll-wrapper');
      }
      if ($('.chats').length) {
        const chatsScroll = new PerfectScrollbar('.chats');
      }
      if (body.hasClass("sidebar-fixed")) {
        if ($('#sidebar').length) {
          var fixedSidebarScroll = new PerfectScrollbar('#sidebar .nav');
        }
      }
    }
  }

  $('[data-bs-toggle="minimize"]').on("click", function () {
    if ((body.hasClass('sidebar-toggle-display')) || (body.hasClass('sidebar-absolute'))) {
      body.toggleClass('sidebar-hidden');
    } else {
      body.toggleClass('sidebar-icon-only');
    }
  });

  //checkbox and radios
  $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');

  //Horizontal menu in mobile
  $('[data-toggle="horizontal-menu-toggle"]').on("click", function () {
    $(".horizontal-menu .bottom-navbar").toggleClass("header-toggled");
  });
  // Horizontal menu navigation in mobile menu on click
  var navItemClicked = $('.horizontal-menu .page-navigation >.nav-item');
  navItemClicked.on("click", function (event) {
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (!($(this).hasClass('show-submenu'))) {
        navItemClicked.removeClass('show-submenu');
      }
      $(this).toggleClass('show-submenu');
    }
  })

  $(window).scroll(function () {
    if (window.matchMedia('(min-width: 992px)').matches) {
      var header = $('.horizontal-menu');
      if ($(window).scrollTop() >= 70) {
        $(header).addClass('fixed-on-scroll');
      } else {
        $(header).removeClass('fixed-on-scroll');
      }
    }
  });
  if ($.cookie('staradmin2-free-banner') != "true" && false) {
    document.querySelector('#proBanner').classList.add('d-flex');
    document.querySelector('.navbar').classList.remove('fixed-top');
  } else {
    document.querySelector('#proBanner').classList.add('d-none');
    document.querySelector('.navbar').classList.add('fixed-top');
  }

  if ($(".navbar").hasClass("fixed-top")) {
    document.querySelector('.page-body-wrapper').classList.remove('pt-0');
    document.querySelector('.navbar').classList.remove('pt-5');
  } else {
    document.querySelector('.page-body-wrapper').classList.add('pt-0');
    document.querySelector('.navbar').classList.add('pt-5');
    document.querySelector('.navbar').classList.add('mt-3');

  }
  
  // $('#navbar-search-icon').click(function () {
  //   $("#navbar-search-input").focus();
  // });
}

Template.navbarLeft.onCreated(function () {
})
Template.navbarLeft.onRendered(function () {
  const route = FlowRouter.current()
  console.log(route);
});
Template.navbarLeft.helpers({
  navbar(){
    const route = FlowRouter.current().path
    const thisNavbar = navbar.map(function (x) {
      if(x.type == 2){
        let valid = false
        for (const i of x.child) {
          if(i.href == route){
            i.active = true
            valid = true
          }
          else{
            i.active = false
          }
        }
        x.active = valid
      }
      else if(x.type == 1){
        x.active = x.href == route
      }
      return x
    })
    // console.log(thisNavbar);
    return thisNavbar
  },
  equals(a, b){
    return a == b
  }
});
Template.navbarLeft.events({
});
Template.masterContainer.onCreated(function () {
})
Template.masterContainer.onRendered(function () {
  toggleBanner(false)
});
Template.masterContainer.helpers({
});
Template.masterContainer.events({
  'click #bannerClose'(e, t){
    toggleBanner(false)
    // var date = new Date();
    // date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    // $.cookie('staradmin2-free-banner', "true", {
    //   expires: date
    // });
  },
});

Template.contentExample.onCreated(function () {
  document.title = "Mastah Example"
  // console.log(FlowRouter.current());
})
Template.contentExample.onRendered(function () {
  // initNav("nav-dashboard");
  initPage()

});
Template.contentExample.helpers({
  navmain(nav){
    return nav == "master"
  }
});
// focus input when clicking on search icon


Template.contentExample.events({
  'click #test'(e, t){
    console.log("click");
    // toggleBanner(true)
  }
});

//===============================================
//                    USER
//===============================================
Template.usersHome.onCreated(function () {  
  document.title = "Mastah User"
})

Template.usersHome.onRendered(function () {  
  // initNav("master-users-nav");
  initPage()
})

Template.userCreatePage.onCreated(function () {
  
})


Template.userCreatePage.events({
  'click #submit'(e, t){ 
    const user_username = $(username).val();
    const user_email = $(email).val();
    const user_password = $(password).val();
    const user_name = $(nameuser).val();
    const user_address = $(address).val();
    const user_gender = $('input[name="gender"]:checked').val() == "true" ? true : false; 
    const user_dob =new Date ($(dob).val());
    console.log(user_gender);
    const profile = {name: user_name, address: user_address, gender: user_gender, dob: user_dob};
    const data = {username: user_username, email: user_email, password: user_password, profile: profile};
    console.log(profile);
    console.log(data);
    Meteor.call('registerAdmin', data, function (err,res) {
      if(err){
        failAlert(err);
      }
      else{
        successAlertBack();
      } 
    });
  }
});

//===============================================
//                    ITEM
//===============================================
Template.itemsCreatePage.onCreated(function () {  
  const self=this;
  this.item = new ReactiveVar();
})

Template.itemsCreatePage.helpers({


})

Template.itemsCreatePage.events({  
  'click #submit'(e,t){
      const name = $(itemsName).val();
      const price = +$(itemsPrice).val();
      const description = $(itemsDescription).val();
      const status = true;
      const data = { name, price,description,status}; 
      if(name.length === 0){
        failAlert("Nama tidak boleh kosong!")
      }
      else if(price < 1 || price.length === 0){
        failAlert("Price tidak boleh kosong!")
      }
      else{
        Meteor.call('createItem', data, function (error, res) {  
          console.log(error);
          console.log(res);
          if(error){
            failAlert(error);
          }
          else{
            successAlertBack();
          }
        }) 
      }

  }
})

//===============================================
//                    CATEGORY
//===============================================
Template.categoriesCreatePage.onCreated(function () {  
  const self=this;
  this.category = new ReactiveVar();
})

Template.categoriesCreatePage.helpers({

})

Template.categoriesCreatePage.events({  
  'click #submit'(e,t){
      const name = $(categoryName).val();  
      const status = true;
      const data = { name, status}; 
      if(name.length === 0){
        failAlert("Nama tidak boleh kosong!")
      } 
      else{
        Meteor.call('createCategory', data, function (error, res) {  
          console.log(error);
          console.log(res);
          if(error){
            failAlert(error);
          }
          else{
            successAlertBack();
          }
        }) 
      }

  }
})

Template.subCategoriesCreatePage.onCreated(function () {  
  const self=this;
  this.subCategory = new ReactiveVar();
  Meteor.call('getAllCategory', function (err,res) {
      self.subCategory.set(res);
  });
})

Template.subCategoriesCreatePage.helpers({
  categories(){
      return Template.instance().subCategory.get();
  }

})

Template.subCategoriesCreatePage.events({  
  'click #submit'(e,t){
      const getCategory = t.subCategory.get();
      const name = $(subCategoryName).val();  
      const categoryId = $(categories).val();
      const status = true;
      const category = getCategory.find((x)=>{
          return x._id == categoryId
      });
      const categoryName = category.name;
      const data = { name, status, categoryId, categoryName}; 
      if(name.length === 0){
        failAlert("Nama tidak boleh kosong!")
      } 
      else{
        Meteor.call('createSubCategory', data, function (error, res) {  
          console.log(error);
          console.log(res);
          if(error){
            failAlert(error);
          }
          else{
            successAlertBack();
          }
        }) 
      }

  }
})
//===============================================
//                    PROMOTION
//===============================================
Template.promotionsHome.onCreated(function () {  
  const self=this;
  this.promotion = new ReactiveVar();
  Meteor.call('getAllPromotion', function (err,res) {
    self.promotion.set(res);
  });  
})

Template.promotionsHome.helpers({
  promotions(){
      return Template.instance().promotion.get(); 
  }

})

Template.promotionsCreatePage.onCreated(function () {  
  const self=this;
  this.promotion = new ReactiveVar(); 
})

Template.promotionsCreatePage.helpers({ 
})

Template.promotionsCreatePage.events({  
  'click #submit'(e,t){
      const name = $(promotionsName).val(); 
      const description = $(promotionsDescription).val();
      const status = true;
      const startDate = new Date($("#start").val());
      const expiredDate = new Date($("#end").val());
      const data = { name, startDate, expiredDate, description, status}; 
      if(name.length === 0){
        failAlert("Nama tidak boleh kosong!")
      }
      else if (!(startDate < expiredDate)) {
          failAlert("Tanggal Start harus kurang dari tanggal Expired")
      }
      else if(description.length == 0){
          failAlert("Description tidak boleh kosong")
      }
      else{
        Meteor.call('createPromotion', data, function (error, res) {  
          console.log(error);
          console.log(res);
          if(error){
            failAlert(error);
          }
          else{
            successAlertBack();
          }
        }) 
      }

  }
})
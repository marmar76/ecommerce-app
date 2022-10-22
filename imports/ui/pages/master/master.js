import {
  Meteor
} from 'meteor/meteor';
import {
  Template
} from 'meteor/templating';
import select2 from 'select2';
import './master.html';
import './users.html';
import './items.html';
import './promotions.html';
import './subCategories.html';
import './categories.html';
import './banners.html';

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
import moment from 'moment';
import Swal from 'sweetalert2';
import {
  SpecificationComparison
} from '../../../api/items/items';
export const navbar = [{
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
    child: [{
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
    type: 2,
    title: 'Item',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-items',
    child: [{
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
    type: 2,
    title: 'Category',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-categories',
    child: [{
        href: '/master-categories',
        title: 'List categories'
      },
      {
        href: '/master-subcategories',
        title: 'List Sub categories'
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
    type: 2,
    title: 'Promotion',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-promotions',
    child: [{
        href: '/master-promotions',
        title: 'List Promotion'
      },
      {
        href: '/master-promotions-create',
        title: 'Create Promotion'
      }
    ]
  },
  {
    type: 2,
    title: 'Banner',
    icon: 'menu-icon mdi mdi-account',
    href: 'master-banner',
    child: [{
        href: '/master-banner',
        title: 'List Banner'
      },
      {
        href: '/master-banner-create',
        title: 'Create Banner'
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


function initNav(param) {
  $(".nav-item").each(function () {
    $(this).removeClass("active");
  })
  const elem = $("#" + param)
  elem.addClass("active");
  // console.log(elem.('.sub-menu').length);
  if (elem.children('.sub-menu').length) {
    elem.closest('.collapse').addClass('show');
    elem.addClass('active');
  }
}
import './admin/navbar'
import './admin/container'
//===============================================
//                    USER
//===============================================
import './admin/user'
//===============================================
//                    ITEM
//===============================================
//ini codingan untuk client side
// Template.itemsHome.onCreated(function () {  
//   const self=this;
//   this.item = new ReactiveVar();
//   this.category = new ReactiveVar();
//   this.subcategory = new ReactiveVar(); 
//   this.now = new ReactiveVar(1);
//   Meteor.call('getAllCategory', function (err,res) {
//     self.category.set(res);
//     console.log(res);
// });
// })

// Template.itemsHome.helpers({
//   categories(){
//     return Template.instance().category.get();
//   },
//   now(){
//     return Template.instance().now.get();
//   },
//   subcategories(){ 
//     const category = Template.instance().category.get();
//     if(category){
//       const now = +Template.instance().now.get();
//       console.log(category[now].subcategory);
//       return category[now].subcategory
//     }
//     return [];
//   }
// })
// Template.itemsHome.events({
//   'click .tes'(e,t){
//     const click = $(e.target).val();
//     t.now.set(click)

//   }
// });


//===============================================
//                    CATEGORY
//===============================================
import './admin/category'
//===============================================
//                    PROMOTION
//===============================================
import './admin/promotion'

import './admin/banner'